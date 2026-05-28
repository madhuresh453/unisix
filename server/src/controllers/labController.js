import crypto from "crypto";
import { Lab } from "../models/Lab.js";
import { LabInstance } from "../models/LabInstance.js";
import { Enrollment } from "../models/Enrollment.js";
import { asyncHandler } from "../utils/helpers.js";
import { getIO } from "../config/socket.js";
import { hasPaidAccess } from "../middlewares/entitlementMiddleware.js";

function emitLabEvent(event, payload) {
  const io = getIO();
  if (!io) return;
  io.emit(event, payload);
}

function randomOctet() {
  return Math.floor(10 + Math.random() * 245);
}

function buildAssignedIp() {
  return `10.11.${randomOctet()}.${randomOctet()}`;
}

function buildVpnConfig(assignedIp, lab) {
  return {
    fileName: `uni6ctf-${lab?.slug || "lab"}-${assignedIp}.ovpn`,
    content: `# UNI6CTF VPN placeholder\n# connect to lab ${lab?.title || "lab"}\nremote ${assignedIp} 1194 udp\n# ca /path/to/ca.crt\n# cert /path/to/client.crt\n# key /path/to/client.key\n`,
    lastDownloadedAt: null
  };
}

async function findActiveInstance(userId, labId) {
  return LabInstance.findOne({
    user: userId,
    lab: labId,
    active: true,
    status: { $nin: ["terminated", "expired", "failed"] }
  });
}

async function ensurePaidAccess(req, lab) {
  if (!lab.premium) return true;
  const ok = await hasPaidAccess(req.user._id, "lab", lab._id);
  return ok;
}

export const deployLabInstance = asyncHandler(async (req, res) => {
  const lab = await Lab.findById(req.params.id).lean();
  if (!lab) return res.status(404).json({ message: "Lab not found." });
  if (!(await ensurePaidAccess(req, lab))) return res.status(403).json({ message: "Premium access required to deploy this lab." });

  let instance = await findActiveInstance(req.user._id, lab._id);
  if (instance) {
    return res.json({ instance, message: "Reusing active lab instance." });
  }

  const durationMinutes = Number(req.body.durationMinutes || lab.estimatedTime || 60);
  const assignedIp = buildAssignedIp();
  const vpnConfig = buildVpnConfig(assignedIp, lab);
  const containerId = `lab-${crypto.randomBytes(4).toString("hex")}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60000);

  instance = await LabInstance.create({
    user: req.user._id,
    lab: lab._id,
    status: "active",
    assignedIp,
    vpnConfig,
    startedAt: now,
    expiresAt,
    durationMinutes,
    resetCount: 0,
    environmentState: {
      bootSequence: ["Provisioning environment", "Configuring network", "Starting attack surface", "Ready"],
      targetHost: assignedIp,
      vpnStatus: "connected"
    },
    containerId,
    region: req.body.region || "asia-southeast-1",
    difficulty: lab.difficulty,
    telemetry: {
      activeUsers: lab.activeUsers || 0,
      launchedAt: now
    },
    active: true
  });

  await Lab.updateOne({ _id: lab._id }, { $inc: { activeUsers: 1, "analytics.starts": 1 } }).catch(() => null);
  await Enrollment.findOneAndUpdate(
    { userId: req.user._id, contentType: "lab", contentId: lab._id },
    { $setOnInsert: { enrolledAt: new Date(), progress: 0, completed: false } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).catch(() => null);

  emitLabEvent("lab:deploy", { userId: String(req.user._id), labId: String(lab._id), instanceId: String(instance._id), status: instance.status });

  res.status(201).json({
    instance: {
      _id: instance._id,
      status: instance.status,
      assignedIp: instance.assignedIp,
      vpnConfig: instance.vpnConfig,
      startedAt: instance.startedAt,
      expiresAt: instance.expiresAt,
      durationMinutes: instance.durationMinutes,
      environmentState: instance.environmentState,
      containerId: instance.containerId,
      region: instance.region,
      difficulty: instance.difficulty,
      telemetry: instance.telemetry
    },
    message: "Lab environment deployed successfully."
  });
});

export const getLabInstanceStatus = asyncHandler(async (req, res) => {
  const instance = await findActiveInstance(req.user._id, req.params.id);
  if (!instance) {
    return res.status(404).json({ message: "No active lab instance found." });
  }

  const now = new Date();
  if (instance.expiresAt && instance.expiresAt < now) {
    instance.status = "expired";
    instance.active = false;
    await instance.save();
    emitLabEvent("lab:status", { instanceId: String(instance._id), status: instance.status });
  }

  res.json({ instance });
});

export const resetLabInstance = asyncHandler(async (req, res) => {
  const instance = await findActiveInstance(req.user._id, req.params.id);
  if (!instance) return res.status(404).json({ message: "No active lab instance to reset." });

  instance.status = "resetting";
  instance.resetCount += 1;
  instance.environmentState = {
    ...instance.environmentState,
    lastResetAt: new Date(),
    resetCount: instance.resetCount,
    message: "Lab environment is resetting. Your target host will be restored in seconds."
  };
  await instance.save();

  instance.status = "active";
  await instance.save();

  emitLabEvent("lab:status", { instanceId: String(instance._id), status: instance.status, resetCount: instance.resetCount });

  res.json({ instance, message: "Lab instance reset successfully." });
});

export const terminateLabInstance = asyncHandler(async (req, res) => {
  const instance = await findActiveInstance(req.user._id, req.params.id);
  if (!instance) return res.status(404).json({ message: "No active lab instance to terminate." });

  instance.status = "terminated";
  instance.active = false;
  instance.terminatedAt = new Date();
  await instance.save();

  emitLabEvent("lab:terminate", { instanceId: String(instance._id), status: instance.status });

  res.json({ instance, message: "Lab session terminated." });
});

export const extendLabInstance = asyncHandler(async (req, res) => {
  const minutes = Math.max(5, Math.min(720, Number(req.body.minutes || 30)));
  const instance = await findActiveInstance(req.user._id, req.params.id);
  if (!instance) return res.status(404).json({ message: "No active lab instance to extend." });

  instance.durationMinutes = Number(instance.durationMinutes || 60) + minutes;
  instance.expiresAt = new Date(new Date(instance.expiresAt || new Date()).getTime() + minutes * 60000);
  instance.environmentState = {
    ...instance.environmentState,
    extendedAt: new Date(),
    extensionMinutes: minutes
  };
  await instance.save();

  emitLabEvent("lab:status", { instanceId: String(instance._id), status: instance.status, expiresAt: instance.expiresAt });

  res.json({ instance, message: `Lab session extended by ${minutes} minutes.` });
});

import { enqueueJob } from "../config/queue.js";

async function sendEmailJob(payload) {
  console.log("Email dispatched", payload);
}

export async function queueEmail({ to, subject, template, data }) {
  enqueueJob("email", { to, subject, template, data }, sendEmailJob);
  return { queued: true };
}

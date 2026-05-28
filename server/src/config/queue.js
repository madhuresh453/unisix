const jobs = [];
let timer = null;

function startWorker() {
  if (timer) return;
  timer = setInterval(async () => {
    const job = jobs.shift();
    if (!job) return;
    try {
      await job.handler(job.payload);
    } catch (error) {
      console.error("[QUEUE] Job failed", { name: job.name, message: error.message });
    }
  }, 500);
}

export function enqueueJob(name, payload, handler) {
  jobs.push({ name, payload, handler, createdAt: new Date().toISOString() });
  startWorker();
}

export function getQueueStats() {
  return {
    queued: jobs.length,
    workerActive: Boolean(timer)
  };
}

export function stopQueue() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}

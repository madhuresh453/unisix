export async function queueEmail({ to, subject, template, data }) {
  console.log("Email queued", { to, subject, template, data });
  return { queued: true };
}

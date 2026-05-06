export const submissionSchemaReference = {
  collection: "submissions",
  indexes: ["user challenge status", "ctf createdAt", "challenge status"],
  fields: {
    user: "ObjectId<User>",
    team: "ObjectId<Team>",
    ctf: "ObjectId<CTF>",
    challenge: "ObjectId<Challenge>",
    status: "accepted | rejected | duplicate | rate_limited | review",
    pointsAwarded: "Number",
    antiCheat: "riskScore reasons[]"
  }
};

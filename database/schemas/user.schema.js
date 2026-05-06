export const userSchemaReference = {
  collection: "users",
  indexes: ["handle", "email", "score"],
  fields: {
    name: "String",
    handle: "String unique",
    email: "String unique",
    password: "bcrypt hash",
    role: "user | captain | admin",
    country: "String",
    score: "Number",
    team: "ObjectId<Team>",
    solvedChallenges: "ObjectId<Challenge>[]"
  }
};

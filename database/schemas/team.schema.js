export const teamSchemaReference = {
  collection: "teams",
  fields: {
    name: "String unique",
    slug: "String unique",
    captain: "ObjectId<User>",
    members: "ObjectId<User>[]",
    country: "String",
    score: "Number",
    invites: "email token expiration"
  }
};

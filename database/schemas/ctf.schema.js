export const ctfSchemaReference = {
  collection: "ctfs",
  fields: {
    name: "String",
    slug: "String unique",
    status: "draft | upcoming | live | past",
    startsAt: "Date",
    endsAt: "Date",
    participants: "ObjectId<User>[]",
    teams: "ObjectId<Team>[]",
    challenges: "ObjectId<Challenge>[]"
  }
};

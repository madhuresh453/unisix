export const writeupSchemaReference = {
  collection: "writeups",
  indexes: ["slug", "status publishedAt", "text search"],
  fields: {
    title: "String",
    slug: "String unique",
    excerpt: "String",
    content: "String",
    category: "String",
    author: "ObjectId<User>",
    status: "draft | published | archived"
  }
};

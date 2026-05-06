export const challengeSchemaReference = {
  collection: "challenges",
  security: "Flags are stored as salted HMAC hashes and verified with timingSafeEqual.",
  fields: {
    title: "String",
    slug: "String unique",
    category: "String",
    difficulty: "String",
    basePoints: "Number",
    currentPoints: "Number",
    flagHash: "String select:false",
    flagSalt: "String select:false",
    hints: "title body cost[]"
  }
};

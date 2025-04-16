import { faker } from "@faker-js/faker";
export default (user, count, superiorIds, subordinateIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      superior: superiorIds[i % superiorIds.length],
      subordinate: subordinateIds[i % subordinateIds.length],

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};

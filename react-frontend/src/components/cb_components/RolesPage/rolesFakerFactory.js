import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      name: faker.lorem.sentence(""),
      description: faker.lorem.sentence(""),
      isDefault: faker.datatype.boolean(),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};

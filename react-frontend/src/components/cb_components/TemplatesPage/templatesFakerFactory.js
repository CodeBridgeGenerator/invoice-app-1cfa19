import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      name: faker.lorem.sentence(""),
      subject: faker.lorem.sentence(""),
      body: faker.lorem.sentence(""),
      variables: faker.lorem.sentence(""),
      image: faker.lorem.sentence(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};

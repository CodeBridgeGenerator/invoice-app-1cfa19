import { faker } from "@faker-js/faker";
export default (user, count) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      name: faker.lorem.sentence(""),
      companyNo: faker.database.mongodbObjectId(),
      newCompanyNumber: faker.datatype.number(),
      DateIncorporated: faker.date.past(),
      isdefault: faker.datatype.boolean(),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};

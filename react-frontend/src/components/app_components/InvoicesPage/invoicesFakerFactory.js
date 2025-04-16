import { faker } from "@faker-js/faker";
export default (user, count, companyIdIds, itemIdIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      companyId: companyIdIds[i % companyIdIds.length],
      itemId: itemIdIds[i % itemIdIds.length],
      quantity: faker.datatype.number(""),
      subTotal: faker.datatype.number(""),
      discount: faker.datatype.number(""),
      total: faker.datatype.number(""),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};

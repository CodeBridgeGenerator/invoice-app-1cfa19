
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
details: faker.datatype.number(""),
quantity: faker.datatype.number(""),
price: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};

const faker = require("faker");

const generateFakeUser = (rol) => {
  return {
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password(8),
    rol: rol,
  };
};

module.exports = generateFakeUser;

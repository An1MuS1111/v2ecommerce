import bcrypt from "bcrypt";
import range from "lodash/range";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import Seeder from "../Seeder";

const prisma = new PrismaClient();

class UserSeed extends Seeder {

    constructor(count: number = 10) {
      super(count); // Pass the count to the Seeder constructor
      this.createData(); // Generate the seed data
    }

  async createData() {
    const userData = range(this.count).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("12345678", 10),
      telephone: faker.phone.number(),
      is_admin: faker.datatype.boolean(),
      created_at: faker.date.anytime(),
      modified_at: new Date(),
    }));

    return userData;
  }

  async seed() {
    const users = await this.createData();
    
    for (const user of users) {
      const createdUser = await prisma.user.create({
        data: {
          ...user,
          user_address: {
            create: [{
              address_line1: faker.location.streetAddress(),
              address_line2: faker.location.secondaryAddress(),
              city: faker.location.city(),
              postal_code: faker.location.zipCode(),
              country: faker.location.country(),
              telephone: faker.phone.number(),
              mobile: faker.phone.number(),
            }],
          },
          user_payment: {
            create: [{
              payment_type: faker.finance.transactionType(),
              provider: faker.finance.creditCardIssuer(),
              account_no: parseInt(faker.finance.accountNumber(), 10),
              expiry: faker.date.future(),
            }],
          },
        },
      });
    }
  }
}

const seedUsers = async () => {
  const userSeed = new UserSeed(10);
  await userSeed.seed();
  await prisma.$disconnect();
};

seedUsers().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

export default UserSeed;

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

const generateUserData = async (count) => {
  return Array.from({ length: count }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("12345678", 10),
    telephone: faker.phone.number(),
    is_admin: faker.datatype.boolean(),
    created_at: faker.date.anytime(),
    modified_at: new Date(),
  }));
};

// const generatePostData = (userId) => ({
//   title: faker.lorem.sentence(),
//   content: faker.lorem.paragraphs(3),
//   user_id: userId,  // Assuming posts are linked via user_id
//   created_at: new Date(),
//   updated_at: new Date(),
// });


const seedUsers = async (count) => {
  try {
    // Clean up related data first
    const deletedAddresses = await prisma.userAddress.deleteMany(); // Delete all addresses
    console.log(`${deletedAddresses.count} user addresses deleted.`);

    const deletedPayments = await prisma.userPayment.deleteMany(); // Delete all payments
    console.log(`${deletedPayments.count} user payments deleted.`);

    const deletedUsers = await prisma.user.deleteMany(); // Delete all users
    console.log(`${deletedUsers.count} users deleted.`);

    // Generate user data
    const users = await generateUserData(count);

    for (const user of users) {
      await prisma.user.create({
        data: {
          ...user,
          user_address: {
            create: {
              address_line1: faker.location.streetAddress(),
              address_line2: faker.location.secondaryAddress(),
              city: faker.location.city(),
              postal_code: faker.location.zipCode(),
              country: faker.location.country(),
              telephone: faker.phone.number(),
              mobile: faker.phone.number(),
            },
          },
          user_payment: {
            create: {
              payment_type: faker.finance.transactionType(),
              provider: faker.finance.creditCardIssuer(),
              account_no: parseInt(faker.finance.accountNumber(), 10),
              expiry: faker.date.future(),
            },
          },

          // posts: {
          //   create: generatePostData(user.id),  // Generate post data related to the user
          // },
        },
      });
    }

    console.log(`User data has been seeded successfully. 🚀`);
  } catch (e) {
    console.error("Error during user seeding:", e);
  } finally {
    // Ensure the Prisma connection is closed
    await prisma.$disconnect();
  }
};

// Seed 10 users
seedUsers(10)
  .then(() => console.log("User seeding completed."))
  .catch((e) => {
    console.error("Error in main execution:", e);
    process.exit(1);
  });

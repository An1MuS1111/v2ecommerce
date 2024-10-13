import { PrismaClient } from "@prisma/client";
import UserSeed from "./data/userSeed";

const prisma = new PrismaClient();

const main = async () => {
  try {
    // Clean up existing users
    await prisma.user.deleteMany();

    // Instantiate the UserSeeder with the desired number of records
    const users = new UserSeed(3);

    // Loop through users and seed each user 
    for (const user of users.data) {
      await prisma.user.create({
        data: {
          ...(user as any),

          // Todo: add other datas related or based on the users
          // posts: {
          //   create: posts.data,
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

main()
  .then(() => console.log("User seeding completed."))
  .catch((e) => {
    console.error("Error in main execution:", e);
    process.exit(1);
  });

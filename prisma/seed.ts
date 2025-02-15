import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.doctor.createMany({
    data: [
      { name: "Dr. John Doe", specialization: "Cardiology" },
      { name: "Dr. Jane Smith", specialization: "Neurology" },
    ],
  });
  console.log('Sample doctors added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

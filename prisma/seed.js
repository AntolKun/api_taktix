const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Seed categories
  const categories = [
    { id: 1, category: "cpns", name: "CPNS" },
    { id: 2, category: "kedinasan", name: "Kedinasan" },
    { id: 3, category: "utbk", name: "UTBK" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Seed exam categories
  const examCategories = [
    { id: 1, category: "exam_category", name: "Kemampuan Penalaran Umum" },
    { id: 2, category: "exam_category", name: "Kemampuan Kuantitatif" },
    { id: 3, category: "exam_category", name: "Kemampuan Bahasa Inggris" },
  ];

  for (const examCategory of examCategories) {
    await prisma.examCategory.upsert({
      where: { id: examCategory.id },
      update: {},
      create: examCategory,
    });
  }

  // Seed soal data
  const soalData = [];

  categories.forEach((category, index) => {
    for (let i = 1; i <= 10; i++) {
      soalData.push({
        title: `Soal ${category.name} ${i}`,
        category_id: category.id,
        exam_category_id: (index % 3) + 1,
        grade_id: 1,
        duration: 60,
        total_question: 10,
        price: 0,
        is_free: true,
        is_public: true,
        rating: 8.7,
        creator_id: 1,
      });
    }
  });

  for (const soal of soalData) {
    await prisma.soal.create({ data: soal });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

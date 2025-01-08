const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Create Exam Categories
  const examCategory = await prisma.examCategory.create({
    data: {
      category: "Math",
      name: "Mathematics",
    },
  });

  // Create Categories
  const category = await prisma.category.create({
    data: {
      category: "Basic",
      name: "Basic Mathematics",
    },
  });

  // Create Soal
  const soal = await prisma.soal.create({
    data: {
      title: "Basic Math Exam",
      category_id: category.id,
      exam_category_id: examCategory.id,
      grade_id: 1,
      duration: 60,
      total_question: 3,
      price: 0,
      is_free: true,
      is_public: true,
      rating: 8.7,
      creator_id: 1,
    },
  });

  // Create Questions and Options
  const questions = [
    {
      question: "What is 2 + 2?",
      correct: "A",
      options: [
        { label: "A", content: "4" },
        { label: "B", content: "3" },
        { label: "C", content: "5" },
        { label: "D", content: "6" },
      ],
    },
    {
      question: "What is 3 * 3?",
      correct: "B",
      options: [
        { label: "A", content: "6" },
        { label: "B", content: "9" },
        { label: "C", content: "12" },
        { label: "D", content: "15" },
      ],
    },
    {
      question: "What is 10 - 5?",
      correct: "C",
      options: [
        { label: "A", content: "6" },
        { label: "B", content: "4" },
        { label: "C", content: "5" },
        { label: "D", content: "3" },
      ],
    },
  ];

  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        soal_id: soal.id,
        question: q.question,
        correct: q.correct,
      },
    });

    for (const option of q.options) {
      await prisma.option.create({
        data: {
          question_id: question.id,
          label: option.label,
          content: option.content,
        },
      });
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

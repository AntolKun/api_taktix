const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Create Exam Categories
  

  // Create Categories
  

  // Create Soal
  const soal = await prisma.soal.create({
    data: {
      title: "Tes Dasar Kepemimpinan",
      category_id: 2,
      exam_category_id: 6,
      grade_id: 1,
      duration: 10,
      total_question: 2,
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
      question: "Berapa Kaki manusia?",
      correct: "C",
      options: [
        { label: "A", content: "1" },
        { label: "B", content: "2" },
        { label: "C", content: "3" },
        { label: "D", content: "4" },
      ],
    },
    {
      question: "Berapa Lubang Hidung Manusia",
      correct: "C",
      options: [
        { label: "A", content: "3" },
        { label: "B", content: "4" },
        { label: "C", content: "2" },
        { label: "D", content: "1" },
      ],
    },
    {
      question: "Berapa Lubang Hidung Manusia",
      correct: "C",
      options: [
        { label: "A", content: "3" },
        { label: "B", content: "4" },
        { label: "C", content: "2" },
        { label: "D", content: "1" },
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

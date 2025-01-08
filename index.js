const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const validateAnswers = require("./middleware/validateAnswers");

const app = express();
const prisma = new PrismaClient();
const PORT = 3500;

// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", ""); // Mengambil token dari header Authorization

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.decode(token); // Decode token untuk mendapatkan informasi
//     req.user_id = decoded.user.id; // Asumsi user_id ada dalam token
//     next();
//   } catch (error) {
//     return res.status(400).json({ message: "Invalid token" });
//   }
// };

// Middleware

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded.user; // Simpan informasi user ke request
    next();
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token not found" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded.user; // Attach user info to request object
    next();
  });
};

app.use(cors());
app.use(bodyParser.json());

// Endpoint to fetch soal data
app.get("/api/soal", async (req, res) => {
  try {
    const { page = 1, perPage = 1000, category_id } = req.query; // Pagination and filter params
    const skip = (page - 1) * perPage;
    const take = parseInt(perPage);

    // Query filters
    const filters = {};
    if (category_id) {
      filters.category_id = parseInt(category_id);
    }

    // Fetch data from database
    const soalData = await prisma.soal.findMany({
      skip,
      take,
      where: filters,
      include: {
        exam_category: true,
        category: true,
      },
    });

    // Get total rows for pagination
    const totalRows = await prisma.soal.count({ where: filters });
    const totalPage = Math.ceil(totalRows / take);

    res.json({
      data: soalData,
      pagination: {
        total_rows: totalRows,
        total_perpage: take,
        total_page: totalPage,
        current_page: parseInt(page),
        next_page: page < totalPage ? parseInt(page) + 1 : null,
        previous_page: page > 1 ? parseInt(page) - 1 : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch soal by ID
app.get('/api/soal/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch soal by ID
    const soal = await prisma.soal.findUnique({
      where: { id: parseInt(id) },
      include: {
        exam_category: true,
        category: true
      }
    });

    if (!soal) {
      return res.status(404).json({ error: 'Soal not found' });
    }

    res.json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/soali/:soal_id', async (req, res) => {
  const { soal_id } = req.params;

  try {
    const soal = await prisma.soal.findUnique({
      where: { id: parseInt(soal_id) },
      include: {
        exam_category: true,
        category: true,
        questions: {
          include: { options: true },
        },
      },
    });

    if (!soal) {
      return res.status(404).json({ error: "Soal not found" });
    }

    res.status(200).json(soal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch soal" });
  }
});

// app.post("/api/answers", async (req, res) => {
//   const { user_id, soal_id, answers } = req.body;

//   // Validasi request body
//   if (!user_id || !soal_id || !Array.isArray(answers)) {
//     return res.status(400).json({ error: "Invalid request body" });
//   }

//   const soalId = parseInt(soal_id);
//   if (isNaN(soalId)) {
//     return res.status(400).json({ error: "Invalid soal_id" });
//   }

//   try {
//     // Ambil pertanyaan berdasarkan soal_id
//     const questions = await prisma.question.findMany({
//       where: { soal_id: soalId },
//     });

//     if (!questions.length) {
//       return res
//         .status(404)
//         .json({ error: "No questions found for this soal_id" });
//     }

//     // Proses jawaban dan hitung skor
//     const userAnswersPromises = questions.map(async (question) => {
//       const userAnswer = answers.find((a) => a.question_id === question.id);
//       if (!userAnswer) return 0;

//       const isCorrect = userAnswer.chosen === question.correct;

//       // Simpan jawaban user
//       await prisma.userAnswer.create({
//         data: {
//           user_id,
//           soal_id: soalId,
//           question_id: question.id,
//           chosen: userAnswer.chosen,
//           is_correct: isCorrect,
//         },
//       });

//       return isCorrect ? 100 / questions.length : 0;
//     });

//     const scores = await Promise.all(userAnswersPromises);
//     const totalScore = scores.reduce((acc, curr) => acc + curr, 0);

//     // Kirim respons
//     res
//       .status(200)
//       .json({ message: "Answers submitted", score: Math.round(totalScore) });
//   } catch (error) {
//     // Error handling Prisma dan umum
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       res.status(400).json({ error: "Prisma error: " + error.message });
//     } else {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// });






// Start the server

app.post("/api/answers", async (req, res) => {
  const { user_id, soal_id, answers } = req.body;

  // Validasi request body
  if (!user_id || !soal_id || !Array.isArray(answers)) {
    return res.status(400).json({
      error:
        "Invalid request. Ensure user_id, soal_id, and answers are provided.",
    });
  }

  const soalId = parseInt(soal_id);
  if (isNaN(soalId)) {
    return res.status(400).json({ error: "Invalid soal_id" });
  }

  try {
    // Ambil pertanyaan berdasarkan soal_id
    const questions = await prisma.question.findMany({
      where: { soal_id: soalId },
    });

    if (!questions.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this soal_id" });
    }

    // Proses jawaban dan hitung skor
    const userAnswersPromises = questions.map(async (question) => {
      const userAnswer = answers.find((a) => a.question_id === question.id);
      if (!userAnswer) return 0;

      const isCorrect = userAnswer.chosen === question.correct;

      return isCorrect ? 100 / questions.length : 0;
    });

    const scores = await Promise.all(userAnswersPromises);
    const totalScore = scores.reduce((acc, curr) => acc + curr, 0);

    // Simpan jawaban ke tabel History
    await prisma.history.create({
      data: {
        user_id,
        soal_id: soalId,
        score: Math.round(totalScore), // Skor total
        answers: JSON.stringify(answers), // Simpan jawaban dalam format JSON
      },
    });

    // Kirim respons
    res.status(200).json({
      message: "Answers submitted",
      score: Math.round(totalScore),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.get("/api/riwayat/:soal_id", verifyToken, async (req, res) => {
//   const { soal_id } = req.params;
//   const { user_id } = req;

//   try {
//     // Cek apakah riwayat dengan soal_id dan user_id tersebut ada
//     const history = await History.findOne({
//       where: { user_id: user_id, soal_id: soal_id },
//     });

//     if (!history) {
//       return res
//         .status(404)
//         .json({ message: "History not found for this user and soal" });
//     }

//     // Mengirimkan riwayat jika ditemukan
//     return res.status(200).json({
//       status: "success",
//       data: history,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/api/history", verifyToken, (req, res) => {
//   const userId = req.user.id; // Dapatkan userId dari token
//   const soalId = req.query.soalId;

//   // Cari riwayat berdasarkan userId dan soalId
//   const history = History.filter(
//     (h) => h.userId === userId && h.soalId === parseInt(soalId)
//   );

//   if (history.length === 0) {
//     return res.status(404).json({ message: "History not found" });
//   }

//   res.json(history);
// });


app.get("/api/historya/:soalId", async (req, res) => {
  // const userId = req.user.id; // Dapatkan userId dari token
  const { soalId } = req.params; // Ambil soalId dari parameter URL

  try {
    // Cari riwayat berdasarkan userId dan soalId
    const history = await prisma.history.findMany({
      where: {
        // user_id: userId, // Menggunakan user_id dari token
        soal_id: parseInt(soalId), // Menggunakan soal_id dari parameter URL
      },
      include:{
        soal: true
      }
    });

    if (history.length === 0) {
      return res.status(404).json({ message: "History not found" });
    }

    // Mengirimkan riwayat jika ditemukan
    res.json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

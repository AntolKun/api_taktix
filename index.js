const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to fetch soal data
app.get("/api/soal", async (req, res) => {
  try {
    const { page = 1, perPage = 1, category_id } = req.query; // Pagination and filter params
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






// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

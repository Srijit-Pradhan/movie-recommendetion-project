// Step 1: Express import korchi router toiri korar jonno
const express = require("express");

// Step 2: Amader toiri kora controller function gulo import korchi
const { registerUser, loginUser } = require("../controllers/auth.controller"); // Changed to auth.controller

// Step 3: Express theke ekta notun router toiri korlam
const router = express.Router();

// Step 4: Route gulo (URLs) define korchi
// POST /api/auth/register URL e request asle 'registerUser' function ta cholbe
router.post("/register", registerUser);

// POST /api/auth/login URL e asle 'loginUser' funtion ta cholbe
router.post("/login", loginUser);

// Step 5: Route gulo export korchi, jate server.js theke use korte pari
module.exports = router;

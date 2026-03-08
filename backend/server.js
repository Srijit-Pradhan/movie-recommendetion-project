// Step 1: Dorkari modules import korchi
const express = require("express"); // Web server bananor jonno
const dotenv = require("dotenv"); // Secret API keys/variables load korar jonno
const cors = require("cors"); // Frontend ke backend er sathe kotha bolar permission dewar jonno
const connectDB = require("./config/db"); // Database er sathe connect krar function

// Step 2: .env file theke sob info load kora
dotenv.config();

// Step 3: MongoDB Database connect kora (connectDB function call kore)
connectDB();

// Step 4: Amader node+express backend application toiri kora
const app = express();

// Step 5: Middleware setup (Request processing er jonno)
// 'cors' enable korle onno domain theke amader server e API call kora jabe e.g React frontend theke
app.use(cors());
// 'express.json()' thakle request e pathano JSON data ke javascript object e convert kore debe backend
app.use(express.json());

// Step 6: Ekta simple route to test (Check korar jonno server chalche kina)
app.get("/api", (req, res) => {
  res.send("Movie Platform API is running...");
});

// Step 7: Baki sob API endpoints ba Router gulo nilam
const authRoutes = require("./routes/auth.routes"); // updated to auth.routes
const movieRoutes = require("./routes/movie.routes"); // updated to movie.routes
const userRoutes = require("./routes/user.routes"); // updated to user.routes

// Kon rasta e jale kon router hobe ta define kora
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// Step 8: Jodi kono bhul URL (Route) keu hit kore, tahole ekta 404 error catch kore pathie debo
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // next(error) call korle nicher general error handler ta chalabe Express
});

// Step 9: General Error Handler
// Server theke directly HTML er bodole amra beautifully format kora JSON mssage dekhabo errro er jonno
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message, // Error er main message
    // Development e thakle pura stacktrace (kotha theke eleo error) pathabo, production e bad debo
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Step 10: Port define kora (env theke nebo ba 3000) ar Server chalu kora
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

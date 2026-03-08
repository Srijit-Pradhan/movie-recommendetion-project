// Step 1: User model ar token generator import korchi
const User = require("../models/user.model"); // Updated to user.model
const generateToken = require("../utils/generateToken");

// Step 2: Register User Controller
// POST /api/auth/register (Natun user toiri korar jonno)
const registerUser = async (req, res) => {
  try {
    // Frontend theke pathano data gulo (name, email, password) req.body theke ber korchi
    const { name, email, password } = req.body;

    // Database e check korchi ei email diye aage theke kono user ache kina
    const userExists = await User.findOne({ email });

    // Jodi thake, tahole error jabe
    if (userExists) {
      res.status(400); // 400 mane Bad Request
      throw new Error("User already exists"); // Error ta amra custom dibo
    }

    // Natun user database e add korchi
    // (Password ta automatically hash hoye jabe amader User model er pre-save hook theke)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Jodi user successfully toiri hoy, tahole tar data ar ekta notun JWT token frontend ke pathabo
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // Token call kore generate korlam
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    // Error asle seta catch block e dhukbe
    res
      .status(res.statusCode === 200 ? 500 : res.statusCode)
      .json({ message: error.message });
  }
};

// Step 3: Login User Controller
// POST /api/auth/login (User login korar jonno)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Database e email diye user khujchi
    const user = await User.findOne({ email });

    // Check korchi: User ache kina AND password match korche kina
    // 'matchPassword' function ta amra User model e baniyechi bcrypt diye check korar jonno
    if (user && (await user.matchPassword(password))) {
      // Shob thik thakle token ar data return korbo
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // 401 mane Unauthorized
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res
      .status(res.statusCode === 200 ? 500 : res.statusCode)
      .json({ message: error.message });
  }
};

// Step 4: Export korchi jate routes file e use korte pari
module.exports = { registerUser, loginUser };

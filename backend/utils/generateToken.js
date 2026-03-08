// Step 1: Import jsonwebtoken, which allows us to create secure tokens
const jwt = require("jsonwebtoken");

// Step 2: Create a function that takes a user ID and returns a token
const generateToken = (id) => {
  // jwt.sign creates the token.
  // Argument 1: The payload (data we want to store in the token, here just the user id)
  // Argument 2: Our secret key from .env
  // Argument 3: Options, like how long the token is valid for (e.g., 30 days)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Step 3: Export the function
module.exports = generateToken;

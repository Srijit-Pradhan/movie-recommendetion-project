// Step 1: Import mongoose to define our schema
const mongoose = require("mongoose");
// Step 2: Import bcryptjs to securely hash passwords before saving them
const bcrypt = require("bcryptjs");

// Step 3: Define the User Schema (the structure of our user data in MongoDB)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no two users can sign up with the same email
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      // This field helps us distinguish between normal users and admins
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    // We'll store an array of Movie IDs for the user's favorites
    favorites: [
      {
        type: String,
      },
    ],
    // We'll also store their watch history similarly
    watchHistory: [
      {
        type: String,
      },
    ],
    bookmarks: [
      {
        type: String,
      },
    ],
    watchlist: [
      {
        type: String,
      },
    ],
  },
  {
    // Step 4: Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

// Step 5: Pre-save middleware to hash the user's password before saving to the database
// NOTE: When using async functions in Mongoose middleware, do NOT call next().
// Mongoose automatically resolves the save chain when the async function returns.
userSchema.pre("save", async function () {
  // If the password field wasn't modified in this request, skip hashing
  if (!this.isModified("password")) {
    return; // exit early — no need to hash
  }
  // Generate a salt (random data added to the password)
  const salt = await bcrypt.genSalt(10);
  // Hash the password combined with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Step 6: A method attached to the user to compare entered password with the hashed password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Step 7: Create the User model from the schema and export it
const User = mongoose.model("User", userSchema);
module.exports = User;

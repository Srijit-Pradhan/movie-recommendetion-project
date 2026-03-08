// Step 1: Amra jsonwebtoken ar User model import korchi
// JSON Web Token (jwt) diye amra verify korbo user logged in ache kina
const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Updated to user.model

// Step 2: 'protect' middleware function banacchi.
// Ei function ta check korbe user er kache valid token ache kina. Token thaklei se route access korte parbe.
const protect = async (req, res, next) => {
  let token;

  // Step 3: Check korchi header e 'authorization' ache kina, ar seta 'Bearer ' diye shuru hocche kina
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Step 4: Token ta ber kore anchi (Format: "Bearer <token>" tai array er 2nd element ta nebo)
      token = req.headers.authorization.split(" ")[1];

      // Step 5: Token ta verify korchi amader secret key diye (process.env.JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Step 6: Token tekhe je ID ta pelam, sei ID er user database theke khuje req.user e set korchi.
      // password ta exclude korchi ('.select("-password")') jate password log na hoye jay secure thakar jonno.
      req.user = await User.findById(decoded.id).select("-password");

      // Jodi user banned thake, tahole error debo
      if (req.user && req.user.isBanned) {
        res.status(403);
        return next(new Error("User is banned from the platform")); // User banned!
      }

      // Step 7: Sob thik thakle next() call korbo jate porer function ba route cholte pare
      return next();
    } catch (error) {
      // Token jodi bhul ba expired hoy, tahole error hobe
      console.error(error);
      res.status(401);
      return next(new Error("Not authorized, token failed")); // Auth fail koreche
    }
  }

  // Step 8: Jodi token ekebare na e thake (header theke)
  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token")); // Token e nei!
  }
};

// Step 9: 'admin' middleware function
// Eta check korbe logged in user er role 'admin' kina
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Admin hole aage jete dao
  } else {
    res.status(401); // Admin na hole error
    return next(new Error("Not authorized as an admin"));
  }
};

// Step 10: Duto middleware eksathe export korchi jate routes gulo te use kora jay
module.exports = { protect, admin };

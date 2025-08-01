//A JWT is like a signed note that a user carries to prove they’ve logged in. It contains user data (like their ID), and it's digitally signed using a secret key so no one can fake it.


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      //decodes to get the id sent from login/register=token only carries the user’s ID.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

   ////////   // Get user from the token=use that ID to fetch the full user details from MongoDB
   //After the middleware runs, req.user now holds the real user data from the database. Then, your routes or controllers can access it like:
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }else{
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }

  
};

// Admin middleware
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(401).json({ message: 'Not authorized as an admin' });
//   }
// };


module.exports = { protect};
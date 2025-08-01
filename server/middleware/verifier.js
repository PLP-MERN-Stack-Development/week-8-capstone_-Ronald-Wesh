const isVerifier = (req, res, next) => {
    const user = req.user;
  
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can perform this action.' });
    }
  
    next();
  };
  
  module.exports = isVerifier;
  
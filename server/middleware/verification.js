// Checks if user is a landlord.

// Checks landlord verification status from DB.

// Uses next() properly
const checkVerifiedLandlord = async (req, res, next) => {
  try{
    // if (req.user.role !== 'landlord') {
    //   res.status(403);
    //   throw new Error('Only landlords can perform this action');
    // }
  
    // const landlord = await User.findById(req.user._id);
    
    // if (!landlord.isVerified) {
    //   res.status(403);
    //   throw new Error('Please complete verification before listing properties');
    // }
    if (
      req.user &&
      req.user.role === 'landlord' &&
      req.user.isVerified &&
      req.user.verification_status === 'verified'
    ) {
      next();
    } else {
      return res.status(403).json({ message: 'Only verified landlords can perform this action' });
    }
  }catch (err) {
    return res.status(500).json({ message: 'Server error during verification check' });
  }
  
    next();
  };
module.exports=checkVerifiedLandlord; 
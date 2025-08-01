const Verification = require('../models/Verification');

exports.submitVerification = async (req, res) => {
  try {
    // const { userId, submittedBy, documents } = req.body;
    // const request = new Verification({ userId, submittedBy, documents });
    // await request.save();
    // res.status(201).json(request);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
  
    user.isVerified = true;
    user.verification_status = "verified";
    user.verified_by = req.body.verified_by || "admin";
    await user.save();
    res.json({ message: "User verified", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Verification.find().populate('userId', 'username');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

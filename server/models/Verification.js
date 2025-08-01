const mongoose=require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    Landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only have one active verification
    },

    Verifier: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",//Admin
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    notes: String // Rejection reasons
},{timestamps:true});


module.exports=mongoosse.model("Verification",verificationSchema);

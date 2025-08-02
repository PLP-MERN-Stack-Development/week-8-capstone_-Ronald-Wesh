const mongoose=require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only have one active verification
    },
    requestMessage: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "", // Optional note from landlord (why they want to be verified)
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    reviwedBy: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",//Admin
      required: true,
    },
    notes: String // Rejection reasons
},{timestamps:true});


module.exports=mongoose.model("Verification",verificationSchema);

const { default: mongoose } = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Building name is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Building address is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        // required: true,
      },
    },
    description: {
      type: String,
      default: "No description provided.",
      trim: true,
    },

    // campus_proximity: {
    //   type: String,
    //   required: false,
    //   trim: true,
    //   // Example: "Near Kenyatta University"
    // },

    average_rating: {
      type: Number,
      default: 0,
    },

    total_reviews: {
      type: Number,
      default: 0,
    },

  
  },
  {
    timestamps: true,
  }
);

// Optional: Enable spatial search for buildings
buildingSchema.index({ location: "2dsphere" });

module.exports=mongoose.model("Building", buildingSchema);

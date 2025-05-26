// backend/models/partnerModel.js
const mongoose = require("mongoose");

const partnerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    job_title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    commission: {
      type: Number, // e.g., "95%"
      required: true,
    },
    total_payout: {
      type: Number, // e.g., "$1,878.50"
      required: true,
    },
    affiliate_link: {
      type: String,
      default: "www.kuicktag.com/?ref=affiliate123",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Partner", partnerSchema);

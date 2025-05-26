const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    company_email: {
      type: String,
      required: true,
      unique: true,
    },
    company_number: {
      type: Number,
      required: true,
      unique: true,
    },
    company_department: {
      type: String,
      required: true,
    },
    company_job_title: {
      type: String,
      required: true,
    },
    company_industry_type: {
      type: String,
      required: true,
    },
    company_country: {
      type: String,
      required: true,
    },
    company_state: {
      type: String,
      required: true,
    },
    company_city: {
      type: String,
      required: true,
    },
    company_zip_code: {
      type: String,
      required: true,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);

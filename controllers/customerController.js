const asyncHandler = require("express-async-handler");
const customerModel = require("../models/customerModel");
const companyModel = require("../models/companyModel");
const partnerModel = require("../models/partnerModel");

const addCustomer = asyncHandler(async (req, res) => {
  const {
    company,
    partner,
    email,
    phone,
    country,
    city,
    customer_name,
    status,
    youtube_link,
  } = req.body;

  console.log("Received customer data:", req.body);
  console.log("User ID from token:", req.user?._id);

  if (
    !company ||
    !partner ||
    !email ||
    !phone ||
    !country ||
    !city ||
    !customer_name ||
    !status
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const companyExists = await companyModel.findById(company);
  if (!companyExists) {
    res.status(404);
    throw new Error("Company not found");
  }

  const partnerExists = await partnerModel.findById(partner);
  if (!partnerExists) {
    res.status(404);
    throw new Error("Partner not found");
  }

  const findCustomer = await customerModel.findOne({ email });
  if (findCustomer) {
    res.status(405);
    throw new Error("Customer email already exists");
  }

  try {
    const createdCustomer = await customerModel.create({
      user: req.user._id,
      company,
      partner,
      email,
      phone,
      country,
      city,
      customer_name,
      status,
      youtube_link: youtube_link || "www.kuicktag.com/?ref=affiliate123",
    });
    console.log("Customer created:", createdCustomer);
    res.status(201).json(createdCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500);
    throw new Error("Failed to create customer");
  }
});

const getAllCustomers = asyncHandler(async (req, res) => {
  const allCustomers = await customerModel
    .find()
    .populate("company", "company_name")
    .populate("partner", "name status");
  res.json(allCustomers);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const customer = await customerModel.findById(customerId);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  await customerModel.findByIdAndDelete(customerId);
  res.json("Customer deleted");
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const {
    company,
    partner,
    email,
    phone,
    country,
    city,
    customer_name,
    status,
    youtube_link,
  } = req.body;

  console.log(
    "Received update customer data:",
    req.body,
    "for customer:",
    customerId
  );

  if (
    !company ||
    !partner ||
    !email ||
    !phone ||
    !country ||
    !city ||
    !customer_name ||
    !status
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const companyExists = await companyModel.findById(company);
  if (!companyExists) {
    res.status(404);
    throw new Error("Company not found");
  }

  const partnerExists = await partnerModel.findById(partner);
  if (!partnerExists) {
    res.status(404);
    throw new Error("Partner not found");
  }

  const customer = await customerModel.findById(customerId);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const existingCustomer = await customerModel.findOne({
    email,
    _id: { $ne: customerId },
  });
  if (existingCustomer) {
    res.status(405);
    throw new Error("Customer email already exists");
  }

  try {
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
      {
        company,
        partner,
        email,
        phone,
        country,
        city,
        customer_name,
        status,
        youtube_link: youtube_link || "www.kuicktag.com/?ref=affiliate123",
      },
      { new: true }
    );
    console.log("Customer updated:", updatedCustomer);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500);
    throw new Error("Failed to update customer");
  }
});

module.exports = {
  addCustomer,
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
};

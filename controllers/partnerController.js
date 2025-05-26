// backend/controllers/partnerController.js
const asyncHandler = require("express-async-handler");
const partnerModel = require("../models/partnerModel");

const addPartner = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    country,
    city,
    job_title,
    status,
    commission,
    total_payout,
    affiliate_link,
  } = req.body;

  console.log("Received partner data:", req.body);
  console.log("User ID from token:", req.user?._id);

  if (
    !name ||
    !email ||
    !phone ||
    !country ||
    !city ||
    !job_title ||
    !status ||
    !commission ||
    !total_payout
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const findPartner = await partnerModel.findOne({ email });
  if (findPartner) {
    res.status(405);
    throw new Error("Partner email already exists");
  }

  try {
    const createdPartner = await partnerModel.create({
      user: req.user._id,
      name,
      email,
      phone,
      country,
      city,
      job_title,
      status,
      commission,
      total_payout,
      affiliate_link: affiliate_link || "www.kuicktag.com/?ref=affiliate123",
    });
    console.log("Partner created:", createdPartner);
    res.status(201).json(createdPartner);
  } catch (error) {
    console.error("Error creating partner:", error);
    res.status(500);
    throw new Error("Failed to create partner");
  }
});

const getAllPartners = asyncHandler(async (req, res) => {
  const allPartners = await partnerModel.find();
  res.json(allPartners);
});

const deletePartner = asyncHandler(async (req, res) => {
  const partnerId = req.params.partnerId;
  const partner = await partnerModel.findById(partnerId);
  if (!partner) {
    res.status(404);
    throw new Error("Partner not found");
  }
  await partnerModel.findByIdAndDelete(partnerId);
  res.json("Partner deleted");
});

const updatePartner = asyncHandler(async (req, res) => {
  const partnerId = req.params.partnerId;
  const {
    name,
    email,
    phone,
    country,
    city,
    job_title,
    status,
    commission,
    total_payout,
    affiliate_link,
  } = req.body;

  console.log(
    "Received update partner data:",
    req.body,
    "for partner:",
    partnerId
  );

  if (
    !name ||
    !email ||
    !phone ||
    !country ||
    !city ||
    !job_title ||
    !status ||
    !commission ||
    !total_payout
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const partner = await partnerModel.findById(partnerId);
  if (!partner) {
    res.status(404);
    throw new Error("Partner not found");
  }

  const existingPartner = await partnerModel.findOne({
    email,
    _id: { $ne: partnerId },
  });
  if (existingPartner) {
    res.status(405);
    throw new Error("Partner email already exists");
  }

  try {
    const updatedPartner = await partnerModel.findByIdAndUpdate(
      partnerId,
      {
        name,
        email,
        phone,
        country,
        city,
        job_title,
        status,
        commission,
        total_payout,
        affiliate_link: affiliate_link || "www.kuicktag.com/?ref=affiliate123",
      },
      { new: true }
    );
    console.log("Partner updated:", updatedPartner);
    res.status(200).json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    res.status(500);
    throw new Error("Failed to update partner");
  }
});

module.exports = {
  addPartner,
  getAllPartners,
  deletePartner,
  updatePartner,
};

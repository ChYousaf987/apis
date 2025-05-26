// backend/routes/partnerRoutes.js
const express = require("express");
const authHandler = require("../middlewares/authMiddleware");
const {
  addPartner,
  getAllPartners,
  deletePartner,
  updatePartner,
} = require("../controllers/partnerController");

const partnerRouter = express.Router();

partnerRouter.post("/add-partner", authHandler, addPartner);
partnerRouter.get("/get-partners", getAllPartners);
partnerRouter.delete("/delete-partner/:partnerId", authHandler, deletePartner);
partnerRouter.put("/update-partner/:partnerId", authHandler, updatePartner);

module.exports = partnerRouter;

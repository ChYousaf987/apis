const express = require("express");
const authHandler = require("../middlewares/authMiddleware");
const {
  addCustomer,
  getAllCustomers,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter.post("/add-customer", authHandler, addCustomer);
customerRouter.get("/get-customers", getAllCustomers);
customerRouter.delete(
  "/delete-customer/:customerId",
  authHandler,
  deleteCustomer
);
customerRouter.put("/update-customer/:customerId", authHandler, updateCustomer);

module.exports = customerRouter;

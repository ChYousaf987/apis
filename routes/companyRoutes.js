const express = require("express");
const authHandler = require("../middlewares/authMiddleware");
const {
  addCompany,
  getAllCompany,
  deleteAllCompany,
  deleteCompany,
  updateCompany,
  addEmployee,
  getEmployeesByCompany,
  deleteEmployee,
  updateEmployee,
  bulkUpdateCompanys,
} = require("../controllers/companyController");

const companyRouter = express.Router();

companyRouter.post("/add-company", authHandler, addCompany);
companyRouter.get("/get-companys", getAllCompany);
companyRouter.delete("/delete-companys", deleteAllCompany);
companyRouter.delete("/delete-company/:companyId", deleteCompany);
companyRouter.put("/update-company/:companyId", authHandler, updateCompany);
companyRouter.post("/add-employee/:companyId", authHandler, addEmployee);
companyRouter.get("/get-employees/:companyId", getEmployeesByCompany);
companyRouter.delete(
  "/delete-employee/:employeeId",
  authHandler,
  deleteEmployee
);
companyRouter.put("/update-employee/:employeeId", authHandler, updateEmployee);
companyRouter.put("/bulk-update-companys", authHandler, bulkUpdateCompanys);

module.exports = companyRouter;

const asyncHandler = require("express-async-handler");
const companyModel = require("../models/companyModel");
const employeeModel = require("../models/employeeModel");

const addCompany = asyncHandler(async (req, res) => {
  const {
    company_name,
    company_email,
    company_number,
    company_department,
    company_job_title,
    company_industry_type,
    company_country,
    company_state,
    company_city,
    company_zip_code,
  } = req.body;

  console.log("Received company data:", req.body);
  console.log("User ID from token:", req.user?._id);

  if (
    !company_name ||
    !company_email ||
    !company_number ||
    !company_department ||
    !company_job_title ||
    !company_industry_type ||
    !company_country ||
    !company_state ||
    !company_city ||
    !company_zip_code
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const findCompany = await companyModel.findOne({
    $or: [{ company_email }, { company_number }],
  });
  if (findCompany) {
    res.status(405);
    throw new Error("Email or number already exists");
  }

  try {
    const createdCompany = await companyModel.create({
      user: req.user._id,
      company_name,
      company_email,
      company_number,
      company_department,
      company_job_title,
      company_industry_type,
      company_country,
      company_state,
      company_city,
      company_zip_code,
      employees: [],
    });
    console.log("Company created:", createdCompany);
    res.status(201).json(createdCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500);
    throw new Error("Failed to create company");
  }
});

const getAllCompany = asyncHandler(async (req, res) => {
  const allCompanies = await companyModel.find().populate("employees");
  res.json(allCompanies);
});

const deleteAllCompany = asyncHandler(async (req, res) => {
  await employeeModel.deleteMany({});
  await companyModel.deleteMany({});
  res.json("All companies and employees deleted");
});

const deleteCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const company = await companyModel.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  await employeeModel.deleteMany({ company: companyId });
  await companyModel.findByIdAndDelete(companyId);
  res.json("Company and associated employees deleted");
});

const updateCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const {
    company_name,
    company_email,
    company_number,
    company_department,
    company_job_title,
    company_industry_type,
    company_country,
    company_state,
    company_city,
    company_zip_code,
  } = req.body;

  console.log(
    "Received update company data:",
    req.body,
    "for company:",
    companyId
  );

  if (
    !company_name ||
    !company_email ||
    !company_number ||
    !company_department ||
    !company_job_title ||
    !company_industry_type ||
    !company_country ||
    !company_state ||
    !company_city ||
    !company_zip_code
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const company = await companyModel.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const existingCompany = await companyModel.findOne({
    $or: [{ company_email }, { company_number }],
    _id: { $ne: companyId },
  });
  if (existingCompany) {
    res.status(405);
    throw new Error("Email or number already exists");
  }

  try {
    const updatedCompany = await companyModel.findByIdAndUpdate(
      companyId,
      {
        company_name,
        company_email,
        company_number,
        company_department,
        company_job_title,
        company_industry_type,
        company_country,
        company_state,
        company_city,
        company_zip_code,
      },
      { new: true }
    );
    console.log("Company updated:", updatedCompany);
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500);
    throw new Error("Failed to update company");
  }
});

const addEmployee = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const { name, email, phone, department, job_title, country, status } =
    req.body;

  console.log("Received employee data:", req.body, "for company:", companyId);

  if (
    !name ||
    !email ||
    !phone ||
    !department ||
    !job_title ||
    !country ||
    !status
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const company = await companyModel.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (!company.user) {
    console.warn(
      `Company ${companyId} missing user field, setting to authenticated user: ${req.user._id}`
    );
    company.user = req.user._id;
  }

  const findEmployee = await employeeModel.findOne({ email });
  if (findEmployee) {
    res.status(405);
    throw new Error("Employee email already exists");
  }

  try {
    const createdEmployee = await employeeModel.create({
      company: companyId,
      name,
      email,
      phone,
      department,
      job_title,
      country,
      status,
    });

    company.employees.push(createdEmployee._id);
    await company.save();

    console.log("Employee created:", createdEmployee);
    res.status(201).json(createdEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500);
    throw new Error("Failed to create employee");
  }
});

const getEmployeesByCompany = asyncHandler(async (req, res) => {
  const companyId = req.params.companyId;
  const employees = await employeeModel
    .find({ company: companyId })
    .populate("company");
  res.json(employees);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employeeId = req.params.employeeId;
  const employee = await employeeModel.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const company = await companyModel.findById(employee.company);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  company.employees = company.employees.filter(
    (id) => id.toString() !== employeeId
  );
  await company.save();

  await employeeModel.findByIdAndDelete(employeeId);
  console.log("Employee deleted:", employeeId);
  res.json("Employee deleted");
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employeeId = req.params.employeeId;
  const { name, email, phone, department, job_title, country, status } =
    req.body;

  console.log(
    "Received update employee data:",
    req.body,
    "for employee:",
    employeeId
  );

  if (
    !name ||
    !email ||
    !phone ||
    !department ||
    !job_title ||
    !country ||
    !status
  ) {
    res.status(400);
    throw new Error("Please Enter All The Fields");
  }

  const employee = await employeeModel.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const company = await companyModel.findById(employee.company);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  const existingEmployee = await employeeModel.findOne({
    email,
    _id: { $ne: employeeId },
  });
  if (existingEmployee) {
    res.status(405);
    throw new Error("Employee email already exists");
  }

  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      employeeId,
      {
        name,
        email,
        phone,
        department,
        job_title,
        country,
        status,
      },
      { new: true }
    );

    console.log("Employee updated:", updatedEmployee);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500);
    throw new Error("Failed to update employee");
  }
});

const bulkUpdateCompanys = asyncHandler(async (req, res) => {
  const companys = req.body;
  const updatedCompanys = [];
  const errors = [];

  if (!Array.isArray(companys) || companys.length === 0) {
    res.status(400);
    throw new Error("No company data provided for bulk update");
  }

  for (const company of companys) {
    const {
      _id,
      company_name,
      company_email,
      company_number,
      company_department,
      company_job_title,
      company_industry_type,
      company_country,
      company_state,
      company_city,
      company_zip_code,
    } = company;

    if (
      !company_name ||
      !company_email ||
      !company_number ||
      !company_department ||
      !company_job_title ||
      !company_industry_type ||
      !company_country ||
      !company_state ||
      !company_city ||
      !company_zip_code
    ) {
      errors.push({
        company: company_name || "Unknown",
        error: "Missing required fields",
      });
      continue;
    }

    try {
      if (_id) {
        const existingCompany = await companyModel.findById(_id);
        if (!existingCompany) {
          errors.push({
            company: company_name,
            error: `Company with ID ${_id} not found`,
          });
          continue;
        }

        const duplicate = await companyModel.findOne({
          $or: [{ company_email }, { company_number }],
          _id: { $ne: _id },
        });
        if (duplicate) {
          errors.push({
            company: company_name,
            error: `Duplicate email or number found: ${company_email} or ${company_number}`,
          });
          continue;
        }

        const updatedCompany = await companyModel.findByIdAndUpdate(
          _id,
          {
            company_name,
            company_email,
            company_number,
            company_department,
            company_job_title,
            company_industry_type,
            company_country,
            company_state,
            company_city,
            company_zip_code,
          },
          { new: true }
        );
        if (updatedCompany) {
          updatedCompanys.push(updatedCompany);
        }
      } else {
        const duplicate = await companyModel.findOne({
          $or: [{ company_email }, { company_number }],
        });
        if (duplicate) {
          errors.push({
            company: company_name,
            error: `Duplicate email or number found: ${company_email} or ${company_number}`,
          });
          continue;
        }

        const newCompany = await companyModel.create({
          user: req.user._id,
          company_name,
          company_email,
          company_number,
          company_department,
          company_job_title,
          company_industry_type,
          company_country,
          company_state,
          company_city,
          company_zip_code,
          employees: [],
        });
        updatedCompanys.push(newCompany);
      }
    } catch (error) {
      errors.push({
        company: company_name || "Unknown",
        error: error.message || "Failed to process company",
      });
    }
  }

  if (updatedCompanys.length === 0 && errors.length > 0) {
    res.status(400).json({
      message: "No companies were successfully updated or created",
      errors,
    });
    return;
  }

  res.status(200).json({
    message: `${updatedCompanys.length} companies processed successfully`,
    updatedCompanys,
    errors,
  });
});

module.exports = {
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
};

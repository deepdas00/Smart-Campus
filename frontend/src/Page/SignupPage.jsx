import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Building2,
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import logo from "../assets/logo.png";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [idCardFile, setIdCardFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [colleges, setColleges] = useState([]);
  const [collegePolicy, setCollegePolicy] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const [collegeCode, setCollegeCode] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoadingColleges(true);
        const response = await axios.get(
          `${API_URL}/api/v1/college/data`,
          { withCredentials: true } // only if needed
        );


        console.log(response.data.data);
        
        // Use the correct path to your array
        setDepartments([""])
        setColleges(response.data.data);
        fetchDepartments();
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoadingColleges(false);
      }
    };

    fetchColleges();
  }, []);


    const fetchDepartments = async () => {
      try {
        const resPolicy = await axios.get(`${API_URL}/api/v1/college/departments/${collegeCode}`, {
          withCredentials: true,
        });

    
        setDepartments(resPolicy.data.departments);
      } catch (error) {
        setDepartments([])
        console.error("Failed to fetch departments", error);
      }
    };



  useEffect(() => {
    if (!collegeCode) return;


    

  
    fetchDepartments();
  }, [collegeCode]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    studentId: "",
    department: "",
    institutionName: "",
    admissionYear: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // 🔒 Only numbers for phone
    if (name === "phone") {
      updatedValue = value.replace(/\D/g, ""); // remove non-digits
    }

    // 🔒 Only letters & spaces for name
    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    const error = validateField(name, updatedValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions");
      return;
    }

    if (!userType) {
      toast.error("Please select account type");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const form = new FormData();
   
      

      if (userType === "student") {
        form.append("collegeCode", formData.institutionName);
        form.append("studentName", formData.name);
        form.append("rollNo", formData.studentId);
        form.append("mobileNo", formData.phone);
        form.append("email", formData.email);
        form.append("department", formData.department);
        form.append("password", formData.password);
        form.append("admissionYear", formData.admissionYear.split("-")[0]);

        if (!idCardFile) {
          toast.error("Please upload your Student ID Card!");
          return;
        }
        form.append("avatar", idCardFile); // backend expects a file field
      }

      // Use axios with multipart/form-data
      const response = await axios.post(
        `${API_URL}/api/v1/users/student/register`,
        form, {
    withCredentials: true
  }
);

      toast.success(response.data.message || "Account created successfully!");
      navigate("/home", { replace: true });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        studentId: "",
        institutionName: "",
        department: "",
      });
      setIdCardFile(null);
      setUserType(null);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error);
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false); // Stop animation
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (!/^[A-Za-z\s]{2,50}$/.test(value))
          return "Name should contain only letters (2–50 chars)";
        return "";

      case "studentId":
        if (!value.trim()) return "Student ID is required";
        if (!/^[A-Za-z0-9_-]{3,20}$/.test(value))
          return "Invalid Student ID format";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        return "";

      case "phone":
        if (!value) return "Phone number is required";
        if (!/^[0-9]{10}$/.test(value))
          return "Mobile number must be exactly 10 digits";
        return "";

      case "admissionYear":
        if (!value) return "Admission date is required";
        if (new Date(value) > new Date())
          return "Admission date cannot be in the future";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value))
          return "Password must be 8+ chars with letters & numbers";
        return "";

      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const UserTypeCard = ({ type, icon, title, description, benefits }) => (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setUserType(type)}
      className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-colors duration-300 ${
        userType === type
          ? "border-blue-600 bg-blue-50/50 shadow-2xl shadow-blue-100"
          : "border-gray-200 bg-white hover:border-blue-300 shadow-sm"
      }`}
    >
      {userType === type && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
          userType === type
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, idx) => (
          <li
            key={idx}
            className="flex items-start space-x-2 text-sm text-gray-700"
          >
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );







  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:inline">
                Already have an account?
              </span>
              <Link
                to={"/login"}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-25 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                !userType ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  !userType
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                1
              </div>
              <span className="font-medium hidden sm:inline">Choose Type</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center space-x-2 ${
                userType ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userType ? "bg-blue-600 text-white" : "bg-gray-300 text-white"
                }`}
              >
                2
              </div>
              <span className="font-medium hidden sm:inline">Sign Up</span>
            </div>
          </div>
        </div>

        {!userType ? (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Join Smart Campus
              </h1>
              <p className="text-xl text-gray-600">
                Choose your account type to get started
              </p>
            </div>

            <div className="flex w-full justify-center items-center">
              

              <UserTypeCard
                type="institution"
                icon={<Building2 className="w-8 h-8" />}
                title="Institution Account"
                description="Manage and resolve campus issues"
                benefits={[
                  "Centralized admin dashboard",
                  "AI-powered issue classification",
                  "Assign tasks to maintenance teams",
                  "Analytics and reporting tools",
                  "Multi-campus management",
                ]}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setUserType(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to selection</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white">
                  {userType === "student" ? (
                    <GraduationCap className="w-6 h-6" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userType === "student"
                      ? "Student Registration"
                      : "Institution Registration"}
                  </h2>
                  <p className="text-gray-600">
                    {userType === "student"
                      ? "Create your student account"
                      : "Register your institution"}
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {userType === "student" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="institutionName"
                          value={collegeCode}
                          onChange={(e) => {
                            const selectedCode = e.target.value;

                            setCollegeCode(selectedCode); // for department API
                            setFormData((prev) => ({
                              ...prev,
                              institutionName: selectedCode,
                              department: "", // 🔥 reset department on college change
                            }));
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white
             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="">
                            {loadingColleges
                              ? "Loading institutions..."
                              : "Select Institution"}
                          </option>

                          {colleges.map((college) => (
                            <option
                              key={college.collegeCode}
                              value={college.collegeCode}
                              >
                              ({college.collegeCode}) {college.collegeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="STU12345"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="">
                            {loadingColleges
                              ? "Loading institutions..."
                              : "Select Institution"}
                          </option>

                          {departments.map((collegeDep) => (
                            <option
                              key={collegeDep}
                              value={collegeDep}
                            >
                              {collegeDep}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admission Date
                      </label>

                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <input
                          type="date"
                          name="admissionYear"
                          value={formData.admissionYear}
                          onChange={handleInputChange}
                          max={new Date().toISOString().split("T")[0]}
                          className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition
                             ${
                               errors.admissionYear
                                 ? "border border-red-500 focus:ring-red-400"
                                 : "border border-gray-300 focus:ring-2                     focus:ring-blue-500"
                             }`}
                        />
                      </div>

                      {errors.admissionYear && (
                        <p className="mt-1 text-xs text-red-500 font-medium">
                          {errors.admissionYear}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="john@university.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Student ID Card
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdCardFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          maxLength={10}
                          inputMode="numeric"
                          className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition
                             ${
                               errors.phone
                                 ? "border border-red-500 focus:ring-red-400"
                                 : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
                             }`}
                          placeholder="10-digit mobile number"
                        />

                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500 font-medium">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="institutionName"
                          value={formData.institutionName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="ABC University"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution Type
                      </label>
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select Type</option>
                        <option value="university">University</option>
                        <option value="college">College</option>
                        <option value="school">School</option>
                        <option value="institute">Technical Institute</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="REG/2023/12345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Enter full address"
                          rows="2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Dr. Jane Smith"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Official Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="admin@university.edu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="+91 1234567890"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters with numbers and letters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <AnimatePresence>
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/20 backdrop-blur-md"
                    >
                      {/* Dynamic Loader Card */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4 border border-slate-100"
                      >
                        <div className="relative">
                          {/* Outer Spinning Ring */}
                          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                          {/* Inner Logo/Icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                          </div>
                        </div>

                        <div className="text-center">
                          <h3 className="text-xl font-bold text-slate-900">
                            Creating Account
                          </h3>
                          <p className="text-sm text-slate-500">
                            Securely setting up your campus profile...
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!acceptedTerms || isSubmitting}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all ${
                    acceptedTerms
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span>Create Account</span>
                  )}
                </motion.button>
              </form>

              <div className="fixed w-full h-full bg-gray-700/30"></div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

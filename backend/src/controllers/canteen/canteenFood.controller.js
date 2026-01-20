import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenFoodModel } from "../../models/canteenFood.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCanteenPolicyModel } from "../../models/canteenPolicy.model.js";
import { broadcastViaSocket } from "../../utils/websocketBroadcast.js";


export const addFood = asyncHandler(async (req, res) => {

  // 🔐 from JWT
  const { collegeCode, userId } = req.user;

  // 📦 from body
  const {
    name,
    price,
    quantityAvailable,
    category,
    foodType,        // veg / non-veg
    description
  } = req.body;

  // 1️⃣ Basic validation
  if (!name || !price || !quantityAvailable || !category || !foodType) {
    throw new ApiError(400, "All required food fields must be provided");
  }

  // 2️⃣ Image validation
  const imagePath = req.file?.path?.replace(/\\/g, "/");
  if (!imagePath) {
    throw new ApiError(400, "Food image is required");
  }

  // 3️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const CanteenFood = getCanteenFoodModel(collegeConn);

  // 4️⃣ Upload image to Cloudinary
  const uploadResult = await uploadOnCloudinary(imagePath);

  if (!uploadResult?.url) {
    throw new ApiError(500, "Image upload failed");
  }

  // 5️⃣ Create food item
  const food = await CanteenFood.create({
    name,
    description,
    image: uploadResult.url,
    price,
    quantityAvailable,
    category,
    foodType,
    isAvailable: true,
    createdBy: userId
  });

    broadcastViaSocket(collegeCode, ["student", "canteen", "admin"], {
    event: "foodUpdated",
    food
  });
  

  // 6️⃣ Response
  res.status(201).json(
    new ApiResponse(
      201,
      food,
      "Food item added successfully"
    )
  );
});


export const getAllFoods = asyncHandler(async (req, res) => {

  
  const { collegeCode } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

   

  const collegeConn = getCollegeDB(college.dbName);

  const CanteenPolicyModel = getCanteenPolicyModel(collegeConn);

  
  const canteenPolicy = await CanteenPolicyModel.findOne();

  const canteenSatus = canteenPolicy.isActive;

 
  
  const CanteenFood = getCanteenFoodModel(collegeConn);
  // res.status(200).json(
  //   new ApiResponse(
  //     200,
  //     foods,
  //     "Canteen food list fetched successfully"
  //   )
  // 2️⃣ Fetch food items
  const foods = await CanteenFood.find()
    .sort({ createdAt: -1 })
    .select("-__v");


    

  // 3️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      {foods,canteenSatus},
      "Canteen food list fetched successfully"
    )
  );
});


export const updateFood = asyncHandler(async (req, res) => {

  const { foodId } = req.params;
  const { collegeCode } = req.user;

  const { quantityAvailable, isAvailable, price } = req.body;

  // 1️⃣ Validate input
  if (quantityAvailable === undefined && isAvailable === undefined && price === undefined) {
    throw new ApiError(
      400,
      "At least one field (quantityAvailable or isAvailable or price) is required"
    );
  }

  // 2️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const CanteenFood = getCanteenFoodModel(collegeConn);

  // 3️⃣ Find food item
  const canteenFood = await CanteenFood.findById(foodId);

  if (!canteenFood) {
    throw new ApiError(404, "Food item not found");
  }

  //   // 2️⃣ Image validation
    if (req.file?.path){
      const imagePath = req.file?.path?.replace(/\\/g, "/");
      const uploadResult = await uploadOnCloudinary(imagePath);
      canteenFood.image  = uploadResult.url
    }


  // 4️⃣ Update fields safely
  if (quantityAvailable !== undefined) {
    if (quantityAvailable < 0) {
      throw new ApiError(400, "Quantity cannot be negative");
    }
    canteenFood.quantityAvailable = quantityAvailable;

    // Auto-disable if quantity = 0
    if (quantityAvailable === 0) {
      canteenFood.isAvailable = false;
    }
  }

  if (isAvailable !== undefined) {
    canteenFood.isAvailable = isAvailable;
  }
  if (price !== undefined) {
    canteenFood.price = price;
  }

  const food = await canteenFood.save();


  broadcastViaSocket(collegeCode, ["student", "canteen", "admin"], {
    event: "foodUpdated",
    food
  });
  

  // 5️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      food,
      "Food item updated successfully"
    )
  );
});

export const deleteFood = asyncHandler(async (req, res) => {

  const { foodId } = req.params;
  const { collegeCode } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const CanteenFood = getCanteenFoodModel(collegeConn);

  // 2️⃣ Find food item
  const food = await CanteenFood.findById(foodId);

  if (!food) {
    throw new ApiError(404, "Food item not found");
  }

  // 🗑️ 3️⃣ Permanently delete food
  await food.deleteOne();



  broadcastViaSocket(collegeCode, ["student", "canteen", "admin"], {
    event: "foodDeleted",
    _id:foodId
  });


  // 4️⃣ Response
  return res.status(200).json(
    new ApiResponse(200, {}, "Food item permanently deleted")
  );
});

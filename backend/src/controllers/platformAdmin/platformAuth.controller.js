import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectMasterDB } from "../../db/db.index.js";
import { getPlatformAdminModel } from "../../models/platformAdmin.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessAndRefreshTokens } from "../../utils/tokenGenerator.js";

export const platformAdminLogin = asyncHandler(async (req, res) => {

    const { loginId, password } = req.body;

    if (!loginId || !password) {
        return res.status(400).json({ message: `Both fields are required!!` })
        // throw new ApiError(400, "Login ID and password are required");
    }

    const masterConn = connectMasterDB();
    const PlatformAdmin = getPlatformAdminModel(masterConn);

    const admin = await PlatformAdmin.findOne({ loginId });

    if (!admin) {
        return res.status(401).json({ message: `Invalid login Id!!` })
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
        return res.status(401).json({ message: `Invalid Password!!` })
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
        userId: admin._id,
        role: "platformAdmin",
        collegeCode: null
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    };

    res
        .status(200)
        .cookie("platformAccessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: {
                        id: admin._id,
                        loginId: admin.loginId,
                        name: admin.name
                    },
                },
                "Platform admin logged in successfully"
            )
        );
});

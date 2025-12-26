import mongoose from "mongoose";

const libraryPolicySchema = new mongoose.Schema({
    maxBooksAllowed:
    {
        type: Number,
        default: 3
    },
    returnPeriodDays:
    {
        type: Number,
        default: 7
    },
    finePerDay:
    {
        type: Number,
        default: 5
    },
    maxFine:
    {
        type: Number,
        default: 50,
    },
    updatedBy: {type: mongoose.Schema.Types.ObjectId, ref: "CollegeUser", required: true},
},
{
    timestamps: true
});

    
export const getLibraryPolicyModel = (conn) => {
    return conn.models.LibraryPolicy ||
        conn.model("LibraryPolicy", libraryPolicySchema);
};
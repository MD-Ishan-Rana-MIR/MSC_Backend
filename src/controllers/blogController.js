const { default: mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const { successResponse, errorResponse } = require("../utility/response");

const createBlog = async (req, res) => {
    const userId = req.headers.id;
    console.log(userId)
    const reqBody = req.body;
    reqBody.userId = userId
    try {

        const blogData = await blogModel.create(reqBody);
        successResponse(res, 201, "Blog create successfully", blogData);

    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error)
    }
};

const allBlog = async (req, res) => {
    try {
        const blogs = await blogModel.aggregate([
            {
                $lookup: {
                    from: "users", // collection name of User model
                    localField: "userId", // field inside Blog
                    foreignField: "_id",   // field inside User
                    as: "user",
                },
            },
            {
                $unwind: "$user", // convert array → object
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    isPublish : 1,
                    "user._id": 1,
                    "user.full_name": 1,
                    "user.email": 1,
                    "user.avatar": 1, // if you have profile image
                },
            },
            {
                $sort: { createdAt: -1 }, // newest first
            },
        ]);

        res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const blogByUser = async (req, res) => {
    const userId = req.headers.id;

    try {
        const blogData = await blogModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId), // match by userId
                },
            },
            {
                $lookup: {
                    from: "users", // collection name of user model
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user", // flatten array
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.full_name": 1,
                    "user.email": 1,
                    "user.avatar": 1, // if available in user schema
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        if (!blogData || blogData.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Blog not found",
            });
        }

        successResponse(res, 200, "Blog retrieved successfully", blogData);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }
};

const blogDetails = async (req, res) => {
    const blogId = req.params.id;

    try {
        const blogData = await blogModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(blogId), // match by userId
                },
            },
            {
                $lookup: {
                    from: "users", // collection name of user model
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user", // flatten array
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.full_name": 1,
                    "user.email": 1,
                    "user.avatar": 1, // if available in user schema
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        if (!blogData || blogData.length === 0) {
            return res.status(404).json({
                status: "fail",
                msg: "Blog not found",
            });
        }

        successResponse(res, 200, "Blog retrieved successfully", blogData);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong", error);
    }
};

const blogUpdate = async (req, res) => {
  try {
    const blogId = req.params.id;
    const reqBody = req.body;

    // 🔍 Find blog
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ Update only provided fields
    if (reqBody.title) blog.title = reqBody.title;
    if (reqBody.description) blog.description = reqBody.description;

    // ✅ Handle image update (if new image URL provided)
    if (reqBody.image) blog.image = reqBody.image;

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const blogDelete = async (req, res) => {
    const userId = req.headers.id;
    const blogId = req.params.id;
    const filter = {
        userId: userId,
        _id: blogId
    }
    try {

        const blogDelete = await blogModel.deleteOne(filter);



        if (blogDelete?.deletedCount === 0) {

            return res.status(404).json({
                status: "fail",
                msg: "Blog not found"
            })

        }


        successResponse(res, 200, "Blog delete successfully", blogDelete)





    } catch (error) {
        console.log(error)
        errorResponse(res, 500, "Something went worng", error);

    }
}









module.exports = {
    createBlog,
    allBlog,
    blogByUser,
    blogDetails,
    blogUpdate,
    blogDelete
}
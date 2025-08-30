const express = require("express");
const { userRegistration, userLogin, userProfile, userProfileUpdate, sendOtp, userOtpVerify, passwordReset, } = require("../controllers/authController");
const { isLogin, isAdmin } = require("../middleware/middleware");
const { createCategory, singleCategory, categoryUpdate, categoryDelete, allCategory } = require("../controllers/categoryController");
const upload = require("../middleware/imageMiddlewar");
const { createBrand, allBrand, singleBrand, brandUpdate, brandDelete } = require("../controllers/brandController");
const router = express.Router();

// auth api 

router.post(`/user-registration`, userRegistration);
router.post("/login", userLogin);
router.get("/user-profile", isLogin, userProfile);
router.put("/user-profile-update", isLogin, userProfileUpdate);

// forget password api 

router.post("/send-otp", sendOtp );
router.post("/otp-verify" , userOtpVerify);
router.post("/reset-password", passwordReset );

// category related api 

router.post(`/create-category`,upload.single("image") ,isLogin,isAdmin ,createCategory);
router.get("/all-category", allCategory );
router.get("/single-category/:category_id", singleCategory );
router.put("/category-update/:id" , upload.single("image") ,isLogin,isAdmin, categoryUpdate);
router.delete("/category-deleete/:id", isLogin ,isAdmin, categoryDelete );


// brand related api 


router.post("/brand-create", upload.single("image"), isLogin,isAdmin, createBrand);
router.get("/all-brand", allBrand );
router.get("/single-brand/:brand_id", singleBrand );
router.put("/brand-update/:id", upload.single("image"), isLogin,isAdmin,brandUpdate);
router.delete("/brand-delete/:id" ,isLogin, isAdmin,brandDelete );





module.exports = router;
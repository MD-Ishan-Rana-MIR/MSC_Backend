const express = require("express");
const { userRegistration, userLogin, userProfile, userProfileUpdate, sendOtp, userOtpVerify, passwordReset, } = require("../controllers/authController");
const { isLogin, isAdmin } = require("../middleware/middleware");
const { createCategory, singleCategory, categoryUpdate, categoryDelete, allCategory } = require("../controllers/categoryController");
const upload = require("../middleware/imageMiddlewar");
const { createBrand, allBrand, singleBrand, brandUpdate, brandDelete } = require("../controllers/brandController");
const { createProduct, updateProduct, singleProduct } = require("../controllers/productController");
const { addWish, wishListDetails, wishList, deleteWish } = require("../controllers/wishController");
const { addToCart, cartList } = require("../controllers/cartController");
const router = express.Router();

// auth api 

router.post(`/user-registration`, userRegistration);
router.post("/login", userLogin);
router.get("/user-profile", isLogin, userProfile);
router.put("/user-profile-update", isLogin, userProfileUpdate);

// forget password api 

router.post("/send-otp", sendOtp);
router.post("/otp-verify", userOtpVerify);
router.post("/reset-password", passwordReset);

// category related api 

router.post(`/create-category`, upload.single("image"), isLogin, isAdmin, createCategory);
router.get("/all-category", allCategory);
router.get("/single-category/:category_id", singleCategory);
router.put("/category-update/:id", upload.single("image"), isLogin, isAdmin, categoryUpdate);
router.delete("/category-deleete/:id", isLogin, isAdmin, categoryDelete);


// brand related api 


router.post("/brand-create", upload.single("image"), isLogin, isAdmin, createBrand);
router.get("/all-brand", allBrand);
router.get("/single-brand/:brand_id", singleBrand);
router.put("/brand-update/:id", upload.single("image"), isLogin, isAdmin, brandUpdate);
router.delete("/brand-delete/:id", isLogin, isAdmin, brandDelete);


// product controller 

router.post("/product-upload", upload.fields([
    { name: "product_image[0]", maxCount: 1 },
    { name: "product_image[1]", maxCount: 1 },
    { name: "product_image[2]", maxCount: 1 },
    { name: "product_image[3]", maxCount: 1 }
]), isLogin, isAdmin, createProduct);

router.get("/single-product/:id", singleProduct);


router.put("/update/:id", upload.fields([
    { name: "product_image[0]", maxCount: 1 },
    { name: "product_image[1]", maxCount: 1 },
    { name: "product_image[2]", maxCount: 1 },
    { name: "product_image[3]", maxCount: 1 }
]),
    isLogin, isAdmin, updateProduct
);





// wish related api 

router.post("/add-to-wish", isLogin, addWish);
router.get("/wish-list", isLogin, wishList);
router.get("/wish-details/:id", isLogin, wishListDetails);
router.delete("/wish-delete/:id", isLogin, deleteWish);



// cart related api 


router.post("/add-to-cart", isLogin, addToCart);
router.get("/cart-list", isLogin , cartList )






module.exports = router;
const express = require("express");
const { userRegistration, userLogin, userProfile, userProfileUpdate, sendOtp, userOtpVerify, passwordReset, } = require("../controllers/authController");
const { isLogin, isAdmin } = require("../middleware/middleware");
const { createCategory, singleCategory, categoryUpdate, categoryDelete, allCategory } = require("../controllers/categoryController");
const upload = require("../middleware/imageMiddlewar");
const { createBrand, allBrand, singleBrand, brandUpdate, brandDelete } = require("../controllers/brandController");
const { createProduct, updateProduct, singleProduct, productSearch, productByBrand, productByCategory, allProduct } = require("../controllers/productController");
const { addWish, wishListDetails, wishList, deleteWish } = require("../controllers/wishController");
const { addToCart, cartList, cartDetails, cartDelete } = require("../controllers/cartController");
const { createBlog, allBlog, blogByUser, blogDetails, blogUpdate, blogDelete } = require("../controllers/blogController");
const { createInvoice } = require("../controllers/invoiceController");
const { productSliderCreate, allSlider, singleSlider, sliderUpdate, sliderDelete } = require("../controllers/productSliderController");
const { userSubcribe, userSendEmail, allSubcriber } = require("../controllers/subcribeController");
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

router.post(`/create-category`, isLogin, isAdmin, createCategory);
router.get("/all-category", allCategory);
router.get("/single-category/:category_id", singleCategory);
router.put("/category-update/:id", isLogin, isAdmin, categoryUpdate);
router.delete("/category-deleete/:id", isLogin, isAdmin, categoryDelete);

// brand related api 

router.post("/brand-create", isLogin, isAdmin, createBrand);
router.get("/all-brand", allBrand);
router.get("/single-brand/:brand_id", singleBrand);
router.put("/brand-update/:id", isLogin, isAdmin, brandUpdate);
router.delete("/brand-delete/:id", isLogin, isAdmin, brandDelete);

// product controller 

router.post("/product-upload", isLogin, isAdmin, createProduct);
router.get("/single-product/:id", singleProduct);
router.put("/update/:id", isLogin, isAdmin, updateProduct);
router.get(`/product-search/:searchValue`, productSearch);
router.get("/product-by-brand/:id",productByBrand);
router.get("/product-by-category/:id", productByCategory );
router.get("/all-product", allProduct );

// wish related api 

router.post("/add-to-wish", isLogin, addWish);
router.get("/wish-list", isLogin, wishList);
router.get("/wish-details/:id", isLogin, wishListDetails);
router.delete("/wish-delete/:id", isLogin, deleteWish);

// cart related api 

router.post("/add-to-cart", isLogin, addToCart);
router.get("/cart-list", isLogin, cartList);
router.get("/cart-details/:id", isLogin, cartDetails);
router.delete("/cart-delete/:id", isLogin, cartDelete);

// blog related api 

router.post("/blog-create",isLogin, isAdmin ,createBlog);
router.get("/all-blog", allBlog);
router.get("/blog-by-user", isLogin,isAdmin, blogByUser);
router.get("/blog-details/:id", blogDetails);
router.put("/blog-update/:id", isLogin,isAdmin, blogUpdate);
router.delete(`/blog-delete/:id`, isLogin,isAdmin, blogDelete);


// invoice api 

router.post("/create-invoice", isLogin,createInvoice);




// product slider api 

router.post("/product-slider-upload", isLogin,isAdmin, productSliderCreate);
router.get("/all-slider", allSlider);
router.get("/single-slider/:id", singleSlider);
router.put("/slider-update/:id", isLogin,isAdmin,sliderUpdate );
router.delete("/slider-delete/:id", isLogin,isAdmin, sliderDelete);



// subcribe api 

router.post("/subcribe", userSubcribe );
router.post("/user-send-email", isLogin,isAdmin, userSendEmail );
router.get("/all-subcriber",isLogin,isAdmin,allSubcriber);








module.exports = router;
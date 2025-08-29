const express = require("express");
const { userRegistration, userLogin, userProfile, userProfileUpdate } = require("../controllers/authController");
const { isLogin } = require("../middleware/middleware");
const router = express.Router();

// auth api 

router.post(`/user-registration`, userRegistration);
router.post("/login", userLogin);
router.get("/user-profile", isLogin, userProfile);
router.put("/user-profile-update", isLogin, userProfileUpdate);



module.exports = router;
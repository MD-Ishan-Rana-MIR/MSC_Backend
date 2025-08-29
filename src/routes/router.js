const express = require("express");
const { userRegistration, userLogin, userProfile } = require("../controllers/authController");
const { isLogin } = require("../middleware/middleware");
const router = express.Router();

// auth api 

router.post(`/user-registration`, userRegistration );
router.post("/login",userLogin);
router.get("/user-profile", isLogin, userProfile  )



module.exports = router;
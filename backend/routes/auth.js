const { Router } = require("express");
const { createAccount } = require("../controllers/auth/register");
const { googleLogin, googleCredentials } = require("../controllers/auth/google");
const { isEmailExists, isUsernameExists, isGoogleAuthenticated } = require("../controllers/auth/verifyCredentials");
const { sendMail } = require("../controllers/auth/mail");
const { resetPassword } = require("../controllers/auth/forgotPassword");

const router = Router();

router.post("/register", createAccount);
router.get("/google-credentials", googleCredentials);
router.post("/google-login", googleLogin);
router.get("/verify-email", isEmailExists);
router.get("/verify-username", isUsernameExists);
router.get("/is-authenticated", isGoogleAuthenticated);
router.post("/send-mail", sendMail);
router.post("/forget-password", resetPassword);


module.exports = router;

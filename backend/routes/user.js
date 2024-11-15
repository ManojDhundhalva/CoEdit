const { Router } = require("express");
const controller = require("../controllers/user");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyUser");

const router = Router();

router.get("/", verifyTokenAndAuthorization, controller.getUser);
router.post("/", verifyTokenAndAuthorization, controller.updateUser);

module.exports = router;

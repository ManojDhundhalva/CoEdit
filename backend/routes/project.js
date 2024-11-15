const { Router } = require("express");
const controller = require("../controllers/project");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyUser");

const router = Router();

router.post("/add-project", verifyTokenAndAuthorization, controller.addProject);
router.get("/get-all-files", verifyTokenAndAuthorization, controller.getAllFiles);
router.get("/get-all-active-files", verifyTokenAndAuthorization, controller.getAllActiveFiles);
router.get("/get-file-tree", verifyTokenAndAuthorization, controller.getFileTree);
router.get("/get-initial-tabs", verifyTokenAndAuthorization, controller.getInitialTabs);
router.post("/set-expand-data", verifyTokenAndAuthorization, controller.setExpandData);

module.exports = router;
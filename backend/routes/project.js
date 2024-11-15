const { Router } = require("express");
const controller = require("../controllers/project");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyUser");

const router = Router();

router.get("/get-all-projects",verifyTokenAndAuthorization,controller.getAllProjects);
router.post("/add-project", verifyTokenAndAuthorization, controller.addProject);
router.get("/get-all-files", verifyTokenAndAuthorization, controller.getAllFiles);
router.get("/get-project-name", verifyTokenAndAuthorization, controller.getProjectName);
router.get("/get-all-active-files", verifyTokenAndAuthorization, controller.getAllActiveFiles);
router.get("/get-file-tree", verifyTokenAndAuthorization, controller.getFileTree);
router.get("/get-initial-tabs", verifyTokenAndAuthorization, controller.getInitialTabs);
router.get("/get-live-users", verifyTokenAndAuthorization, controller.getLiveUsers);
router.post("/set-expand-data", verifyTokenAndAuthorization, controller.setExpandData);
router.get("/code-editor/logs", verifyTokenAndAuthorization, controller.getLogs);

module.exports = router;
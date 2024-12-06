const { Router } = require("express");
const controller = require("../controllers/project");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyUser");

const router = Router();

router.get("/get-all-projects", verifyTokenAndAuthorization, controller.getAllProjects);
router.post("/add-project", verifyTokenAndAuthorization, controller.addProject);
router.get("/get-all-files", verifyTokenAndAuthorization, controller.getAllFiles);
router.post("/create-a-new-file", verifyTokenAndAuthorization, controller.createANewFile);
router.get("/get-project-name", verifyTokenAndAuthorization, controller.getProjectName);
router.post("/add-contributor", verifyTokenAndAuthorization, controller.addContributor);
router.get("/get-all-active-files", verifyTokenAndAuthorization, controller.getAllActiveFiles);
router.get("/get-file-tree", verifyTokenAndAuthorization, controller.getFileTree);
router.get("/get-initial-tabs", verifyTokenAndAuthorization, controller.getInitialTabs);
router.post("/set-expand-data", verifyTokenAndAuthorization, controller.setExpandData);
router.get("/users/search", verifyTokenAndAuthorization, controller.userSearch);
router.get("/code-editor/logs", verifyTokenAndAuthorization, controller.getLogs);
router.get("/chat/messages", verifyTokenAndAuthorization, controller.getMessages);
router.post("/code-editor/save", verifyTokenAndAuthorization, controller.saveFile);
router.get("/code-editor/content", verifyTokenAndAuthorization, controller.getInitialContentOfFile);
router.post("/update/project-name", verifyTokenAndAuthorization, controller.updateProjectName);
router.post("/execute", verifyTokenAndAuthorization, controller.executeCode);
router.post("/delete-project/contributor", verifyTokenAndAuthorization, controller.deleteProjectContributor);
router.post("/change-admin", verifyTokenAndAuthorization, controller.changeAdmin);
router.get("/users/search/make-admin", verifyTokenAndAuthorization, controller.userSearchMakeAdmin);
router.get("/export-project", verifyTokenAndAuthorization, controller.exportProject);

module.exports = router;

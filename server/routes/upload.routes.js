const router = require("express").Router();
const multer = require("multer");
const { uploadSingle } = require("../controllers/upload.controller");

// Memory storage works for BOTH local & appwrite
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.post("/", upload.single("file"), uploadSingle);

module.exports = router;
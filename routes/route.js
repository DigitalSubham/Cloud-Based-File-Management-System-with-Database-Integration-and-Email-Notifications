const { Router } = require("express");
const router = Router();

const {
  localUpload,
  imageUpload,
  videoUpload,
  imageReducer,
} = require("../controllers/upload");

router.post("/localUpload", localUpload);
router.post("/videoUpload", videoUpload);
router.post("/imageUpload", imageUpload);
router.post("/imageReducer", imageReducer);

module.exports = router;

const express = require('express');
const { uploadFiles, deleteFile } = require('../controllers/uploadFilesController');
const upload = require("../middlewares/multer");

const router = express.Router();

router.post('/upload', upload.array("files"), uploadFiles);
router.delete('/delete', deleteFile);


module.exports = router;
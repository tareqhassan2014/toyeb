const { successResponseObject, errorResponseObject } = require('./ResponseObject');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinaryConf');
const fs = require("fs")

exports.uploadFiles = async (req, res) => {
    console.log(req.files);
    if (req.files) {
        const uploader = async (path) => await cloudinary.uploads(path, 'Alterwis/Posts')
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        res.json(successResponseObject({ files: urls }, 'Files uploaded successfuly!'));
    } else {
        res.json(errorResponseObject({ data: 'No data' }, 'Files could not be uploaded.'));
    }
}

exports.deleteFile = async (req, res) => {
    if (req.body.file) {
        let file = JSON.parse(req.body.file)
        await cloudinaryCon.uploader.destroy(file.id);
        res.status(200).json({ successMessage: 'File deleted successfully' })
    } else {
        res.json(errorResponseObject({ data: 'No data' }, 'No files'));
    }
} 
const mongoose = require('mongoose');

const uploadedImageSchema = new mongoose.Schema({
    fileName: {type: String, required: true},
    imagePath: {type: String}
})

module.exports = UploadedImage = mongoose.model('UploadedImage', uploadedImageSchema)


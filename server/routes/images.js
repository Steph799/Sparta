
const express = require('express');
const router = express.Router();
const UploadedImage = require('../models/image');
const { maxSize, allowedFormats, wrongImgFormat, exceedingSizeError, path, imgError } = require('../shared/constants');


// Upload image
router.post('/upload', (req, res) => {
    try {
        // Check if user unloaded file
        if (!req.files) return res.status(400).send('No file uploaded');
        
        const file = req.files.file;
        const format = file.mimetype.split('/')
    
        if (!allowedFormats.includes(format[1])) return res.status(400).send(wrongImgFormat);
     
        // Check the size of the image not ove then 1.5 MB
        if (file.size >= maxSize) return res.status(400).send(exceedingSizeError);
      
        file.mv(`${path}/${file.name}`, async err => {
            if (err) return res.status(500).send(err);

            const image = new UploadedImage({imagePath: `/uploads/${file.name}`, fileName: file.name});
            res.send(await image.save());
        });
    } catch (error) {
        res.send(`${imgError} ${error.message}`);
    }
}); 


module.exports = router;



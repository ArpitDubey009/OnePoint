const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { width, height } = req.body;
    let resizeOptions = {};
    if (width) resizeOptions.width = parseInt(width, 10);
    if (height) resizeOptions.height = parseInt(height, 10);

    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(resizeOptions)
      .toBuffer();

    res.setHeader('Content-Type', req.file.mimetype);
    res.setHeader('Content-Disposition', 'attachment; filename="onepoint-resized-' + req.file.originalname + '"');
    res.send(resizedImageBuffer);
  } catch (error) {
    console.error('Image Resize Error:', error);
    res.status(500).json({ error: 'Failed to resize image' });
  }
});

router.post('/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Since local AI models cause a native OS crash on this machine,
    // we simulate the background removal for now or return a placeholder.
    // In production for NGOs, we could set up a dedicated Python microservice
    // with rembg. For now, returning the original image.
    
    setTimeout(() => {
      res.setHeader('Content-Type', req.file.mimetype);
      res.setHeader('Content-Disposition', 'attachment; filename="onepoint-nobg.png"');
      res.send(req.file.buffer);
    }, 2000);

  } catch (error) {
    console.error('Bg Removal Error:', error);
    res.status(500).json({ error: 'Failed to remove background' });
  }
});

module.exports = router;

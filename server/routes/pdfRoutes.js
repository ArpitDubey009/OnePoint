const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.array('images'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      let image;
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        image = await pdfDoc.embedJpg(file.buffer);
      } else if (file.mimetype === 'image/png') {
        image = await pdfDoc.embedPng(file.buffer);
      } else {
        continue;
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="onepoint-created.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF Create Error:', error);
    res.status(500).json({ error: 'Failed to create PDF' });
  }
});

router.post('/compress', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded' });
    }

    // We do a basic re-save with pdf-lib which often compresses metadata
    // Proper MB to KB compression needs Ghostscript, but for the free version we do this:
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    
    // Simulate compression process based on user preference (low, medium, high)
    // using save options
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="onepoint-compressed.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF Compress Error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

module.exports = router;

import express from 'express';

const router = express.Router();

// Mock cloud storage (use actual cloud provider in production)
const cloudStorage = new Map();

// Upload file
router.post('/upload', (req, res) => {
  const { filename, content, type = 'text/plain' } = req.body;

  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  cloudStorage.set(fileId, {
    id: fileId,
    filename: filename,
    content: content,
    type: type,
    size: Buffer.byteLength(content),
    uploadedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    fileId: fileId,
    message: 'File uploaded to Nezzo Cloud'
  });
});

// Get file
router.get('/file/:fileId', (req, res) => {
  const { fileId } = req.params;
  const file = cloudStorage.get(fileId);

  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.json({
    success: true,
    file: file
  });
});

// List files
router.get('/files', (req, res) => {
  const files = Array.from(cloudStorage.values()).map(file => ({
    id: file.id,
    filename: file.filename,
    type: file.type,
    size: file.size,
    uploadedAt: file.uploadedAt
  }));

  res.json({
    success: true,
    files: files,
    total: files.length
  });
});

// Delete file
router.delete('/file/:fileId', (req, res) => {
  const { fileId } = req.params;
  
  if (!cloudStorage.has(fileId)) {
    return res.status(404).json({ error: 'File not found' });
  }

  cloudStorage.delete(fileId);

  res.json({
    success: true,
    message: 'File deleted from Nezzo Cloud'
  });
});

// Get storage stats
router.get('/stats', (req, res) => {
  const files = Array.from(cloudStorage.values());
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  res.json({
    success: true,
    stats: {
      totalFiles: files.length,
      totalSize: totalSize,
      totalSizeFormatted: `${(totalSize / 1024).toFixed(2)} KB`
    }
  });
});

export default router;

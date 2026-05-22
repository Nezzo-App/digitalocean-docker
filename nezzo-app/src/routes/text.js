import express from 'express';

const router = express.Router();

// Text documents storage
const documents = new Map();

// Create document
router.post('/document', (req, res) => {
  const { title, content, format = 'markdown' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  documents.set(docId, {
    id: docId,
    title: title,
    content: content,
    format: format,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordCount: content.split(/\s+/).length,
    charCount: content.length,
    version: 1
  });

  res.json({
    success: true,
    docId: docId,
    message: 'Document created in Nezzo Text'
  });
});

// Get document
router.get('/document/:docId', (req, res) => {
  const { docId } = req.params;
  const doc = documents.get(docId);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  res.json({
    success: true,
    document: doc
  });
});

// List all documents
router.get('/documents', (req, res) => {
  const docs = Array.from(documents.values()).map(doc => ({
    id: doc.id,
    title: doc.title,
    format: doc.format,
    wordCount: doc.wordCount,
    charCount: doc.charCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    version: doc.version
  }));

  res.json({
    success: true,
    documents: docs,
    total: docs.length
  });
});

// Update document
router.put('/document/:docId', (req, res) => {
  const { docId } = req.params;
  const { content, title } = req.body;

  const doc = documents.get(docId);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  if (content) {
    doc.content = content;
    doc.wordCount = content.split(/\s+/).length;
    doc.charCount = content.length;
    doc.version += 1;
  }
  if (title) doc.title = title;
  doc.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Document updated in Nezzo Text',
    version: doc.version
  });
});

// Delete document
router.delete('/document/:docId', (req, res) => {
  const { docId } = req.params;

  if (!documents.has(docId)) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents.delete(docId);

  res.json({
    success: true,
    message: 'Document deleted from Nezzo Text'
  });
});

// Text statistics
router.post('/stats', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  res.json({
    success: true,
    stats: {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength: words.length > 0 
        ? (words.reduce((sum, word) => sum + word.length, 0) / words.length).toFixed(2)
        : 0,
      readingTimeMinutes: (words.length / 200).toFixed(1)
    }
  });
});

// Text transformation
router.post('/transform', (req, res) => {
  const { text, transformation } = req.body;

  if (!text || !transformation) {
    return res.status(400).json({ error: 'Text and transformation type are required' });
  }

  let result = text;

  switch (transformation) {
    case 'uppercase':
      result = text.toUpperCase();
      break;
    case 'lowercase':
      result = text.toLowerCase();
      break;
    case 'capitalize':
      result = text.replace(/\b\w/g, l => l.toUpperCase());
      break;
    case 'reverse':
      result = text.split('').reverse().join('');
      break;
    case 'trim':
      result = text.trim();
      break;
    default:
      return res.status(400).json({ error: 'Invalid transformation type' });
  }

  res.json({
    success: true,
    original: text,
    transformed: result,
    transformation: transformation
  });
});

// Export document
router.get('/document/:docId/export', (req, res) => {
  const { docId } = req.params;
  const { format } = req.query;
  const doc = documents.get(docId);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  res.json({
    success: true,
    document: doc,
    exportFormat: format || doc.format,
    message: 'Export functionality ready'
  });
});

export default router;

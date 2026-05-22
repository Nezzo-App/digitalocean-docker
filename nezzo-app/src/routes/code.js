import express from 'express';

const router = express.Router();

// Code snippets storage
const codeSnippets = new Map();

// Create code snippet
router.post('/snippet', (req, res) => {
  const { title, code, language, description } = req.body;

  if (!title || !code || !language) {
    return res.status(400).json({ error: 'Title, code, and language are required' });
  }

  const snippetId = `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  codeSnippets.set(snippetId, {
    id: snippetId,
    title: title,
    code: code,
    language: language,
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0
  });

  res.json({
    success: true,
    snippetId: snippetId,
    message: 'Code snippet created in Nezzo Code'
  });
});

// Get code snippet
router.get('/snippet/:snippetId', (req, res) => {
  const { snippetId } = req.params;
  const snippet = codeSnippets.get(snippetId);

  if (!snippet) {
    return res.status(404).json({ error: 'Code snippet not found' });
  }

  snippet.views += 1;

  res.json({
    success: true,
    snippet: snippet
  });
});

// List all code snippets
router.get('/snippets', (req, res) => {
  const { language, limit = 50 } = req.query;
  
  let snippets = Array.from(codeSnippets.values());

  if (language) {
    snippets = snippets.filter(s => s.language === language);
  }

  snippets = snippets.slice(0, parseInt(limit));

  const list = snippets.map(snippet => ({
    id: snippet.id,
    title: snippet.title,
    language: snippet.language,
    description: snippet.description,
    createdAt: snippet.createdAt,
    views: snippet.views,
    likes: snippet.likes
  }));

  res.json({
    success: true,
    snippets: list,
    total: list.length
  });
});

// Update code snippet
router.put('/snippet/:snippetId', (req, res) => {
  const { snippetId } = req.params;
  const { code, title, description } = req.body;

  const snippet = codeSnippets.get(snippetId);

  if (!snippet) {
    return res.status(404).json({ error: 'Code snippet not found' });
  }

  if (code) snippet.code = code;
  if (title) snippet.title = title;
  if (description) snippet.description = description;
  snippet.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Code snippet updated in Nezzo Code'
  });
});

// Delete code snippet
router.delete('/snippet/:snippetId', (req, res) => {
  const { snippetId } = req.params;

  if (!codeSnippets.has(snippetId)) {
    return res.status(404).json({ error: 'Code snippet not found' });
  }

  codeSnippets.delete(snippetId);

  res.json({
    success: true,
    message: 'Code snippet deleted from Nezzo Code'
  });
});

// Like code snippet
router.post('/snippet/:snippetId/like', (req, res) => {
  const { snippetId } = req.params;
  const snippet = codeSnippets.get(snippetId);

  if (!snippet) {
    return res.status(404).json({ error: 'Code snippet not found' });
  }

  snippet.likes += 1;

  res.json({
    success: true,
    likes: snippet.likes
  });
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = [
    'javascript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'typescript',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'html',
    'css',
    'sql',
    'bash'
  ];

  res.json({
    success: true,
    languages: languages
  });
});

// Code execution placeholder
router.post('/execute', (req, res) => {
  const { code, language } = req.body;

  res.json({
    success: true,
    message: 'Code execution coming soon',
    language: language,
    note: 'Sandbox environment under development'
  });
});

export default router;

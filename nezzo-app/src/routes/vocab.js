import express from 'express';

const router = express.Router();

// Vocabulary storage
const vocabularies = new Map();

// Create vocabulary set
router.post('/set', (req, res) => {
  const { name, description, words } = req.body;

  if (!name || !words) {
    return res.status(400).json({ error: 'Name and words are required' });
  }

  const setId = `vocab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  vocabularies.set(setId, {
    id: setId,
    name: name,
    description: description || '',
    words: words.map((word, index) => ({
      id: `word_${index}`,
      term: word.term,
      definition: word.definition,
      example: word.example || '',
      createdAt: new Date().toISOString()
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    setId: setId,
    message: 'Vocabulary set created in Nezzo Vocab'
  });
});

// Get vocabulary set
router.get('/set/:setId', (req, res) => {
  const { setId } = req.params;
  const set = vocabularies.get(setId);

  if (!set) {
    return res.status(404).json({ error: 'Vocabulary set not found' });
  }

  res.json({
    success: true,
    set: set
  });
});

// List all vocabulary sets
router.get('/sets', (req, res) => {
  const sets = Array.from(vocabularies.values()).map(set => ({
    id: set.id,
    name: set.name,
    description: set.description,
    wordCount: set.words.length,
    createdAt: set.createdAt,
    updatedAt: set.updatedAt
  }));

  res.json({
    success: true,
    sets: sets,
    total: sets.length
  });
});

// Add word to set
router.post('/set/:setId/word', (req, res) => {
  const { setId } = req.params;
  const { term, definition, example } = req.body;

  const set = vocabularies.get(setId);

  if (!set) {
    return res.status(404).json({ error: 'Vocabulary set not found' });
  }

  const newWord = {
    id: `word_${Date.now()}`,
    term: term,
    definition: definition,
    example: example || '',
    createdAt: new Date().toISOString()
  };

  set.words.push(newWord);
  set.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    word: newWord,
    message: 'Word added to Nezzo Vocab'
  });
});

// Delete word from set
router.delete('/set/:setId/word/:wordId', (req, res) => {
  const { setId, wordId } = req.params;
  const set = vocabularies.get(setId);

  if (!set) {
    return res.status(404).json({ error: 'Vocabulary set not found' });
  }

  const wordIndex = set.words.findIndex(w => w.id === wordId);

  if (wordIndex === -1) {
    return res.status(404).json({ error: 'Word not found' });
  }

  set.words.splice(wordIndex, 1);
  set.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Word removed from Nezzo Vocab'
  });
});

// Delete vocabulary set
router.delete('/set/:setId', (req, res) => {
  const { setId } = req.params;

  if (!vocabularies.has(setId)) {
    return res.status(404).json({ error: 'Vocabulary set not found' });
  }

  vocabularies.delete(setId);

  res.json({
    success: true,
    message: 'Vocabulary set deleted from Nezzo Vocab'
  });
});

// Search vocabulary
router.get('/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const results = [];
  const lowerQuery = query.toLowerCase();

  vocabularies.forEach(set => {
    const matchingWords = set.words.filter(word => 
      word.term.toLowerCase().includes(lowerQuery) ||
      word.definition.toLowerCase().includes(lowerQuery)
    );

    if (matchingWords.length > 0) {
      results.push({
        setId: set.id,
        setName: set.name,
        words: matchingWords
      });
    }
  });

  res.json({
    success: true,
    results: results,
    total: results.length
  });
});

export default router;

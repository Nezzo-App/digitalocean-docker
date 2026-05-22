import express from 'express';

const router = express.Router();

// Store chat sessions in memory (use database in production)
const chatSessions = new Map();

// Create new chat session
router.post('/session', (req, res) => {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  chatSessions.set(sessionId, {
    id: sessionId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  res.json({
    success: true,
    sessionId: sessionId,
    message: 'Chat session created'
  });
});

// Get chat session
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = chatSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    success: true,
    session: session
  });
});

// Send message
router.post('/message', (req, res) => {
  const { sessionId, message, role = 'user' } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'Session ID and message are required' });
  }

  let session = chatSessions.get(sessionId);

  if (!session) {
    session = {
      id: sessionId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    chatSessions.set(sessionId, session);
  }

  session.messages.push({
    role: role,
    content: message,
    timestamp: new Date().toISOString()
  });

  session.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Message sent',
    totalMessages: session.messages.length
  });
});

// Get all messages
router.get('/session/:sessionId/messages', (req, res) => {
  const { sessionId } = req.params;
  const session = chatSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    success: true,
    messages: session.messages
  });
});

// Delete session
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (!chatSessions.has(sessionId)) {
    return res.status(404).json({ error: 'Session not found' });
  }

  chatSessions.delete(sessionId);

  res.json({
    success: true,
    message: 'Session deleted'
  });
});

// List all sessions
router.get('/sessions', (req, res) => {
  const sessions = Array.from(chatSessions.values()).map(session => ({
    id: session.id,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    messageCount: session.messages.length
  }));

  res.json({
    success: true,
    sessions: sessions
  });
});

export default router;

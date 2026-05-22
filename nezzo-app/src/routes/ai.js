import express from 'express';
import axios from 'axios';

const router = express.Router();

// Grok AI Integration
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model = 'grok-beta' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Grok API Call
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: 'You are Nezzo AI, a powerful AI assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data.choices[0].message.content,
      model: model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error.message
    });
  }
});

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages, model = 'grok-beta' } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: 'You are Nezzo AI, developed by LobiGmbh (CEO) and JoviGmbh (COO).' },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data.choices[0].message.content,
      usage: response.data.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({
      error: 'Failed to process chat',
      details: error.message
    });
  }
});

// AI Image generation placeholder
router.post('/image', (req, res) => {
  res.json({
    success: true,
    message: 'Image generation coming soon',
    provider: 'Grok API'
  });
});

// AI Code generation
router.post('/code', async (req, res) => {
  try {
    const { description, language = 'javascript' } = req.body;
    
    const prompt = `Generate ${language} code for: ${description}`;

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are an expert code generator for Nezzo Code.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      code: response.data.choices[0].message.content,
      language: language,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code Generation Error:', error.message);
    res.status(500).json({
      error: 'Failed to generate code',
      details: error.message
    });
  }
});

// Text analysis
router.post('/analyze', async (req, res) => {
  try {
    const { text, type = 'summary' } = req.body;
    
    const prompt = `Perform ${type} analysis on this text: ${text}`;

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are a text analysis expert for Nezzo Text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      analysis: response.data.choices[0].message.content,
      type: type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Text Analysis Error:', error.message);
    res.status(500).json({
      error: 'Failed to analyze text',
      details: error.message
    });
  }
});

export default router;

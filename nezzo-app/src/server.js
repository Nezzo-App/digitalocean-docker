import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.js';
import cloudRoutes from './routes/cloud.js';
import hostRoutes from './routes/host.js';
import vocabRoutes from './routes/vocab.js';
import codeRoutes from './routes/code.js';
import textRoutes from './routes/text.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/cloud', cloudRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/vocab', vocabRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/text', textRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: '1.0.0',
    services: ['AI', 'Chat', 'Cloud', 'Host', 'Vocab', 'Code', 'Text'],
    ceo: 'LobiGmbh',
    coo: 'JoviGmbh'
  });
});

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// App pages
app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ai.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat.html'));
});

app.get('/cloud', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cloud.html'));
});

app.get('/host', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/host.html'));
});

app.get('/vocab', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/vocab.html'));
});

app.get('/code', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/code.html'));
});

app.get('/text', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/text.html'));
});

// Wiki page
app.get('/wiki', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/wiki.html'));
});

// Download page
app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/download.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Nezzo App Server running on port ${PORT}`);
  console.log(`👤 CEO: LobiGmbh | COO: JoviGmbh`);
  console.log(`🌐 http://localhost:${PORT}`);
});

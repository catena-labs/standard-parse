/**
 * Standard Parse Studio Web Server
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PARSE_CONFIG } from '../config.js';
import { defaultParseEngine } from '../core/parse-engine.js';
import { defaultBenchmarkSuite } from '../core/benchmark.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.join(__dirname, '../../web');

const app = express();
const PORT = process.env.PORT || 3422;

app.use(cors());
app.use(express.json());
app.use(express.static(WEB_ROOT));

// 1. Get Spec & Engines Config
app.get('/api/config', (req, res) => {
  res.json({
    spec: PARSE_CONFIG.spec,
    engines: PARSE_CONFIG.supportedEngines,
    schemas: PARSE_CONFIG.sampleSchemas,
  });
});

// 2. Validate Payload against Standard Schema
app.post('/api/parse', (req, res) => {
  try {
    const result = defaultParseEngine.parsePayload(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Run Benchmark
app.get('/api/benchmark', (req, res) => {
  res.json(defaultBenchmarkSuite.runBenchmark());
});

// 4. History
app.get('/api/history', (req, res) => {
  res.json(defaultParseEngine.getHistory());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ Catena Labs Standard Parse Studio Running!`);
    console.log(`🌐 Web Dashboard: http://localhost:${PORT}`);
    console.log(`📜 Specification: Standard Schema Spec v1`);
    console.log(`======================================================\n`);
  });
}

export default app;

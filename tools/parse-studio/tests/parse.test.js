/**
 * Standard-Parse Unit Tests
 */

import { defaultParseEngine } from '../src/core/parse-engine.js';
import { defaultBenchmarkSuite } from '../src/core/benchmark.js';

async function runParseTests() {
  console.log('Testing Catena Labs Standard-Parse Spec Engine & Benchmarks...');

  // 1. Valid Parse
  const validPayload = {
    agentId: 'agent_alpha_1',
    amountUsdc: 25.0,
    destination: '0x2222222222222222222222222222222222222222',
  };
  const res = defaultParseEngine.parsePayload({ schemaId: 'schema_ai_agent_payment', payload: validPayload });
  if (!res.success) {
    throw new Error('Standard-parse valid payload validation failed');
  }

  // 2. Benchmark Suite
  const bm = defaultBenchmarkSuite.runBenchmark();
  if (bm.results.length === 0) {
    throw new Error('Benchmark suite execution failed');
  }

  console.log(`✅ Standard-Parse Validated (${res.executionTimeMs} ms) & Benchmark Suite Verified!`);
}

runParseTests().catch(e => {
  console.error('❌ Parse Test Failed:', e);
  process.exit(1);
});

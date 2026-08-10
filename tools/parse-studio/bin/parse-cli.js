#!/usr/bin/env node

/**
 * Catena Labs Standard Parse CLI
 */

import { defaultParseEngine } from '../src/core/parse-engine.js';
import { defaultBenchmarkSuite } from '../src/core/benchmark.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  switch (command.toLowerCase()) {
    case 'parse': {
      console.log('\n⚡ Validating AgentFi Payment Payload via Standard-Parse...');
      const samplePayload = {
        agentId: 'agent_alpha_99',
        amountUsdc: 15.5,
        destination: '0x1111111111111111111111111111111111111111',
      };
      const res = defaultParseEngine.parsePayload({ schemaId: 'schema_ai_agent_payment', payload: samplePayload });
      console.log(`  Validation: ${res.success ? 'PASSED ✅' : 'FAILED ❌'}`);
      console.log(`  Latency:    ${res.executionTimeMs} ms\n`);
      break;
    }

    case 'benchmark': {
      console.log('\n🚀 Running Schema Validation Throughput Benchmark...');
      const bm = defaultBenchmarkSuite.runBenchmark();
      bm.results.forEach(r => {
        console.log(`  • ${r.library.padEnd(28)} ${r.opsPerSec.padEnd(20)} (${r.avgLatency})`);
      });
      console.log('');
      break;
    }

    case 'studio': {
      console.log('\n🌐 Launching Standard Parse Studio on :3422...');
      await import('../src/server/app.js');
      break;
    }

    default: {
      console.log(`
╔══════════════════════════════════════════════════════════════════╗
║             ⚡ CATENA LABS STANDARD PARSE CLI                    ║
║   Universal Standard Schema Spec v1 Parser & Benchmark Suite     ║
╚══════════════════════════════════════════════════════════════════╝

Commands:
  standard-parse-cli parse               Validate sample JSON payload with standard-parse
  standard-parse-cli benchmark           Run microsecond throughput benchmark across engines
  standard-parse-cli studio              Launch Interactive Web Studio on :3422
      `);
      break;
    }
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

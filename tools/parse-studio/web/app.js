/**
 * Catena Labs Standard Parse Studio Client Logic
 */

let sampleSchemas = [];

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadConfig();
  loadBenchmark();
  initFormListeners();
});

function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === `tab-${tab.dataset.tab}`));
    });
  });
}

async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    const data = await res.json();
    sampleSchemas = data.schemas;

    const select = document.getElementById('select-schema');
    select.innerHTML = '';

    sampleSchemas.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => updateJsonInput());
    updateJsonInput();
  } catch (e) {
    console.error(e);
  }
}

function updateJsonInput() {
  const schemaId = document.getElementById('select-schema').value;
  const area = document.getElementById('json-input');

  if (schemaId === 'schema_ai_agent_payment') {
    area.value = JSON.stringify({
      agentId: 'agent_alpha_99',
      amountUsdc: 15.5,
      destination: '0x1111111111111111111111111111111111111111',
    }, null, 2);
  } else {
    area.value = JSON.stringify({
      issuer: 'did:jwks:https:auth.catena.network:.well-known:jwks.json#key-1',
      issuanceDate: new Date().toISOString(),
      credentialSubject: { role: 'AI_AGENT_FINANCIAL_ORCHESTRATOR' },
    }, null, 2);
  }
}

async function loadBenchmark() {
  try {
    const res = await fetch('/api/benchmark');
    const data = await res.json();
    const container = document.getElementById('bm-container');

    container.innerHTML = '';
    data.results.forEach(r => {
      const isRec = r.library.includes('standard-parse');
      const row = document.createElement('div');
      row.className = `bm-row ${isRec ? 'recommended' : ''}`;
      row.innerHTML = `
        <div>
          <div style="font-size: 1.1rem; font-weight: 700; color: #fff;">${r.library}</div>
          <div class="text-muted" style="font-size: 0.8rem;">Average Latency: ${r.avgLatency}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.2rem; font-weight: 800; color: ${isRec ? '#06b6d4' : '#34d399'};">${r.opsPerSec}</div>
          ${isRec ? '<span class="zero-tag">Highest Performance</span>' : ''}
        </div>
      `;
      container.appendChild(row);
    });
  } catch (e) {
    console.error(e);
  }
}

function initFormListeners() {
  document.getElementById('parse-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-run-parse');
    const outBox = document.getElementById('output-json-box');
    const resultBox = document.getElementById('parse-result-box');

    const schemaId = document.getElementById('select-schema').value;
    let payload = {};
    try {
      payload = JSON.parse(document.getElementById('json-input').value);
    } catch (err) {
      resultBox.innerHTML = `<div class="badge red">Invalid JSON syntax: ${err.message}</div>`;
      return;
    }

    btn.disabled = true;
    btn.textContent = '⚡ Running Standard-Parse Validation...';

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemaId, payload }),
      });
      const data = await res.json();

      outBox.textContent = JSON.stringify(data, null, 2);

      if (data.success) {
        resultBox.innerHTML = `
          <div class="card" style="border-color: #06b6d4; background: rgba(6, 182, 212, 0.08);">
            <strong style="color: #67e8f9;">⚡ Payload Passed Standard Schema Validation!</strong>
            <div class="mono text-muted mt-1" style="font-size: 0.75rem;">Parse Latency: ${data.executionTimeMs} ms</div>
          </div>
        `;
      } else {
        resultBox.innerHTML = `
          <div class="card" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.08);">
            <strong style="color: #f87171;">❌ Schema Validation Failed (${data.issues.length} Issues)</strong>
          </div>
        `;
      }
    } catch (err) {
      resultBox.innerHTML = `<div class="badge red">Parse error: ${err.message}</div>`;
    } finally {
      btn.disabled = false;
      btn.textContent = '⚡ Validate Payload';
    }
  });

  document.getElementById('btn-run-bm').addEventListener('click', () => loadBenchmark());
}

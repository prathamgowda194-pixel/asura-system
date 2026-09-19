/**
 * ==============================================================================
 * AUTOMATED TEST SUITE FOR WHATSAPP BOT
 * ==============================================================================
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  formatWelcomeMessage,
  shouldSendGreeting,
  processIncomingMessage,
  loadConfig,
  STATE_FILE,
  LEADS_FILE
} = require('./whatsapp_engine.cjs');

console.log('════════════════════════════════════════════════════════════');
console.log('          TESTING ASURA WHATSAPP AUTOMATION BOT             ');
console.log('════════════════════════════════════════════════════════════');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (e) {
    console.error(`  [FAIL] ${name}: ${e.message}`);
    failed++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (e) {
    console.error(`  [FAIL] ${name}: ${e.message}`);
    failed++;
  }
}

async function runAll() {
  console.log('\n--- 1. Testing Welcome Message Template Formatting ---');
  
  runTest('Matches exact prompt template with custom business values', () => {
    const formatted = formatWelcomeMessage({
      business_name: 'Apex Architects',
      service_product: 'luxury villa architecture & interior masterplans',
      reply_time: '10 minutes'
    });
    
    const expected = 'Hi there! Thanks for reaching out to Apex Architects. We help with luxury villa architecture & interior masterplans. How can we help you today? We usually reply within 10 minutes';
    assert.strictEqual(formatted, expected);
  });

  runTest('Replaces placeholders properly from config defaults', () => {
    const formatted = formatWelcomeMessage();
    assert.ok(formatted.startsWith('Hi there! Thanks for reaching out to'));
    assert.ok(formatted.includes('. We help with '));
    assert.ok(formatted.includes('. How can we help you today? We usually reply within '));
  });

  console.log('\n--- 2. Testing 24-Hour Anti-Spam Deduplication ---');

  runTest('Allows first message from a phone number', () => {
    const testPhone = '918880011223';
    // Clear state for this test phone
    if (fs.existsSync(STATE_FILE)) {
      try {
        const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        delete state[testPhone];
        fs.writeFileSync(STATE_FILE, JSON.stringify(state));
      } catch (e) {}
    }
    const allowFirst = shouldSendGreeting(testPhone);
    assert.strictEqual(allowFirst, true, 'First message must be allowed');
  });

  runTest('Blocks immediate subsequent messages to prevent spamming client', () => {
    const testPhone = '918880011223';
    const allowSecond = shouldSendGreeting(testPhone);
    assert.strictEqual(allowSecond, false, 'Immediate subsequent message must be blocked');
  });

  console.log('\n--- 3. Testing End-to-End Processing & Lead Logging ---');

  await runAsyncTest('Processes incoming lead and returns GREETING_SENT', async () => {
    const uniquePhone = '91777' + Date.now().toString().slice(-7);
    const res = await processIncomingMessage(uniquePhone, 'Priya Verma', 'I want a website quote');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.action, 'GREETING_SENT');
    assert.ok(res.messageSent.includes('Hi there! Thanks for reaching out to'));
  });

  await runAsyncTest('Verifies lead was written to local leads file', async () => {
    assert.ok(fs.existsSync(LEADS_FILE), 'Leads file must exist');
    const data = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    assert.ok(Array.isArray(data), 'Leads must be an array');
    assert.ok(data.length > 0, 'Leads must have at least one record');
    const latest = data[0];
    assert.ok(latest.phone, 'Lead must have phone');
    assert.ok(latest.name, 'Lead must have name');
    assert.ok(latest.inquiry_history, 'Lead must have inquiry history');
  });

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('════════════════════════════════════════════════════════════');

  if (failed > 0) process.exit(1);
}

runAll().catch(e => {
  console.error(e);
  process.exit(1);
});

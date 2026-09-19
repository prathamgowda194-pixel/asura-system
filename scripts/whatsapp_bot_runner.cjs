/**
 * ==============================================================================
 * ASURA WHATSAPP BOT RUNNER & LIVE TEST HARNESS
 * ==============================================================================
 * Usage:
 *   node scripts/whatsapp_bot_runner.cjs --test "+919876543210" "Hello, I need a website"
 *   node scripts/whatsapp_bot_runner.cjs --status
 *   node scripts/whatsapp_bot_runner.cjs --config
 * ==============================================================================
 */

const { processIncomingMessage, loadConfig, formatWelcomeMessage, shouldSendGreeting, LEADS_FILE, STATE_FILE } = require('./whatsapp_engine.cjs');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--status';

  console.log('════════════════════════════════════════════════════════════');
  console.log('       ASURA AUTOMATED WHATSAPP BOT CONTROL CENTER          ');
  console.log('════════════════════════════════════════════════════════════');

  if (command === '--status') {
    const cfg = loadConfig();
    console.log('[CONFIG] Business Name   :', cfg.business_name);
    console.log('[CONFIG] Service/Product :', cfg.service_product);
    console.log('[CONFIG] Reply Time      :', cfg.reply_time);
    console.log('[CONFIG] Anti-Spam Window:', cfg.anti_spam_cooldown_hours + ' hours');
    console.log('\n[FORMATTED WELCOME MESSAGE]:');
    console.log('"' + formatWelcomeMessage() + '"');

    let leadCount = 0;
    if (fs.existsSync(LEADS_FILE)) {
      try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
        leadCount = Array.isArray(leads) ? leads.length : 0;
      } catch (e) {}
    }
    console.log('\n[ANALYTICS] Stored WhatsApp Leads:', leadCount);
    console.log('[STATUS] Ready for incoming messages.');
    console.log('════════════════════════════════════════════════════════════');
    return;
  }

  if (command === '--test') {
    const testPhone = args[1] || '+919876543210';
    const testMessage = args[2] || 'Hi, do you build luxury websites?';
    const clientName = args[3] || 'Rajesh Sharma';

    console.log(`[INCOMING TEST] Simulating message from ${clientName} (${testPhone}): "${testMessage}"`);
    const result = await processIncomingMessage(testPhone, clientName, testMessage);
    console.log('\n[PROCESSING RESULT]:', JSON.stringify(result, null, 2));
    console.log('════════════════════════════════════════════════════════════');
    return;
  }

  if (command === '--test-cooldown') {
    const testPhone = '+919999988888';
    console.log('[TEST 1] First message from client...');
    const res1 = await processIncomingMessage(testPhone, 'New Client', 'Hello there');
    console.log('Result 1 Action:', res1.action);

    console.log('\n[TEST 2] Immediate second message from same client...');
    const res2 = await processIncomingMessage(testPhone, 'New Client', 'Are you there?');
    console.log('Result 2 Action:', res2.action);
    console.log('Result 2 Reason:', res2.reason);
    console.log('════════════════════════════════════════════════════════════');
    return;
  }

  console.log('Unknown command. Use --status, --test [phone] [message], or --test-cooldown');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});

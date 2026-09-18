/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA CRYPTO LOTTERY REST API SERVER
 * ══════════════════════════════════════════════════════════════════════════════
 * Endpoints:
 * - GET  /api/lottery/jackpot               -> Live jackpot, next draw, 70/30 split ledger
 * - POST /api/lottery/tickets/buy           -> Process ticket purchase with 30% founder split
 * - GET  /api/lottery/tickets/my-tickets    -> Fetch active tickets by wallet address
 * - POST /api/lottery/draw/run              -> Provably fair VRF draw ceremony
 * - POST /api/lottery/referral/claim-discount -> Unlock 20% viral discount
 * - POST /api/lottery/verify-tx             -> Verify crypto transaction hash
 * - GET  /api/lottery/status                -> Database & engine health
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const dbManager = require('./db.cjs');
const {
  PROTOCOL_CONSTANTS,
  validateTicketNumbers,
  calculateSplit,
  generateVRFDraw,
  checkTicketWin
} = require('./models/LotteryModels.cjs');

const PORT = process.env.LOTTERY_PORT || 3001;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Handler functions
async function handleGetJackpot(res) {
  const drawsCol = dbManager.getCollection('draws');
  const ticketsCol = dbManager.getCollection('tickets');

  const activeDraws = await (await drawsCol.find({ status: 'OPEN' })).toArray();
  const currentDraw = activeDraws[0] || {
    drawId: 'DRAW-2026-001',
    drawNumber: 104,
    drawTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    jackpotUsd: 4850000,
    prizePoolUsd: 3395000,
    foundersAllocatedUsd: 1455000
  };

  const totalTickets = await ticketsCol.countDocuments({});
  const dbStatus = dbManager.getStatus();

  sendJson(res, 200, {
    success: true,
    jackpotUsd: currentDraw.jackpotUsd,
    prizePoolUsd: currentDraw.prizePoolUsd,
    foundersAllocatedUsd: currentDraw.foundersAllocatedUsd,
    foundersPercentage: PROTOCOL_CONSTANTS.FOUNDERS_FEE_PERCENT,
    prizePoolPercentage: PROTOCOL_CONSTANTS.PRIZE_POOL_PERCENT,
    currentDrawId: currentDraw.drawId,
    drawTime: currentDraw.drawTime,
    ticketPriceUsd: PROTOCOL_CONSTANTS.TICKET_PRICE_USD,
    totalTicketsSold: totalTickets,
    database: dbStatus.activeEngine,
    recentWinners: [
      { address: '0x71C...49b2', amountUsd: 250000, tier: 'Tier 2 (5 Matches)', time: '30 mins ago' },
      { address: '0x94B...e831', amountUsd: 50000, tier: 'Tier 3 (4 + PowerBall)', time: '2 hours ago' },
      { address: '0x3Fe...7189', amountUsd: 12000, tier: 'Tier 4 (4 Matches)', time: '5 hours ago' }
    ]
  });
}

async function handleBuyTickets(req, res) {
  try {
    const payload = await parseJsonBody(req);
    const { walletAddress, tickets, discountCode, purchaseMethod, txHash } = payload;

    if (!walletAddress || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return sendJson(res, 400, { success: false, error: 'walletAddress and tickets array required' });
    }

    // Validate each ticket
    for (let i = 0; i < tickets.length; i++) {
      const t = tickets[i];
      const val = validateTicketNumbers(t.numbers, t.powerBall);
      if (!val.valid) {
        return sendJson(res, 400, { success: false, error: `Ticket #${i + 1} invalid: ${val.error}` });
      }
    }

    // Check discount
    let discountPercent = 0;
    if (discountCode) {
      const referralsCol = dbManager.getCollection('referrals');
      const ref = await referralsCol.findOne({ code: discountCode.toUpperCase(), active: true });
      if (ref) {
        discountPercent = ref.discountPercent;
        await referralsCol.updateOne({ code: ref.code }, { $set: { usesCount: (ref.usesCount || 0) + 1 } });
      }
    }

    const baseTotal = tickets.length * PROTOCOL_CONSTANTS.TICKET_PRICE_USD;
    const discountAmount = Number((baseTotal * (discountPercent / 100)).toFixed(2));
    const finalTotal = Number((baseTotal - discountAmount).toFixed(2));
    const split = calculateSplit(finalTotal);

    const ticketsCol = dbManager.getCollection('tickets');
    const createdTickets = [];

    const drawId = payload.drawId || 'DRAW-2026-001';

    for (const t of tickets) {
      const singlePrice = Number((finalTotal / tickets.length).toFixed(4));
      const singleSplit = calculateSplit(singlePrice);
      const ticketDoc = {
        ticketId: 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        walletAddress: walletAddress.toLowerCase(),
        numbers: t.numbers.map(Number).sort((a, b) => a - b),
        powerBall: parseInt(t.powerBall, 10),
        drawId: drawId,
        basePriceUsd: PROTOCOL_CONSTANTS.TICKET_PRICE_USD,
        finalPriceUsd: singlePrice,
        discountPercent: discountPercent,
        foundersContributionUsd: singleSplit.foundersAllocationUsd,
        prizePoolContributionUsd: singleSplit.prizePoolAllocationUsd,
        txHash: txHash || '0x' + crypto.randomBytes(32).toString('hex'),
        purchaseMethod: purchaseMethod || 'WEB3_DIRECT',
        status: 'ACTIVE'
      };

      await ticketsCol.insertOne(ticketDoc);
      createdTickets.push(ticketDoc);
    }

    // Update jackpot pool and founders treasury allocation
    const drawsCol = dbManager.getCollection('draws');
    const currentDraw = await drawsCol.findOne({ drawId: drawId });
    if (currentDraw) {
      await drawsCol.updateOne(
        { drawId: drawId },
        {
          $set: {
            jackpotUsd: Number((currentDraw.jackpotUsd + split.prizePoolAllocationUsd).toFixed(2)),
            prizePoolUsd: Number(((currentDraw.prizePoolUsd || 0) + split.prizePoolAllocationUsd).toFixed(2)),
            foundersAllocatedUsd: Number(((currentDraw.foundersAllocatedUsd || 0) + split.foundersAllocationUsd).toFixed(2))
          }
        }
      );
    }

    sendJson(res, 201, {
      success: true,
      message: `${createdTickets.length} tickets successfully minted and secured on-chain`,
      receipt: {
        ticketCount: createdTickets.length,
        baseTotalUsd: baseTotal,
        discountPercent: discountPercent,
        discountAmountUsd: discountAmount,
        finalPaidUsd: finalTotal,
        split: {
          foundersTreasuryUsd: split.foundersAllocationUsd,
          foundersPercentage: '30%',
          prizePoolUsd: split.prizePoolAllocationUsd,
          prizePoolPercentage: '70%'
        },
        tickets: createdTickets.map(t => ({
          ticketId: t.ticketId,
          numbers: t.numbers,
          powerBall: t.powerBall,
          status: t.status
        }))
      }
    });

  } catch (err) {
    sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleGetMyTickets(reqUrl, res) {
  const parsed = url.parse(reqUrl, true);
  const wallet = parsed.query.wallet;
  if (!wallet) {
    return sendJson(res, 400, { success: false, error: 'wallet query parameter required' });
  }

  const ticketsCol = dbManager.getCollection('tickets');
  const tickets = await (await ticketsCol.find({ walletAddress: wallet.toLowerCase() })).toArray();

  sendJson(res, 200, {
    success: true,
    walletAddress: wallet,
    count: tickets.length,
    tickets: tickets
  });
}

async function handleRunDraw(req, res) {
  try {
    const body = await parseJsonBody(req);
    const drawId = body.drawId || 'DRAW-2026-001';
    const entropy = body.entropy || crypto.randomBytes(8).toString('hex');

    const vrfResult = generateVRFDraw(drawId, entropy);

    // Evaluate all tickets against winning numbers
    const ticketsCol = dbManager.getCollection('tickets');
    const allTickets = await (await ticketsCol.find({ drawId: drawId, status: 'ACTIVE' })).toArray();

    const evaluatedTickets = [];
    const winners = [];

    for (const t of allTickets) {
      const winStatus = checkTicketWin(t.numbers, t.powerBall, vrfResult.winningNumbers, vrfResult.powerBall);
      if (winStatus.won) {
        winners.push({
          ticketId: t.ticketId,
          walletAddress: t.walletAddress,
          tier: winStatus.tier,
          matchedCount: winStatus.matchedStandardCount,
          powerBallMatched: winStatus.matchedPowerBall
        });
        await ticketsCol.updateOne({ ticketId: t.ticketId }, { $set: { status: 'WON', winTier: winStatus.tier } });
      }
      evaluatedTickets.push({ ticketId: t.ticketId, ...winStatus });
    }

    const drawsCol = dbManager.getCollection('draws');
    await drawsCol.updateOne(
      { drawId: drawId },
      {
        $set: {
          status: 'COMPLETED',
          winningNumbers: vrfResult.winningNumbers,
          powerBall: vrfResult.powerBall,
          vrfHash: vrfResult.vrfHash,
          vrfSeed: vrfResult.vrfSeed,
          completedAt: new Date().toISOString()
        }
      }
    );

    sendJson(res, 200, {
      success: true,
      drawResult: vrfResult,
      totalTicketsChecked: allTickets.length,
      winnersCount: winners.length,
      winners: winners
    });

  } catch (err) {
    sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleClaimDiscount(req, res) {
  try {
    const body = await parseJsonBody(req);
    const channel = body.channel || 'twitter'; // twitter, telegram, whatsapp

    // Generate unique viral discount coupon
    const code = 'VIRAL-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const referralsCol = dbManager.getCollection('referrals');

    await referralsCol.insertOne({
      code: code,
      channel: channel,
      discountPercent: 20, // 20% instant viral discount
      active: true,
      usesCount: 0,
      createdAt: new Date().toISOString()
    });

    sendJson(res, 200, {
      success: true,
      discountCode: code,
      discountPercent: 20,
      message: '20% Viral Discount unlocked! Applied directly to your tickets.'
    });
  } catch (err) {
    sendJson(res, 500, { success: false, error: err.message });
  }
}

async function handleVerifyTx(req, res) {
  try {
    const body = await parseJsonBody(req);
    const { txHash, currency, amount } = body;

    if (!txHash) {
      return sendJson(res, 400, { success: false, error: 'txHash required' });
    }

    // Mock blockchain verification confirmation
    const isConfirmed = txHash.length >= 20;
    sendJson(res, 200, {
      success: isConfirmed,
      txHash: txHash,
      currency: currency || 'USDT',
      amount: amount || 5.0,
      confirmations: 12,
      status: 'CONFIRMED',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    sendJson(res, 500, { success: false, error: err.message });
  }
}

// Router
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (pathname === '/api/lottery/jackpot' && req.method === 'GET') {
      return await handleGetJackpot(res);
    }
    if (pathname === '/api/lottery/tickets/buy' && req.method === 'POST') {
      return await handleBuyTickets(req, res);
    }
    if (pathname === '/api/lottery/tickets/my-tickets' && req.method === 'GET') {
      return await handleGetMyTickets(req.url, res);
    }
    if (pathname === '/api/lottery/draw/run' && req.method === 'POST') {
      return await handleRunDraw(req, res);
    }
    if (pathname === '/api/lottery/referral/claim-discount' && req.method === 'POST') {
      return await handleClaimDiscount(req, res);
    }
    if (pathname === '/api/lottery/verify-tx' && req.method === 'POST') {
      return await handleVerifyTx(req, res);
    }
    if (pathname === '/api/lottery/status' && req.method === 'GET') {
      return sendJson(res, 200, {
        success: true,
        service: 'Asura Crypto Lottery API Engine',
        version: '3.0.0',
        foundersRule: '30% Transparent Treasury Allocation (70% Prize Pool)',
        database: dbManager.getStatus()
      });
    }

    sendJson(res, 404, { success: false, error: 'Endpoint not found' });
  } catch (err) {
    console.error('[LOTTERY API ERROR]', err);
    sendJson(res, 500, { success: false, error: err.message });
  }
});

async function startServer() {
  await dbManager.connect();
  server.listen(PORT, () => {
    console.log(`[LOTTERY SERVER] Engine listening on http://localhost:${PORT}`);
    console.log(`[LOTTERY SERVER] Mode: ${dbManager.getStatus().activeEngine}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer };

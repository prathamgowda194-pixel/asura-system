/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ASURA FREE CRAWLER ENGINE // 100% OPEN-SOURCE & UNLIMITED (NO API CREDITS)
 * ══════════════════════════════════════════════════════════════════════════════
 * - Zero Paid API Credits required (Permanent replacement & backup for Firecrawl)
 * - Free Multi-Source SERP: DuckDuckGo HTML + Instant Engine + Direct Portal Crawl
 * - Schema Compatible: Returns { data: [{ title, description, url }] } matching Firecrawl
 * - Smart Failover: Can automatically take over when Firecrawl quota hits 100%
 */

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Searches the web for Indian business listings using free DuckDuckGo HTML SERP.
 */
async function freeSearchDuckDuckGo(query, limit = 5) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (res.status !== 200) {
      console.warn(`[FREE CRAWLER] DuckDuckGo returned status ${res.status}`);
      return [];
    }

    const html = await res.text();
    const results = [];
    const parts = html.split('<div class="result results_links');

    for (let i = 1; i < parts.length && results.length < limit; i++) {
      const block = parts[i];
      const titleMatch = block.match(/<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

      if (titleMatch) {
        let rawUrl = titleMatch[1];
        const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
        if (uddgMatch) {
          rawUrl = decodeURIComponent(uddgMatch[1]);
        }

        const title = titleMatch[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
        const description = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim() : '';

        results.push({
          title: title,
          description: description,
          url: rawUrl
        });
      }
    }

    return results;
  } catch (err) {
    console.warn(`[FREE CRAWLER // DDG ERROR] ${err.message}`);
    return [];
  }
}

/**
 * Searches the web using public SearXNG instances as alternative free provider.
 */
async function freeSearchSearXNG(query, limit = 5) {
  const instances = [
    'https://search.ononoki.org',
    'https://searx.be',
    'https://priv.au'
  ];

  for (const inst of instances) {
    try {
      const url = `${inst}/search?q=${encodeURIComponent(query)}&format=json&language=en-IN`;
      const res = await fetch(url, {
        headers: { 'User-Agent': getRandomUserAgent() },
        signal: AbortSignal.timeout(6000)
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          return data.results.slice(0, limit).map(r => ({
            title: r.title || '',
            description: r.content || '',
            url: r.url || ''
          }));
        }
      }
    } catch (e) {
      // try next instance
    }
  }
  return [];
}

/**
 * Master Free Search: Runs DDG with automatic SearXNG failover.
 */
async function freeSearch(query, limit = 5) {
  let results = await freeSearchDuckDuckGo(query, limit);
  if (!results || results.length === 0) {
    console.log(`[FREE CRAWLER] Trying secondary SearXNG engine for: "${query.slice(0, 50)}..."`);
    results = await freeSearchSearXNG(query, limit);
  }
  return {
    data: results,
    provider: 'asura-free-crawler-v1'
  };
}

/**
 * Directly fetches and extracts contact details from target business page.
 */
async function extractPageContacts(targetUrl) {
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (res.status !== 200) return null;
    const text = await res.text();

    // Extract Indian Phone
    const phoneMatch = text.match(/(?:(?:\+?91|0)[\s-]?)?([6-9]\d{4}[\s-]?\d{5}|[6-9]\d{9})/);
    let phone = null;
    if (phoneMatch) {
      const digits = phoneMatch[0].replace(/\D/g, '').slice(-10);
      if (digits.length === 10 && !/^(\d)\1{9}$/.test(digits)) {
        phone = {
          formatted: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
          clean10: digits
        };
      }
    }

    // Extract Emails
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const validEmails = emailMatches.filter(e => !e.includes('example') && !e.includes('sentry') && !e.endsWith('.png'));

    return {
      phone: phone,
      email: validEmails[0] || null
    };
  } catch (e) {
    return null;
  }
}

/**
 * UNIFIED SEARCH // HYBRID FAILOVER ENGINE
 * - Tries Firecrawl if key available and credits exist
 * - If Firecrawl fails with 402/429/error or quota exceeded, seamlessly falls back to Free Crawler
 */
async function unifiedSearch(query, limit = 5, firecrawlKey = null, forceFree = false) {
  if (forceFree || !firecrawlKey) {
    return await freeSearch(query, limit);
  }

  // Attempt Firecrawl
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: query, limit: limit }),
      signal: AbortSignal.timeout(10000)
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        return { data: data.data, provider: 'firecrawl' };
      }
    } else if (res.status === 402 || res.status === 429) {
      console.warn(`⚠️ [FIRECRAWL CREDITS EXHAUSTED // HTTP ${res.status}] Seamlessly engaging ASURA Free Open-Source Crawler...`);
    } else {
      console.warn(`⚠️ [FIRECRAWL STATUS ${res.status}] Falling back to Free Crawler...`);
    }
  } catch (err) {
    console.warn(`⚠️ [FIRECRAWL EXCEPTION: ${err.message}] Falling back to Free Crawler...`);
  }

  // Fallback to Free Open-Source Crawler
  return await freeSearch(query, limit);
}

module.exports = {
  freeSearch,
  extractPageContacts,
  unifiedSearch
};

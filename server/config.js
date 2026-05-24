require('dotenv').config();

const toInt = (v, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3030').split(',').map(s => s.trim()),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 300),
  aiProviders: {
    openai: process.env.OPENAI_API_KEY || '',
    claude: process.env.CLAUDE_API_KEY || '',
    gemini: process.env.GEMINI_API_KEY || '',
    kimi: process.env.KIMI_API_KEY || ''
  }
};

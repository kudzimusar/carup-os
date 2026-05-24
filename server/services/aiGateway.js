const config = require('../config');

async function queryModel({ provider, model, prompt, temperature = 0.2 }) {
  const hasKey = Boolean(config.aiProviders[provider]);
  if (!hasKey) {
    return {
      provider,
      model,
      configured: false,
      output: `Provider ${provider} is not configured yet. Add ${provider.toUpperCase()}_API_KEY to .env.`
    };
  }

  return {
    provider,
    model,
    configured: true,
    output: `[Stub] ${provider}/${model} accepted prompt length ${prompt.length} at temperature ${temperature}. Replace this stub with provider SDK call.`
  };
}

module.exports = { queryModel };

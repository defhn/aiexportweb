type PolicyInput = {
  allowGoogle: boolean;
  allowBing: boolean;
  allowOaiSearchBot: boolean;
  allowClaudeSearchBot: boolean;
  allowPerplexityBot: boolean;
  allowGptBot: boolean;
  allowClaudeBot: boolean;
};

function robotLine(userAgent: string, allowed: boolean) {
  return `User-agent: ${userAgent}\n${allowed ? "Allow: /" : "Disallow: /"}`;
}

export function buildRobotsPolicies(input: PolicyInput) {
  return [
    robotLine("Googlebot", input.allowGoogle),
    robotLine("Bingbot", input.allowBing),
    robotLine("OAI-SearchBot", input.allowOaiSearchBot),
    robotLine("Claude-SearchBot", input.allowClaudeSearchBot),
    robotLine("PerplexityBot", input.allowPerplexityBot),
    robotLine("GPTBot", input.allowGptBot),
    robotLine("ClaudeBot", input.allowClaudeBot),
  ].join("\n\n");
}

export function getDefaultCrawlerPolicy() {
  return {
    allowGoogle: true,
    allowBing: true,
    allowOaiSearchBot: true,
    allowClaudeSearchBot: true,
    allowPerplexityBot: true,
    allowGptBot: false,
    allowClaudeBot: false,
  } satisfies PolicyInput;
}

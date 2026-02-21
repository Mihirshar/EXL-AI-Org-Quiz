export type ScoreKey = 'IV' | 'OR' | 'HR' | 'TV';

export interface Scores {
  IV: number;
  OR: number;
  HR: number;
  TV: number;
}

export interface ScoreChange {
  IV: number;
  OR: number;
  HR: number;
  TV: number;
}

export interface Insight {
  first: string;
  second: string;
}

export interface Infographic {
  title: string;
  stat: string;
  description: string;
  source: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChoiceInfographic {
  headline: string;
  subheadline: string;
  keyStats: Array<{
    value: string;
    label: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  insight: string;
  leadershipQuality: string;
  qualityIcon: string;
  theme: 'tech' | 'people' | 'risk' | 'growth' | 'balance';
}

export interface Level {
  id: number;
  title: string;
  month: string;
  scenario: string;
  choices: {
    A: string;
    B: string;
  };
  scoring: {
    A: ScoreChange;
    B: ScoreChange;
  };
  insights: {
    A: Insight;
    B: Insight;
  };
  infographics: {
    A: Infographic[];
    B: Infographic[];
  };
}

export const SCORE_METRICS: { key: ScoreKey; name: string; description: string; target: string; isLimit?: boolean }[] = [
  { key: 'TV', name: 'Turnaround Value', description: 'Enterprise value generation', target: '> +35' },
  { key: 'OR', name: 'Operational Risk', description: 'Risk exposure level', target: '< +40', isLimit: true },
  { key: 'IV', name: 'Innovation Velocity', description: 'Speed of AI adoption', target: '> 0' },
  { key: 'HR', name: 'Human Readiness', description: 'Workforce AI capability', target: '> 0' },
];

export const INITIAL_SCORES: Scores = {
  IV: 0,
  OR: 0,
  HR: 0,
  TV: 0,
};

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The Readiness Dilemma',
    month: 'Month 1',
    scenario: `Gartner data reveals that most AI initiatives fail because organizations treat AI as a plug-and-play technology rather than a cultural shift. You have a $10M budget to kickstart your 12-month turnaround. How do you allocate it?`,
    choices: {
      A: 'Invest 90% of the budget in enterprise AI licenses to maximize immediate technological capabilities, leaving 10% for basic software training.',
      B: 'Split the budget 50/50—funding AI tools alongside a massive "AI Literacy and Context Engineering" upskilling program.',
    },
    scoring: {
      A: { IV: 20, OR: 15, HR: -20, TV: -5 },
      B: { IV: 5, OR: -5, HR: 20, TV: 10 },
    },
    insights: {
      A: {
        first: 'You roll out shiny new tools globally in week one. Execution speed is incredible.',
        second: 'The tools become expensive "shelfware." Employees lack the skills to prompt effectively, triggering deep cultural resistance and stalling your turnaround value completely.',
      },
      B: {
        first: 'The rollout feels frustratingly slow. The board questions the heavy training expenditure in Q1.',
        second: 'By month four, highly literate "fusion teams" autonomously identify high-margin use cases. The foundation for rapid, compounding growth is locked in.',
      },
    },
    infographics: {
      A: [
        { title: 'AI Tool Adoption', stat: '87%', description: 'of AI tools become shelfware within 12 months', source: 'Gartner 2024', icon: '📉', trend: 'down' },
        { title: 'Tech-First Failures', stat: '70%', description: 'of AI initiatives fail due to lack of change management', source: 'McKinsey', icon: '⚠️', trend: 'down' },
        { title: 'Adoption Timeline', stat: '6-18mo', description: 'typical time for enterprise AI to show ROI without training', source: 'Deloitte', icon: '⏰', trend: 'neutral' },
      ],
      B: [
        { title: 'Upskilled Teams ROI', stat: '3.5x', description: 'higher AI adoption rate with proper training', source: 'BCG 2024', icon: '📈', trend: 'up' },
        { title: 'Fusion Team Impact', stat: '40%', description: 'faster time-to-value with cross-functional AI teams', source: 'Gartner', icon: '🚀', trend: 'up' },
        { title: 'Change Success', stat: '2.6x', description: 'more likely to succeed with human-centered approach', source: 'MIT Sloan', icon: '✅', trend: 'up' },
      ],
    },
  },
  {
    id: 2,
    title: 'The Domain Crucible',
    month: 'Month 4',
    scenario: `Operations wants to deploy Generative AI to handle complex, highly regulated client data (e.g., claims processing, underwriting). Generic models hallucinate; Everest Group emphasizes the need for Domain-Specific Language Models (DSLMs).`,
    choices: {
      A: 'Deploy a generic, off-the-shelf LLM wrapper for a fast, cheap rollout to hit immediate quarterly targets.',
      B: 'Delay 60 days to fine-tune a Domain-Specific Language Model (DSLM) trained on proprietary enterprise data with robust RAG architecture.',
    },
    scoring: {
      A: { IV: 25, OR: 30, HR: -10, TV: 0 },
      B: { IV: -5, OR: -10, HR: 10, TV: 15 },
    },
    insights: {
      A: {
        first: 'Marketing announces a quick AI win. Analysts are impressed. Your stock ticks up on "AI-first" PR.',
        second: 'Claims errors surface; regulatory fines hit. Customer trust erodes. The short-term PR win becomes a long-term liability.',
      },
      B: {
        first: 'You face internal grumbling about delays. Competitors mock your "slow" AI strategy.',
        second: 'Your DSLM achieves 98% accuracy in regulated workflows. Clients consolidate more business with you, generating sticky, high-margin revenue.',
      },
    },
    infographics: {
      A: [
        { title: 'LLM Hallucination Rate', stat: '15-27%', description: 'error rate in generic LLMs for domain-specific tasks', source: 'Stanford HAI', icon: '🎭', trend: 'down' },
        { title: 'Regulatory Risk', stat: '$4.2M', description: 'average cost of AI-related compliance failures', source: 'PwC 2024', icon: '⚖️', trend: 'down' },
        { title: 'Customer Trust Impact', stat: '-34%', description: 'drop in NPS after AI errors in sensitive data', source: 'Forrester', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'DSLM Accuracy', stat: '98%+', description: 'accuracy in regulated workflows with fine-tuned models', source: 'Everest Group', icon: '🎯', trend: 'up' },
        { title: 'RAG Effectiveness', stat: '85%', description: 'reduction in hallucinations with proper RAG setup', source: 'Gartner', icon: '🔒', trend: 'up' },
        { title: 'Client Retention', stat: '+23%', description: 'increase in contract renewals with reliable AI', source: 'Bain & Co', icon: '🤝', trend: 'up' },
      ],
    },
  },
  {
    id: 3,
    title: 'The Agentic Shift',
    month: 'Month 7',
    scenario: `You've built capable AI tools, but productivity gains are capped at 10-15%. Gartner's research indicates that true step-change value comes from autonomous AI agents capable of multi-step reasoning without human intervention.`,
    choices: {
      A: 'Continue scaling human-supervised Copilots, keeping humans firmly in the loop for every task.',
      B: 'Deploy an autonomous Multiagent System to negotiate and resolve tier-1 and tier-2 B2B disputes completely without human intervention.',
    },
    scoring: {
      A: { IV: -5, OR: -5, HR: 5, TV: 5 },
      B: { IV: 30, OR: 20, HR: -5, TV: 20 },
    },
    insights: {
      A: {
        first: 'Operations feel incredibly safe. Output quality is highly consistent.',
        second: 'You hit a hard ceiling. Copilots yield only incremental 5–10% productivity gains. You mathematically fail to generate the 40% turnaround required.',
      },
      B: {
        first: 'Agents instantly clear massive backlogs. Volume processing scales exponentially without adding headcount. Staff feels uneasy about being replaced.',
        second: 'You shift from tracking "productivity" to hard P&L impact. This is the operational leverage required to hit your aggressive financial goals.',
      },
    },
    infographics: {
      A: [
        { title: 'Copilot Productivity Cap', stat: '10-15%', description: 'maximum productivity gains from human-in-the-loop AI', source: 'Gartner 2024', icon: '📊', trend: 'neutral' },
        { title: 'Scaling Limitation', stat: 'Linear', description: 'growth pattern - headcount still drives capacity', source: 'McKinsey', icon: '📏', trend: 'neutral' },
        { title: 'Innovation Ceiling', stat: '5x', description: 'slower innovation vs autonomous systems', source: 'MIT Tech Review', icon: '🚧', trend: 'down' },
      ],
      B: [
        { title: 'Agentic AI Impact', stat: '10x', description: 'productivity multiplier with autonomous agents', source: 'Gartner', icon: '🚀', trend: 'up' },
        { title: 'Cost Reduction', stat: '60%', description: 'operational cost savings from agent automation', source: 'Deloitte', icon: '💰', trend: 'up' },
        { title: 'Processing Speed', stat: '24/7', description: 'continuous operation without human bottlenecks', source: 'Accenture', icon: '⚡', trend: 'up' },
      ],
    },
  },
  {
    id: 4,
    title: 'The Trust & Governance Shield',
    month: 'Month 10',
    scenario: `With autonomous agents running loose, Gartner warns of "death by AI" litigation. A close competitor just suffered a massive data leak due to a prompt injection attack. The board is nervous.`,
    choices: {
      A: 'Hit the brakes. Mandate that all AI usage be paused until a multi-year, foolproof governance framework is established.',
      B: 'Invest aggressively in an AI Security Platform with real-time guardrails to dynamically monitor and quarantine rogue agent actions.',
    },
    scoring: {
      A: { IV: -40, OR: -20, HR: -15, TV: -20 },
      B: { IV: 10, OR: -25, HR: 15, TV: 10 },
    },
    insights: {
      A: {
        first: 'Zero compliance breaches. The board enjoys total peace of mind regarding data leaks.',
        second: 'Complete stagnation. Competitors capture your market share. Your top talent leaves out of frustration, effectively killing the turnaround story.',
      },
      B: {
        first: 'Security acts as a continuous monitor rather than a stop sign. Rogue actions are caught in milliseconds.',
        second: 'Employees feel safe innovating because the guardrails protect them. You sustain the high-speed deployment pace without triggering a regulatory disaster.',
      },
    },
    infographics: {
      A: [
        { title: 'Innovation Freeze Cost', stat: '$50M+', description: 'average annual opportunity cost from AI pauses', source: 'BCG', icon: '❄️', trend: 'down' },
        { title: 'Talent Attrition', stat: '45%', description: 'increase in tech talent leaving during AI freezes', source: 'LinkedIn', icon: '🚪', trend: 'down' },
        { title: 'Market Share Loss', stat: '12-18%', description: 'typical loss to AI-forward competitors', source: 'Gartner', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'Real-time Detection', stat: '<50ms', description: 'threat response time with modern AI guardrails', source: 'NIST', icon: '🛡️', trend: 'up' },
        { title: 'Innovation + Security', stat: '94%', description: 'of secure-by-design AI projects succeed', source: 'Forrester', icon: '✅', trend: 'up' },
        { title: 'Employee Confidence', stat: '+67%', description: 'increase in AI adoption with visible guardrails', source: 'PwC', icon: '🔐', trend: 'up' },
      ],
    },
  },
  {
    id: 5,
    title: 'The Operating Model',
    month: 'Month 12',
    scenario: `You have successfully scaled AI across the enterprise and hit your initial efficiency targets. What is your ultimate strategic maneuver for the final operating model?`,
    choices: {
      A: 'The Automation Trap—Use the AI solely to automate legacy business processes, cut headcount, and immediately return cash to the bottom line.',
      B: 'The Value Creator—Fundamentally redesign the business model around human-AI orchestration to launch entirely new, high-margin analytics services.',
    },
    scoring: {
      A: { IV: 10, OR: 10, HR: -30, TV: 5 },
      B: { IV: 15, OR: 5, HR: 25, TV: 25 },
    },
    insights: {
      A: {
        first: 'Immediate cost savings appear on the P&L. Margins look incredibly healthy for the quarter.',
        second: 'You hollow out the company\'s institutional knowledge. Culture collapses, and the short-term cash grab fails to sustain long-term enterprise value.',
      },
      B: {
        first: 'Operations are fundamentally rewired, requiring intense executive focus to manage the friction of change.',
        second: 'The workforce is energized by doing higher-value work. You unlock net-new revenue streams, effortlessly blowing past the 40% turnaround target.',
      },
    },
    infographics: {
      A: [
        { title: 'Short-term Gains', stat: '+15%', description: 'immediate margin improvement from cost cuts', source: 'Deloitte', icon: '💵', trend: 'neutral' },
        { title: 'Knowledge Drain', stat: '73%', description: 'of institutional knowledge lost in aggressive layoffs', source: 'HBR', icon: '🧠', trend: 'down' },
        { title: 'Long-term Value', stat: '-40%', description: 'typical enterprise value decline within 3 years', source: 'McKinsey', icon: '📉', trend: 'down' },
      ],
      B: [
        { title: 'New Revenue Streams', stat: '35%', description: 'of revenue from AI-enabled services by year 3', source: 'BCG', icon: '💎', trend: 'up' },
        { title: 'Workforce Engagement', stat: '+52%', description: 'increase in employee satisfaction with value-add work', source: 'Gallup', icon: '🌟', trend: 'up' },
        { title: 'Enterprise Value', stat: '+80%', description: 'average valuation increase for AI-native models', source: 'Goldman Sachs', icon: '🚀', trend: 'up' },
      ],
    },
  },
];

export const TOTAL_LEVELS = LEVELS.length;

export function calculateScores(choices: ('A' | 'B')[]): Scores {
  const scores = { ...INITIAL_SCORES };
  
  choices.forEach((choice, index) => {
    const level = LEVELS[index];
    if (level) {
      const scoreChange = level.scoring[choice];
      scores.IV += scoreChange.IV;
      scores.OR += scoreChange.OR;
      scores.HR += scoreChange.HR;
      scores.TV += scoreChange.TV;
    }
  });
  
  return scores;
}

export function isScorePassing(key: ScoreKey, value: number): boolean {
  switch (key) {
    case 'TV':
      return value >= 35;
    case 'OR':
      return value < 40;
    case 'IV':
    case 'HR':
      return value > 0;
    default:
      return false;
  }
}

export function isNearTarget(key: ScoreKey, value: number): boolean {
  switch (key) {
    case 'TV':
      return value >= 25 && value < 35;
    case 'OR':
      return value >= 40 && value <= 50;
    case 'IV':
    case 'HR':
      return value >= -5 && value <= 0;
    default:
      return false;
  }
}

export type ScoreStatus = 'met' | 'target' | 'missed';

export function getScoreStatus(key: ScoreKey, value: number): ScoreStatus {
  if (isScorePassing(key, value)) return 'met';
  if (isNearTarget(key, value)) return 'target';
  return 'missed';
}

export function getScoreTarget(key: ScoreKey): number {
  switch (key) {
    case 'TV':
      return 35;
    case 'OR':
      return 40;
    case 'IV':
    case 'HR':
      return 0;
    default:
      return 0;
  }
}

export const SCORE_RANGES: Record<ScoreKey, { min: number; max: number }> = {
  TV: { min: -20, max: 80 },
  OR: { min: -70, max: 70 },
  IV: { min: -20, max: 80 },
  HR: { min: -70, max: 80 },
};

export function getScoreRange(key: ScoreKey): { min: number; max: number } {
  return SCORE_RANGES[key];
}

export const MONTH_MARKERS = [1, 4, 7, 10, 12] as const;

export const CHOICE_INFOGRAPHICS: Record<number, { A: ChoiceInfographic; B: ChoiceInfographic }> = {
  1: {
    A: {
      headline: 'Technology-First Approach',
      subheadline: 'Rapid AI deployment prioritizing speed over readiness',
      keyStats: [
        { value: '90%', label: 'Budget → Tech', trend: 'neutral' },
        { value: '87%', label: 'Shelfware Risk', trend: 'down' },
        { value: '70%', label: 'Failure Rate', trend: 'down' },
      ],
      insight: 'Fast deployment creates immediate capability gaps. Without training, tools become expensive shelf decorations.',
      leadershipQuality: 'Decisive Executor',
      qualityIcon: '⚡',
      theme: 'tech',
    },
    B: {
      headline: 'People-First Transformation',
      subheadline: 'Balanced investment in tools and human capability',
      keyStats: [
        { value: '50/50', label: 'Tools + Training', trend: 'up' },
        { value: '3.5x', label: 'Adoption Rate', trend: 'up' },
        { value: '40%', label: 'Faster Value', trend: 'up' },
      ],
      insight: 'Investing in AI literacy creates "fusion teams" who autonomously identify high-value use cases.',
      leadershipQuality: 'Strategic Builder',
      qualityIcon: '🏗️',
      theme: 'people',
    },
  },
  2: {
    A: {
      headline: 'Speed to Market',
      subheadline: 'Generic LLM for quick quarterly wins',
      keyStats: [
        { value: '15-27%', label: 'Error Rate', trend: 'down' },
        { value: '$4.2M', label: 'Compliance Risk', trend: 'down' },
        { value: '-34%', label: 'Trust Impact', trend: 'down' },
      ],
      insight: 'Generic models hallucinate in regulated domains. Short-term PR wins become long-term liabilities.',
      leadershipQuality: 'Risk Taker',
      qualityIcon: '🎲',
      theme: 'risk',
    },
    B: {
      headline: 'Domain Excellence',
      subheadline: 'Fine-tuned DSLM with RAG architecture',
      keyStats: [
        { value: '98%+', label: 'Accuracy', trend: 'up' },
        { value: '85%', label: 'Less Errors', trend: 'up' },
        { value: '+23%', label: 'Retention', trend: 'up' },
      ],
      insight: 'Domain-specific models achieve precision in regulated workflows, generating sticky, high-margin revenue.',
      leadershipQuality: 'Quality Champion',
      qualityIcon: '🎯',
      theme: 'balance',
    },
  },
  3: {
    A: {
      headline: 'Human-in-the-Loop',
      subheadline: 'Supervised copilots with consistent output',
      keyStats: [
        { value: '10-15%', label: 'Max Gains', trend: 'neutral' },
        { value: 'Linear', label: 'Scale Pattern', trend: 'neutral' },
        { value: '5x', label: 'Slower Growth', trend: 'down' },
      ],
      insight: 'Copilots yield incremental gains but hit a hard ceiling. You may mathematically fail the 40% turnaround target.',
      leadershipQuality: 'Steady Operator',
      qualityIcon: '🛡️',
      theme: 'risk',
    },
    B: {
      headline: 'Autonomous Agents',
      subheadline: 'Multi-agent systems for exponential scale',
      keyStats: [
        { value: '10x', label: 'Productivity', trend: 'up' },
        { value: '60%', label: 'Cost Savings', trend: 'up' },
        { value: '24/7', label: 'Operations', trend: 'up' },
      ],
      insight: 'Autonomous agents clear backlogs exponentially. This is the operational leverage required for aggressive goals.',
      leadershipQuality: 'Innovation Driver',
      qualityIcon: '🚀',
      theme: 'growth',
    },
  },
  4: {
    A: {
      headline: 'Full Stop Approach',
      subheadline: 'Pause all AI until governance is perfect',
      keyStats: [
        { value: '$50M+', label: 'Opportunity Cost', trend: 'down' },
        { value: '45%', label: 'Talent Attrition', trend: 'down' },
        { value: '12-18%', label: 'Market Loss', trend: 'down' },
      ],
      insight: 'Complete stagnation while competitors capture market share. Top talent leaves out of frustration.',
      leadershipQuality: 'Risk Averse',
      qualityIcon: '🛑',
      theme: 'risk',
    },
    B: {
      headline: 'Dynamic Guardrails',
      subheadline: 'Real-time AI security with continuous innovation',
      keyStats: [
        { value: '<50ms', label: 'Threat Response', trend: 'up' },
        { value: '94%', label: 'Success Rate', trend: 'up' },
        { value: '+67%', label: 'Adoption', trend: 'up' },
      ],
      insight: 'Security acts as a continuous monitor, not a stop sign. Employees feel safe innovating with guardrails.',
      leadershipQuality: 'Balanced Innovator',
      qualityIcon: '⚖️',
      theme: 'balance',
    },
  },
  5: {
    A: {
      headline: 'Automation Trap',
      subheadline: 'Cut costs, reduce headcount, return cash',
      keyStats: [
        { value: '+15%', label: 'Short Margins', trend: 'neutral' },
        { value: '73%', label: 'Knowledge Lost', trend: 'down' },
        { value: '-40%', label: 'Long-term Value', trend: 'down' },
      ],
      insight: 'Immediate cost savings hollow out institutional knowledge. Culture collapses; short-term cash grab fails.',
      leadershipQuality: 'Cost Cutter',
      qualityIcon: '✂️',
      theme: 'risk',
    },
    B: {
      headline: 'Value Creator',
      subheadline: 'Human-AI orchestration for new revenue',
      keyStats: [
        { value: '35%', label: 'New Revenue', trend: 'up' },
        { value: '+52%', label: 'Engagement', trend: 'up' },
        { value: '+80%', label: 'Valuation', trend: 'up' },
      ],
      insight: 'The workforce is energized by higher-value work. You unlock net-new revenue streams beyond the target.',
      leadershipQuality: 'Visionary Leader',
      qualityIcon: '👑',
      theme: 'growth',
    },
  },
};

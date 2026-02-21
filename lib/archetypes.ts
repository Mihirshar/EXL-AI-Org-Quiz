import { Scores } from './gameData';

export interface Archetype {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  colorClass: string;
  diagnosis: string;
  impact: string;
  reality: string;
  infographicImage?: string;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'balanced-catalyst',
    name: 'The Balanced Catalyst',
    subtitle: 'The Golden Path',
    icon: '⚡',
    color: '#16A34A',
    colorClass: 'text-green-500',
    diagnosis: 'You successfully architected a highly sustainable 12-month transformation. You recognize that AI is not just a technology play, but a fundamental shift in human operations.',
    impact: 'You demonstrated the patience to absorb the initial friction of change. By prioritizing robust Domain-Specific Models and workforce upskilling over off-the-shelf quick fixes, you built a resilient foundation.',
    reality: 'Because your people trust the systems and understand how to orchestrate them, they have elevated their roles. You didn\'t just optimize existing processes; you empowered your teams to unlock entirely new, high-margin revenue streams.',
    infographicImage: '/archetypes/balanced-catalyst.png',
  },
  {
    id: 'technology-accelerator',
    name: 'The Technology Accelerator',
    subtitle: 'The Velocity Focus',
    icon: '🚀',
    color: '#D97706',
    colorClass: 'text-amber-500',
    diagnosis: 'You have a formidable bias for action. Your strategy heavily prioritizes rapid technological deployment and speed-to-market to capture early competitive advantages.',
    impact: 'You achieved exceptional execution velocity in the first half of the year, securing early productivity gains and demonstrating decisive leadership in tech acquisition.',
    reality: 'The critical next step is bridging the gap between technological capability and workforce readiness. Rapid scaling without an equal investment in human context engineering can lead to underutilized assets and operational friction.',
    infographicImage: '/archetypes/technology-accelerator.png',
  },
  {
    id: 'governance-champion',
    name: 'The Governance Champion',
    subtitle: 'The Risk-Mitigation Focus',
    icon: '🛡️',
    color: '#2563EB',
    colorClass: 'text-blue-500',
    diagnosis: 'You prioritize enterprise security, brand protection, and flawless compliance above all else. You build incredibly stable operational environments.',
    impact: 'Your governance framework is exceptionally secure. You successfully shielded the organization from data vulnerabilities, prompt injection risks, and regulatory missteps during a highly volatile technological shift.',
    reality: 'Over-indexing on risk prevention can inadvertently throttle innovation velocity. To achieve 30–40% value generation, the organization must transition from treating AI solely as a risk to manage, to a growth engine to unleash.',
    infographicImage: '/archetypes/governance-champion.png',
  },
  {
    id: 'efficiency-optimizer',
    name: 'The Efficiency Optimizer',
    subtitle: 'The Bottom-Line Focus',
    icon: '📉',
    color: '#9333EA',
    colorClass: 'text-purple-500',
    diagnosis: 'You are highly effective at identifying cost-saving opportunities and rapidly streamlining legacy operations to drive immediate financial impact.',
    impact: 'Your strategy delivered strong, immediate margin expansion. By automating manual processes and creating a leaner operational structure, you quickly returned cash to the bottom line.',
    reality: 'While highly effective for short-term financial engineering, pure efficiency plays can create long-term cultural fatigue. To sustain this financial trajectory, savings must be aggressively reinvested into upskilling the remaining workforce to build net-new services.',
    infographicImage: '/archetypes/efficiency-optimizer.png',
  },
];

export function determineArchetype(scores: Scores): Archetype {
  const { TV, OR, IV, HR } = scores;

  // Check conditions in order (first match wins)
  
  // 1. Balanced Catalyst: TV > 35 AND OR < 40 AND HR > 0
  if (TV > 35 && OR < 40 && HR > 0) {
    return ARCHETYPES.find(a => a.id === 'balanced-catalyst')!;
  }

  // 2. Technology Accelerator: IV > 40 AND (OR >= 40 OR HR <= 0)
  if (IV > 40 && (OR >= 40 || HR <= 0)) {
    return ARCHETYPES.find(a => a.id === 'technology-accelerator')!;
  }

  // 3. Governance Champion: OR < 40 AND TV <= 35
  if (OR < 40 && TV <= 35) {
    return ARCHETYPES.find(a => a.id === 'governance-champion')!;
  }

  // 4. Efficiency Optimizer: TV >= 35 AND HR < -10
  if (TV >= 35 && HR < -10) {
    return ARCHETYPES.find(a => a.id === 'efficiency-optimizer')!;
  }

  // Fallback: Governance Champion
  return ARCHETYPES.find(a => a.id === 'governance-champion')!;
}

export function isWinningOutcome(scores: Scores): boolean {
  return scores.TV > 35 && scores.OR < 40 && scores.HR > 0;
}

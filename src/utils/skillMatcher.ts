/**
 * Utility for normalizing and matching technical skills between candidate user profiles and job positions.
 */

// Equivalence groups for technical skills commonly used across Asian tech companies
const SKILL_ALIASES: Record<string, string[]> = {
  react: ['react', 'reactjs', 'react.js', 'react native'],
  go: ['go', 'golang'],
  python: ['python', 'py', 'pytorch', 'django', 'fastapi'],
  typescript: ['typescript', 'ts'],
  javascript: ['javascript', 'js', 'node', 'nodejs'],
  'c++': ['c++', 'cpp'],
  java: ['java', 'spring', 'springboot'],
  postgresql: ['postgresql', 'postgres', 'sql', 'relational db', 'distributed sql'],
  'distributed systems': ['distributed systems', 'distributed data', 'high throughput', 'microservices'],
  pytorch: ['pytorch', 'ai', 'vector search', 'machine learning', 'deep learning'],
  rust: ['rust'],
  kubernetes: ['kubernetes', 'k8s', 'docker'],
  graphql: ['graphql'],
  'next.js': ['next.js', 'nextjs'],
};

/**
 * Normalizes a skill or tag string to its canonical lower-case token.
 */
export function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

/**
 * Checks if a specific job tag matches a target skill (direct match or alias match).
 */
export function doesTagMatchSkill(tag: string, targetSkill: string): boolean {
  const normTag = normalizeSkill(tag);
  const normTarget = normalizeSkill(targetSkill);

  if (normTag === normTarget) return true;

  // Check alias dictionary
  for (const [, aliases] of Object.entries(SKILL_ALIASES)) {
    const isTagInAliases = aliases.some(a => normTag.includes(a) || a.includes(normTag));
    const isTargetInAliases = aliases.some(a => normTarget.includes(a) || a.includes(normTarget));
    if (isTagInAliases && isTargetInAliases) {
      return true;
    }
  }

  // Substring match for compound tags (e.g., "Frontend Systems" matching "Frontend", or "Vector Search" matching "Search")
  if (normTag.includes(normTarget) || normTarget.includes(normTag)) {
    return true;
  }

  return false;
}

/**
 * Determines which tags in a job match a candidate's profile skills.
 */
export function getJobMatchingSkills(
  jobTags: string[],
  userSkills: string[]
): {
  matchingTags: string[];
  matchedUserSkills: string[];
  matchCount: number;
} {
  const matchingTags: string[] = [];
  const matchedUserSkills = new Set<string>();

  for (const tag of jobTags) {
    for (const skill of userSkills) {
      if (doesTagMatchSkill(tag, skill)) {
        matchingTags.push(tag);
        matchedUserSkills.add(skill);
        break;
      }
    }
  }

  return {
    matchingTags,
    matchedUserSkills: Array.from(matchedUserSkills),
    matchCount: matchedUserSkills.size,
  };
}

/**
 * Popular skills available in the Asian tech referral market
 */
export const POPULAR_TECH_SKILLS: string[] = [
  'React',
  'Go',
  'Python',
  'TypeScript',
  'C++',
  'Java',
  'Distributed Systems',
  'PyTorch',
  'PostgreSQL',
  'GraphQL',
  'Next.js',
  'Rust',
  'Kubernetes',
  'Kafka',
];

import { RENTAL_LAWS } from './laws/rental.js';

import { EMPLOYMENT_LAWS } from './laws/employment.js';

import { GIG_LAWS } from './laws/gig.js';

import { LOAN_LAWS } from './laws/loans.js';

import { GENERAL_LAWS } from './laws/general.js';

import { RENTAL_BENCHMARKS } from './benchmarks/rentalClauses.js';

import { EMPLOYMENT_BENCHMARKS } from './benchmarks/employmentClauses.js';

import { GIG_BENCHMARKS } from './benchmarks/gigClauses.js';

// ─── Master corpus ───────────────────────────────────────────────────────────

export const ALL_LAWS = [

    ...RENTAL_LAWS,

    ...EMPLOYMENT_LAWS,

    ...GIG_LAWS,

    ...LOAN_LAWS,

    ...GENERAL_LAWS,

];

export const BENCHMARKS = {

    rental: RENTAL_BENCHMARKS,

    employment: EMPLOYMENT_BENCHMARKS,

    gig: GIG_BENCHMARKS,

    freelance: GIG_BENCHMARKS,

    loan: {},

    tos: {},

    nda: {},

    other: {},

};

// ─── Keyword-based retrieval (fast, no embeddings needed) ────────────────────

export function retrieveRelevantLaws(contractText, contractType, topK = 8) {

    const text = (contractText || '').toLowerCase().slice(0, 8000);

    const type = (contractType || '').toLowerCase();

    const scored = ALL_LAWS.map(law => {

        let score = 0;

        // Contract type match

        if (law.tags.some(t => type.includes(t))) score += 4;

        // Keyword match against contract text

        law.tags.forEach(tag => {

            if (text.includes(tag.toLowerCase())) score += 2;

        });

        // Risk signal match

        const signals = (law.riskSignal || '').toLowerCase().split(' OR ');

        signals.forEach(sig => {

            if (text.includes(sig.trim())) score += 3;

        });

        // Jurisdiction boost for India-specific laws

        if (law.jurisdiction.toLowerCase().includes('india')) score += 1;

        return { ...law, score };

    });

    return scored

        .filter(l => l.score > 0)

        .sort((a, b) => b.score - a.score)

        .slice(0, topK);

}

export function getBenchmarksForType(contractType) {

    return BENCHMARKS[contractType?.toLowerCase()] || {};

}

export function formatLawsForContext(laws) {

    if (!laws.length) return 'No specific Indian statutes retrieved for this contract.';

    return laws.map(law => `

STATUTE: ${law.statute}

JURISDICTION: ${law.jurisdiction}

TOPIC: ${law.topic}

SUMMARY: ${law.summary}

LEGAL TEXT: ${law.fullText}

PROTECTS AGAINST: ${law.redFlag}

USER'S RIGHT: ${law.favorableForUser}

SOURCE: ${law.source}

  `.trim()).join('\n\n---\n\n');

}

export function formatBenchmarksForContext(benchmarks) {

    if (!benchmarks || !Object.keys(benchmarks).length)

        return 'No benchmark data available for this contract type.';

    return Object.values(benchmarks).map(b => `

CLAUSE TYPE: ${b.topic}

MARKET STANDARD IN INDIA: ${b.marketStandard}

${b.legalPosition ? `LEGAL POSITION: ${b.legalPosition}` : ''}

PERCENTILE DATA: ${JSON.stringify(b.percentileData, null, 2)}

  `.trim()).join('\n\n---\n\n');

}

import {
  retrieveRelevantLaws,
  getBenchmarksForType,
  formatLawsForContext,
  formatBenchmarksForContext,
} from '../legalData/index.js';

const API_ENDPOINT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/claude`
  : '/api/claude';

async function callAnalyzeAPI(systemPrompt, userMessage, maxTokens = 4000) {
  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `API error ${res.status}`);
  }

  const data = await res.json();
  const raw = data.content?.map(b => b.text || '').join('') || '';
  return raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
}

// ─── 1. DETECT CONTRACT TYPE ─────────────────────────────────────────────────

export async function detectContractType(text) {
  const result = await callAnalyzeAPI(
    'You are a legal document classifier for Indian contracts. Respond ONLY with valid JSON, no markdown.',
    `Classify this Indian contract. Return JSON:

{"type":"rental|employment|gig|loan|tos|nda|freelance|other","confidence":0.95,"description":"one sentence","detectedLanguage":"Hindi|English|Hinglish|Marathi|Tamil|Telugu|Kannada|other"}

Contract excerpt (first 1500 chars):

${text.slice(0, 1500)}`
  );

  try {
    const parsed = JSON.parse(result);

    // Keyword fallback — if AI says "other" but text has strong contract signals, override
    if (parsed.type === 'other') {
      const t = text.toLowerCase();
      if (t.includes('salary') || t.includes('designation') || t.includes('employment') || t.includes('probation') || t.includes('notice period'))
        return { ...parsed, type: 'employment' };
      if (t.includes('rent') || t.includes('tenant') || t.includes('landlord') || t.includes('premises') || t.includes('deposit'))
        return { ...parsed, type: 'rental' };
      if (t.includes('loan') || t.includes('borrower') || t.includes('repayment') || t.includes('emi') || t.includes('interest rate'))
        return { ...parsed, type: 'loan' };
      if (t.includes('gig') || t.includes('delivery') || t.includes('per order') || t.includes('platform fee'))
        return { ...parsed, type: 'gig' };
    }

    return parsed;
  } catch {
    return { type: 'other', confidence: 0.5, description: 'General Indian contract', detectedLanguage: 'English' };
  }
}

// ─── 2. FULL RISK ANALYSIS (RAG-grounded) ────────────────────────────────────

export async function analyzeRisks(text, contractType) {
  const laws = retrieveRelevantLaws(text, contractType, 8);
  const benchmarks = getBenchmarksForType(contractType);
  const lawsCtx = formatLawsForContext(laws);
  const benchCtx = formatBenchmarksForContext(benchmarks);

  const contractExcerpt = text.length > 8000
    ? text.slice(0, 8000) + '\n\n[Note: Contract truncated at 8000 characters for analysis. Full document may contain additional clauses.]'
    : text;

  const result = await callAnalyzeAPI(
    `You are an expert Indian consumer-rights and labour law analyst.
You protect individuals — tenants, workers, gig workers, borrowers — from predatory contract clauses.
You have access to REAL Indian laws and market benchmarks below.
ALWAYS cite specific Indian statutes, acts, and sections when flagging risks.
Respond ONLY with valid JSON — no markdown, no preamble.

═══════════════════════════════════════════
INDIAN LAWS & STATUTES (ground your analysis in these):
═══════════════════════════════════════════
${lawsCtx}

═══════════════════════════════════════════
INDIA MARKET BENCHMARK DATA:
═══════════════════════════════════════════
${benchCtx}
═══════════════════════════════════════════`,

    `Analyze this Indian ${contractType} contract. Cross-reference every flagged clause against the provided Indian statutes.

Return this exact JSON structure:

{
  "clauses": [
    {
      "id": "c1",
      "originalText": "exact quote from contract (max 250 chars)",
      "section": "section heading in contract",
      "riskLevel": "critical|high|medium|low",
      "riskCategory": "arbitration|fees|termination|data|ip|liability|deposit|wage|harassment|privacy|other",
      "plainEnglish": "what this means in simple words a first-time renter or gig worker would understand",
      "whyDangerous": "specific harm this clause could cause with Indian legal context",
      "relevantLaw": "Act name and section number (e.g. Model Tenancy Act 2021, Section 13) or null",
      "lawCitation": "how this clause violates or is risky under that law, or null",
      "benchmarkPercentile": 5,
      "benchmarkNote": "Only 5% of standard Indian ${contractType} agreements include language like this",
      "isMissingClause": false
    }
  ],
  "missingClauses": [
    {
      "id": "m1",
      "name": "Missing clause name",
      "whyImportant": "why absence harms the user under Indian law",
      "legalRequirement": "Indian law that may require or strongly expect this clause, or null",
      "riskLevel": "high|medium",
      "isMissingClause": true
    }
  ],
  "overallScore": 42,
  "letterGrade": "D",
  "partyBias": 78,
  "executiveSummary": [
    "plain-language bullet 1",
    "plain-language bullet 2",
    "plain-language bullet 3",
    "plain-language bullet 4",
    "plain-language bullet 5"
  ],
  "indianLawsViolated": ["Model Tenancy Act 2021, Section 13", "Code on Wages 2019, Section 17"],
  "jurisdiction": "India — [state if identifiable]",
  "consumerForumAdvice": "one sentence on whether this contract warrants approaching consumer forum or labour commissioner"
}

partyBias: 0=fully favors user, 100=fully favors company.
overallScore: 0=extremely dangerous contract, 100=extremely safe.
Flag ALL unusual, one-sided, or exploitative clauses. Be thorough.

CONTRACT TEXT:
${contractExcerpt}`,
    4000
  );

  try { return JSON.parse(result); }
  catch (e) {
    console.error('Parse error:', e.message, result.slice(0, 400));
    return {
      clauses: [], missingClauses: [], overallScore: 50, letterGrade: 'C',
      partyBias: 50, executiveSummary: ['Analysis failed — please try again.'],
      indianLawsViolated: [], jurisdiction: 'India', consumerForumAdvice: ''
    };
  }
}

// ─── 3. OBLIGATION EXTRACTOR ──────────────────────────────────────────────────

export async function extractObligations(text) {
  const result = await callAnalyzeAPI(
    'You extract concrete user obligations from Indian legal contracts. Respond ONLY with valid JSON.',
    `Extract all obligations the user is agreeing to:

{
  "obligations": [
    {
      "type": "payment|notice|deadline|renewal|restriction|document|other",
      "description": "plain English explanation",
      "amount": "Rs X or null",
      "deadline": "date or timeframe or null",
      "consequence": "what happens if missed",
      "priority": "high|medium|low"
    }
  ]
}

CONTRACT: ${text.slice(0, 6000)}`
  );
  try { return JSON.parse(result); }
  catch { return { obligations: [] }; }
}

// ─── 4. NEGOTIATION ADVICE (law-grounded) ────────────────────────────────────

export async function getNegotiationAdvice(clause, contractType) {
  const laws = retrieveRelevantLaws(
    (clause.originalText || '') + ' ' + (clause.whyDangerous || ''),
    contractType, 3
  );
  const lawsCtx = formatLawsForContext(laws);

  const result = await callAnalyzeAPI(
    `You are a consumer-rights lawyer in India giving negotiation advice. Ground all advice in Indian law. Respond ONLY with valid JSON.

RELEVANT INDIAN LAWS:
${lawsCtx}`,
    `For this flagged Indian ${contractType} clause, provide negotiation help:

{
  "counterClause": "suggested replacement clause language",
  "talkingPoints": [
    "cite Indian law supporting your position (e.g. 'Under Model Tenancy Act 2021, Section 13...')",
    "second negotiation point",
    "third point"
  ],
  "legalGrounding": "specific Indian statute backing this demand",
  "likelyOutcome": "realistic assessment given Indian landlord/employer context",
  "escalationPath": "if they refuse: Labour Commissioner / Consumer Forum / Rent Controller / RBI Ombudsman / etc."
}

Clause: "${clause.originalText}"
Why risky: ${clause.whyDangerous}`
  );
  try { return JSON.parse(result); }
  catch { return { counterClause: '', talkingPoints: [], likelyOutcome: 'Seek legal advice.', escalationPath: 'Consumer Forum' }; }
}

// ─── 5. GLOSSARY BUILDER ──────────────────────────────────────────────────────

export async function buildGlossary(text) {
  const result = await callAnalyzeAPI(
    'You define legal and financial jargon found in Indian contracts for laypeople. Respond ONLY with valid JSON.',
    `Find all legal/financial terms and define them in simple Hindi-influenced English (the way a literate Indian non-lawyer would understand):

{ "terms": [{ "term": "indemnification", "definition": "simple 1-2 sentence explanation relevant to India" }] }

CONTRACT: ${text.slice(0, 6000)}`
  );
  try { return JSON.parse(result); }
  catch { return { terms: [] }; }
}
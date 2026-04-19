import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Scale, FileText, TrendingDown } from 'lucide-react';

const RISK_COLORS = { critical: 'var(--critical)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };

function AnomalyBadge({ percentile }) {
    if (!percentile && percentile !== 0) return null;
    const isAnomaly = percentile <= 10;
    const isRare = percentile <= 25;
    if (!isAnomaly && !isRare) return null;
    return (
        <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            padding: '3px 8px', borderRadius: '99px', fontWeight: 600,
            background: isAnomaly ? 'rgba(255,87,87,0.15)' : 'rgba(245,200,66,0.12)',
            color: isAnomaly ? 'var(--critical)' : 'var(--medium)',
            border: isAnomaly ? '1px solid rgba(255,87,87,0.25)' : '1px solid rgba(245,200,66,0.2)',
        }}>
            {isAnomaly ? `⚠ Only ${percentile}% of contracts` : `Rare — ${percentile}% of contracts`}
        </span>
    );
}

function ContractHeatmap({ analysis, contractText }) {
    const { clauses = [] } = analysis;
    if (!contractText || clauses.length === 0) {
        return (
            <div style={{ padding: '32px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Upload a contract to see the risk heatmap.</p>
            </div>
        );
    }

    // Build highlighted version of the text
    let highlighted = contractText.slice(0, 3000);
    const segments = [];
    let remaining = highlighted;
    const sortedClauses = [...clauses].filter(c => c.originalText && c.originalText.length > 10);

    // Simple sentence-by-sentence coloring
    const sentences = remaining.split(/(?<=[.!?।])\s+/);
    let html = '';
    sentences.forEach(sentence => {
        const match = sortedClauses.find(c =>
            c.originalText && sentence.toLowerCase().includes(c.originalText.slice(0, 30).toLowerCase())
        );
        if (match) {
            const colorMap = { critical: 'rgba(255,87,87,0.22)', high: 'rgba(255,140,66,0.18)', medium: 'rgba(245,200,66,0.14)', low: 'rgba(66,201,138,0.12)' };
            const borderMap = { critical: 'var(--critical)', high: 'var(--high)', medium: 'var(--medium)', low: 'var(--low)' };
            html += `<mark style="background:${colorMap[match.riskLevel] || 'transparent'};border-bottom:2px solid ${borderMap[match.riskLevel] || 'transparent'};border-radius:2px;padding:1px 0" title="${match.riskLevel.toUpperCase()}: ${match.plainEnglish || ''}">${sentence}</mark> `;
        } else {
            html += sentence + ' ';
        }
    });

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[
                    { label: 'Critical', color: 'var(--critical)', bg: 'rgba(255,87,87,0.15)' },
                    { label: 'High', color: 'var(--high)', bg: 'rgba(255,140,66,0.15)' },
                    { label: 'Medium', color: 'var(--medium)', bg: 'rgba(245,200,66,0.15)' },
                    { label: 'Low', color: 'var(--low)', bg: 'rgba(66,201,138,0.15)' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.bg, border: `1px solid ${l.color}` }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'JetBrains Mono, monospace' }}>{l.label}</span>
                    </div>
                ))}
            </div>
            <div style={{
                background: 'var(--bg-4)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '20px',
                fontSize: '13px', lineHeight: 1.85,
                color: 'var(--text-2)', maxHeight: '400px', overflowY: 'auto',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
                dangerouslySetInnerHTML={{ __html: html || remaining }}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                Hover over highlighted text to see risk explanation · Showing first 3000 chars
            </p>
        </div>
    );
}

function AnomalyPanel({ analysis }) {
    const { clauses = [] } = analysis;
    const anomalies = clauses.filter(c => c.benchmarkPercentile != null && c.benchmarkPercentile <= 15);

    if (anomalies.length === 0) return (
        <div style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>No structural anomalies detected — this contract is fairly standard.</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, padding: '12px 16px', background: 'rgba(255,87,87,0.06)', border: '1px solid rgba(255,87,87,0.12)', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--critical)' }}>{anomalies.length} structural anomalies</strong> detected — clauses that deviate significantly from standard {analysis.jurisdiction || 'Indian'} contracts of this type.
            </p>
            {anomalies.map((c, i) => (
                <div key={i} style={{
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    borderRadius: '14px', padding: '18px',
                    borderLeft: `3px solid ${RISK_COLORS[c.riskLevel] || 'var(--text-3)'}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TrendingDown size={14} color={RISK_COLORS[c.riskLevel]} />
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_COLORS[c.riskLevel], fontFamily: 'JetBrains Mono, monospace' }}>
                                {c.riskLevel} · {c.riskCategory}
                            </span>
                        </div>
                        <AnomalyBadge percentile={c.benchmarkPercentile} />
                    </div>
                    <p style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-2)', fontStyle: 'italic', marginBottom: '8px', lineHeight: 1.6 }}>
                        "{c.originalText?.slice(0, 150)}{c.originalText?.length > 150 ? '…' : ''}"
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.65 }}>{c.whyDangerous}</p>
                    {c.relevantLaw && (
                        <p style={{ fontSize: '11px', color: 'var(--blue)', marginTop: '8px', fontFamily: 'JetBrains Mono, monospace' }}>
                            ⚖ {c.relevantLaw}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

function SignScore({ analysis }) {
    const { overallScore = 50, partyBias = 50, clauses = [], missingClauses = [] } = analysis;
    const criticalCount = clauses.filter(c => c.riskLevel === 'critical').length;
    const highCount = clauses.filter(c => c.riskLevel === 'high').length;
    const missingCount = missingClauses.length;
    let signScore = overallScore - (criticalCount * 12) - (highCount * 5) - (missingCount * 4) - ((partyBias - 50) * 0.3);
    signScore = Math.max(0, Math.min(100, Math.round(signScore)));

    const verdict = signScore >= 70
        ? { label: 'Looks Reasonable to Sign', color: 'var(--low)', icon: CheckCircle, bg: 'rgba(66,201,138,0.06)', border: 'rgba(66,201,138,0.2)' }
        : signScore >= 45
            ? { label: 'Negotiate Before Signing', color: 'var(--medium)', icon: AlertTriangle, bg: 'rgba(245,200,66,0.06)', border: 'rgba(245,200,66,0.2)' }
            : { label: 'Do Not Sign As-Is', color: 'var(--critical)', icon: XCircle, bg: 'rgba(255,87,87,0.06)', border: 'rgba(255,87,87,0.2)' };

    const Icon = verdict.icon;

    return (
        <div style={{ border: `1px solid ${verdict.border}`, borderRadius: '18px', padding: '28px', background: verdict.bg, textAlign: 'center' }} className="animate-count-up">
            <Icon size={36} style={{ color: verdict.color, margin: '0 auto 14px' }} />
            <p style={{ fontFamily: 'Lora, serif', fontWeight: 700, fontSize: '22px', color: verdict.color, marginBottom: '6px' }}>
                {verdict.label}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '24px' }}>Based on AI analysis grounded in Indian law standards</p>

            <div style={{ maxWidth: '320px', margin: '0 auto 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                    <span>Don't Sign</span><span>Safe to Sign</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-4)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '99px', width: `${signScore}%`, background: 'linear-gradient(90deg, var(--critical), var(--medium) 50%, var(--low))', transition: 'width 1s ease' }} />
                </div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, marginTop: '8px', color: verdict.color }}>
                    {signScore}% Sign Confidence
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                    { label: 'Critical', value: criticalCount, color: 'var(--critical)' },
                    { label: 'High Risks', value: highCount, color: 'var(--high)' },
                    { label: 'Missing', value: missingCount, color: 'var(--medium)' },
                ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-4)', borderRadius: '12px', padding: '14px 10px', border: '1px solid var(--border)' }}>
                        <p style={{ fontFamily: 'Lora, serif', fontSize: '26px', fontWeight: 700, color: s.color }}>{s.value}</p>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PlainEnglishSummary({ analysis, userRole }) {
    const { executiveSummary = [], consumerForumAdvice, jurisdiction, indianLawsViolated = [] } = analysis;
    const roleAdvice = {
        tenant: 'As a tenant, the Model Tenancy Act 2021 caps your deposit at 2 months rent and requires 3 months notice for rent hikes.',
        employee: 'As an employee, the Code on Wages 2019 protects your salary timeline and the Industrial Disputes Act governs termination.',
        gig: 'As a gig worker, the Code on Social Security 2020 entitles you to benefits even without a formal employment contract.',
        borrower: 'As a borrower, the RBI Fair Practices Code requires full disclosure of charges and protects you from unfair collection.',
        other: 'The Consumer Protection Act 2019 and Indian Contract Act 1872 protect you in most Indian agreements.',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <FileText size={15} color="var(--blue)" />
                    <p style={{ fontWeight: 600, fontSize: '14px' }}>What This Contract Actually Means</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {executiveSummary.map((point, i) => (
                        <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--blue-dim)', border: '1px solid var(--border-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, color: 'var(--blue)' }}>{i + 1}</span>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-2)' }}>{point}</p>
                        </div>
                    ))}
                </div>
            </div>

            {userRole && roleAdvice[userRole] && (
                <div style={{ background: 'var(--blue-dim)', border: '1px solid var(--border-blue)', borderRadius: '14px', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Your Rights as a {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>{roleAdvice[userRole]}</p>
                </div>
            )}

            {indianLawsViolated.length > 0 && (
                <div style={{ background: 'rgba(255,87,87,0.05)', border: '1px solid rgba(255,87,87,0.15)', borderRadius: '14px', padding: '16px 18px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--critical)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                        ⚖ Potential Indian Law Issues
                    </p>
                    {indianLawsViolated.map((law, i) => (
                        <p key={i} style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '4px' }}>· {law}</p>
                    ))}
                    <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px' }}>AI-flagged — verify with an advocate.</p>
                </div>
            )}

            {jurisdiction && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={12} color="var(--text-3)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'JetBrains Mono, monospace' }}>{jurisdiction}</span>
                </div>
            )}

            {consumerForumAdvice && (
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Legal Escalation</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.65 }}>{consumerForumAdvice}</p>
                </div>
            )}
        </div>
    );
}

export default function SummaryPanel({ analysis, userRole, contractText }) {
    const [tab, setTab] = useState('verdict');

    const tabs = [
        { key: 'verdict', label: '✅ Should I Sign?' },
        { key: 'summary', label: '📋 Plain English' },
        { key: 'heatmap', label: '🔥 Risk Heatmap' },
        { key: 'anomalies', label: '📊 Anomalies' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-3)', borderRadius: '14px', padding: '5px', border: '1px solid var(--border)' }}>
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        flex: 1, padding: '9px 6px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                        transition: 'all 0.15s', border: 'none', cursor: 'pointer',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        background: tab === t.key ? 'var(--bg)' : 'transparent',
                        color: tab === t.key ? 'var(--blue-bright)' : 'var(--text-3)',
                        boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                    }}>{t.label}</button>
                ))}
            </div>

            {tab === 'verdict' && <SignScore analysis={analysis} />}
            {tab === 'summary' && <PlainEnglishSummary analysis={analysis} userRole={userRole} />}
            {tab === 'heatmap' && <ContractHeatmap analysis={analysis} contractText={contractText} />}
            {tab === 'anomalies' && <AnomalyPanel analysis={analysis} />}
        </div>
    );
}
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const GRADE_META = {
    A: { color: '#2a6e46', bg: '#eef6f1', label: 'Safe' },
    B: { color: '#3d8a5c', bg: '#eef6f1', label: 'Mostly Safe' },
    C: { color: '#b8891e', bg: '#fefaee', label: 'Risky' },
    D: { color: '#d4721a', bg: '#fef5ee', label: 'Very Risky' },
    F: { color: '#b52d1e', bg: '#fdf0ee', label: 'Dangerous' },
};
const RISK_COLORS = { critical: '#b52d1e', high: '#d4721a', medium: '#b8891e', low: '#2a6e46' };
const RISK_BG = { critical: '#fdf0ee', high: '#fef5ee', medium: '#fefaee', low: '#eef6f1' };

export default function RiskDashboard({ analysis, contractType, fileName }) {
    const {
        clauses = [], missingClauses = [], overallScore = 50, letterGrade = 'C',
        partyBias = 50, executiveSummary = [], indianLawsViolated = [],
        jurisdiction = 'India', consumerForumAdvice = ''
    } = analysis;

    const gradeMeta = GRADE_META[letterGrade] || GRADE_META.C;

    const counts = clauses.reduce((acc, c) => { acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1; return acc; }, {});
    const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));
    const catCounts = clauses.reduce((acc, c) => { acc[c.riskCategory] = (acc[c.riskCategory] || 0) + 1; return acc; }, {});
    const radarData = Object.entries(catCounts).map(([subject, A]) => ({ subject, A }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in stagger-children">

            {/* ── SCORE HERO ── */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                gap: 20, padding: '24px 28px',
                background: '#ffffff', borderRadius: 18,
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
                alignItems: 'center',
            }} className="animate-slide-up">
                <div>
                    <p className="section-label" style={{ marginBottom: 4 }}>{jurisdiction}</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fileName}
                    </h2>

                    {/* Score bar */}
                    <div style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Safety Score</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: gradeMeta.color, fontWeight: 500 }}>{overallScore}/100</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--paper-dark)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 999,
                                width: `${overallScore}%`,
                                background: `linear-gradient(90deg, ${gradeMeta.color}, ${gradeMeta.color}cc)`,
                                transition: 'width 1.2s cubic-bezier(.22,.68,0,1)',
                            }} />
                        </div>
                    </div>

                    <p style={{ fontSize: 13, color: '#6b6560', textTransform: 'capitalize' }}>{contractType} agreement</p>
                </div>

                {/* Grade badge */}
                <div style={{
                    width: 88, height: 88, borderRadius: 20,
                    background: gradeMeta.bg,
                    border: `2px solid ${gradeMeta.color}30`,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 46, fontWeight: 900, color: gradeMeta.color, lineHeight: 1 }}>
                        {letterGrade}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: gradeMeta.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
                        {gradeMeta.label}
                    </span>
                </div>
            </div>

            {/* ── RISK COUNT PILLS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="animate-slide-up">
                {['critical', 'high', 'medium', 'low'].map(level => (
                    <div key={level} style={{
                        background: RISK_BG[level],
                        borderRadius: 14, padding: '14px 10px',
                        textAlign: 'center',
                        border: `1px solid ${RISK_COLORS[level]}25`,
                    }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: RISK_COLORS[level], lineHeight: 1 }}>
                            {counts[level] || 0}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: RISK_COLORS[level], textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4, opacity: 0.8 }}>
                            {level}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── POWER IMBALANCE ── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }} className="animate-slide-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <p className="section-label">Power Imbalance</p>
                    <span style={{ fontSize: 12, color: partyBias > 70 ? 'var(--critical)' : partyBias > 50 ? 'var(--high)' : 'var(--green-india)', fontWeight: 600 }}>
                        {partyBias > 70 ? 'Heavily against you' : partyBias > 50 ? 'Somewhat against you' : partyBias > 40 ? 'Balanced' : 'In your favour'}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9c9790', marginBottom: 6 }}>
                    <span>You</span><span>Other Party</span>
                </div>
                <div style={{ height: 10, background: 'var(--paper-dark)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        height: '100%', borderRadius: 999,
                        width: `${partyBias}%`,
                        background: `linear-gradient(90deg, var(--green-india), var(--saffron) 55%, var(--critical))`,
                        transition: 'width 1s ease',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, left: '50%', width: 1, background: 'rgba(15,13,10,0.25)' }} />
                </div>
            </div>

            {/* ── VIOLATED LAWS ── */}
            {indianLawsViolated.length > 0 && (
                <div style={{
                    background: '#fff', borderRadius: 16, padding: '20px 24px',
                    border: '2px solid var(--critical)',
                    boxShadow: '0 0 0 4px rgba(181,45,30,0.06)',
                }} className="animate-slide-up">
                    <p className="section-label" style={{ color: 'var(--critical)', marginBottom: 12 }}>
                        Potential Indian Law Violations
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {indianLawsViolated.map((law, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--critical-bg)', border: '1px solid var(--critical)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--critical)', fontWeight: 700 }}>!</span>
                                </div>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)', lineHeight: 1.5 }}>{law}</span>
                            </li>
                        ))}
                    </ul>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', marginTop: 14, lineHeight: 1.6 }}>
                        AI-flagged potential violations — not confirmed legal conclusions. Verify with an advocate.
                    </p>
                </div>
            )}

            {/* ── MISSING CLAUSES ── */}
            {missingClauses.length > 0 && (
                <div style={{
                    background: 'var(--high-bg)', borderRadius: 16, padding: '20px 24px',
                    border: '1px solid rgba(212,114,26,0.3)',
                }} className="animate-slide-up">
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--high)', marginBottom: 10 }}>
                        {missingClauses.length} Important Clause{missingClauses.length > 1 ? 's' : ''} Missing
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {missingClauses.map(m => (
                            <li key={m.id} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#4a3820' }}>
                                <span style={{ color: 'var(--high)', fontWeight: 700, flexShrink: 0 }}>—</span>
                                <span>{m.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── EXECUTIVE SUMMARY ── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }} className="animate-slide-up">
                <p className="section-label" style={{ marginBottom: 16 }}>What This Contract Means For You</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {executiveSummary.map((point, i) => (
                        <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{ width: 24, height: 24, borderRadius: 8, background: 'var(--saffron-glow)', border: '1px solid rgba(217,93,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--saffron)', fontWeight: 700 }}>{i + 1}</span>
                            </div>
                            <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65 }}>{point}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ── CONSUMER FORUM ADVICE ── */}
            {consumerForumAdvice && (
                <div style={{ background: 'var(--ashoka-light)', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(26,63,122,0.2)' }} className="animate-slide-up">
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ashoka)', marginBottom: 4 }}>Legal Escalation Path</p>
                    <p style={{ fontSize: 13, color: '#2a3a5e', lineHeight: 1.6 }}>{consumerForumAdvice}</p>
                </div>
            )}

            {/* ── CHARTS ── */}
            {pieData.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: radarData.length >= 3 ? '1fr 1fr' : '1fr', gap: 12 }} className="animate-slide-up">
                    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                        <p className="section-label" style={{ marginBottom: 8 }}>Risk Mix</p>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={64} dataKey="value" paddingAngle={4}>
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={RISK_COLORS[entry.name] || '#aaa'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [`${v} clause${v > 1 ? 's' : ''}`, n]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {radarData.length >= 3 && (
                        <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                            <p className="section-label" style={{ marginBottom: 8 }}>By Category</p>
                            <ResponsiveContainer width="100%" height={150}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="var(--border)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: '#9c9790' }} />
                                    <Radar dataKey="A" stroke="var(--saffron)" fill="var(--saffron)" fillOpacity={0.15} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
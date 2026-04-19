import { CheckCircle2, XCircle, AlertTriangle, Scale, FileText, Phone } from 'lucide-react';

const GRADE_META = {
    A: { verdict: 'Safe to Sign', color: '#2a6e46', bg: '#eef6f1', border: '#2a6e46', icon: CheckCircle2, recommendation: 'This contract is reasonably fair. Review highlighted clauses before signing.' },
    B: { verdict: 'Mostly Safe', color: '#3d8a5c', bg: '#eef6f1', border: '#3d8a5c', icon: CheckCircle2, recommendation: 'Generally acceptable. Negotiate the flagged high-risk clauses if possible.' },
    C: { verdict: 'Proceed with Caution', color: '#b8891e', bg: '#fefaee', border: '#b8891e', icon: AlertTriangle, recommendation: 'Several risky clauses. Try to negotiate before signing, or consult an advocate.' },
    D: { verdict: 'Risky — Negotiate', color: '#d4721a', bg: '#fef5ee', border: '#d4721a', icon: AlertTriangle, recommendation: 'Multiple exploitative terms. Do not sign without negotiating or legal advice.' },
    F: { verdict: 'Do Not Sign As-Is', color: '#b52d1e', bg: '#fdf0ee', border: '#b52d1e', icon: XCircle, recommendation: 'This contract violates Indian law. Seek legal help before signing anything.' },
};

const RISK_COLORS = { critical: '#b52d1e', high: '#d4721a', medium: '#b8891e', low: '#2a6e46' };
const RISK_BG = { critical: '#fdf0ee', high: '#fef5ee', medium: '#fefaee', low: '#eef6f1' };

export default function SummaryTab({ analysis, contractType }) {
    const {
        clauses = [], missingClauses = [], overallScore = 50, letterGrade = 'C',
        partyBias = 50, executiveSummary = [], indianLawsViolated = [],
        jurisdiction = 'India',
    } = analysis;

    const meta = GRADE_META[letterGrade] || GRADE_META.C;
    const VerdictIcon = meta.icon;

    const counts = clauses.reduce((acc, c) => {
        acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1; return acc;
    }, {});

    const criticalClauses = clauses.filter(c => c.riskLevel === 'critical');
    const highClauses = clauses.filter(c => c.riskLevel === 'high');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">

            {/* ── VERDICT CARD ── */}
            <div style={{
                background: meta.bg,
                border: `2px solid ${meta.border}40`,
                borderRadius: 20, padding: '28px 28px',
                display: 'flex', alignItems: 'flex-start', gap: 20,
                boxShadow: `0 0 0 6px ${meta.border}10, var(--shadow-md)`,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background score */}
                <div style={{
                    position: 'absolute', right: -10, top: -20,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 140, fontWeight: 900,
                    color: `${meta.color}08`,
                    lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                }}>
                    {letterGrade}
                </div>

                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <VerdictIcon size={26} style={{ color: meta.color }} />
                </div>

                <div style={{ flex: 1, zIndex: 1 }}>
                    <p className="section-label" style={{ marginBottom: 4 }}>Should I Sign?</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: meta.color, marginBottom: 8, lineHeight: 1.1 }}>
                        {meta.verdict}
                    </h2>
                    <p style={{ fontSize: 13, color: '#4a4540', lineHeight: 1.65, maxWidth: 480 }}>
                        {meta.recommendation}
                    </p>

                    {/* Score row */}
                    <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                        <div>
                            <p className="section-label" style={{ marginBottom: 3 }}>Safety Score</p>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: meta.color, lineHeight: 1 }}>
                                {overallScore}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.5 }}>/100</span>
                            </p>
                        </div>
                        <div style={{ width: 1, background: `${meta.border}30` }} />
                        <div>
                            <p className="section-label" style={{ marginBottom: 3 }}>Power Imbalance</p>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: meta.color, lineHeight: 1 }}>
                                {partyBias}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.5 }}>%</span>
                            </p>
                        </div>
                        <div style={{ width: 1, background: `${meta.border}30` }} />
                        <div>
                            <p className="section-label" style={{ marginBottom: 3 }}>Grade</p>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: meta.color, lineHeight: 1 }}>
                                {letterGrade}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RISK BREAKDOWN ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {['critical', 'high', 'medium', 'low'].map(level => (
                    <div key={level} style={{
                        background: RISK_BG[level], borderRadius: 14, padding: '14px 12px', textAlign: 'center',
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

            {/* ── TOP RISKS (critical + high only) ── */}
            {(criticalClauses.length > 0 || highClauses.length > 0) && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <p className="section-label" style={{ marginBottom: 14 }}>Top Risks To Know Before Signing</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[...criticalClauses, ...highClauses].slice(0, 5).map((c, i) => {
                            const cfg = c.riskLevel === 'critical'
                                ? { bg: '#b52d1e', bgLight: '#fdf0ee', label: 'Critical' }
                                : { bg: '#d4721a', bgLight: '#fef5ee', label: 'High' };
                            return (
                                <div key={c.id} style={{
                                    display: 'flex', gap: 12, alignItems: 'flex-start',
                                    padding: '12px 14px', borderRadius: 12,
                                    background: cfg.bgLight,
                                    border: `1px solid ${cfg.bg}20`,
                                    borderLeft: `3px solid ${cfg.bg}`,
                                }}>
                                    <span style={{
                                        fontFamily: "'DM Mono', monospace", fontSize: 9,
                                        background: cfg.bg, color: '#fff',
                                        padding: '2px 8px', borderRadius: 4,
                                        flexShrink: 0, marginTop: 2, fontWeight: 700,
                                        textTransform: 'uppercase',
                                    }}>
                                        {cfg.label}
                                    </span>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                                            {c.plainEnglish}
                                        </p>
                                        {c.whyDangerous && (
                                            <p style={{ fontSize: 11, color: '#6b6560', lineHeight: 1.6 }}>{c.whyDangerous}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── VIOLATED LAWS ── */}
            {indianLawsViolated.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '2px solid var(--critical)', boxShadow: '0 0 0 4px rgba(181,45,30,0.06)' }}>
                    <p className="section-label" style={{ color: 'var(--critical)', marginBottom: 12 }}>
                        Potential Indian Law Violations
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {indianLawsViolated.map((law, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <Scale size={13} style={{ color: 'var(--critical)', flexShrink: 0, marginTop: 2 }} />
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--ink)', lineHeight: 1.5 }}>{law}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── MISSING CLAUSES ── */}
            {missingClauses.length > 0 && (
                <div style={{ background: 'var(--high-bg)', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(212,114,26,0.3)' }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--high)', marginBottom: 10 }}>
                        {missingClauses.length} Protective Clause{missingClauses.length > 1 ? 's' : ''} Missing
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {missingClauses.map(m => (
                            <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <FileText size={12} style={{ color: 'var(--high)', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{m.name}</p>
                                    <p style={{ fontSize: 11, color: '#5a4020', lineHeight: 1.5, marginTop: 1 }}>{m.whyImportant}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── KEY FINDINGS ── */}
            {executiveSummary.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <p className="section-label" style={{ marginBottom: 14 }}>Key Findings</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {executiveSummary.map((point, i) => (
                            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--saffron-glow)', border: '1px solid rgba(217,93,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--saffron)', fontWeight: 700 }}>{i + 1}</span>
                                </div>
                                <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.65 }}>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── HELPLINE ── */}
            <div style={{ background: 'var(--saffron)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} style={{ color: '#fff' }} />
                </div>
                <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 2 }}>
                        Need Help? Call 1915
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                        National Consumer Helpline · Free · Toll-free · Hindi + regional languages
                    </p>
                </div>
            </div>
        </div>
    );
}
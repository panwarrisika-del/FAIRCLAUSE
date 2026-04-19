import { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const RISK_CONFIG = {
    critical: { bg: '#b52d1e', bgLight: '#fdf0ee', border: '#b52d1e', label: 'Critical', pill: '#fdf0ee', pillText: '#b52d1e' },
    high: { bg: '#d4721a', bgLight: '#fef5ee', border: '#d4721a', label: 'High', pill: '#fef5ee', pillText: '#d4721a' },
    medium: { bg: '#b8891e', bgLight: '#fefaee', border: '#b8891e', label: 'Medium', pill: '#fefaee', pillText: '#b8891e' },
    low: { bg: '#2a6e46', bgLight: '#eef6f1', border: '#2a6e46', label: 'Low', pill: '#eef6f1', pillText: '#2a6e46' },
};

function deviationScore(clause) {
    if (clause.benchmarkPercentile != null) return Math.round(100 - clause.benchmarkPercentile);
    const map = { critical: 92, high: 74, medium: 48, low: 18 };
    return map[clause.riskLevel] || 50;
}

function ClauseRow({ clause, index }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = RISK_CONFIG[clause.riskLevel] || RISK_CONFIG.medium;
    const score = deviationScore(clause);

    return (
        <div style={{
            borderRadius: 14,
            border: `1px solid ${cfg.border}25`,
            borderLeft: `4px solid ${cfg.bg}`,
            overflow: 'hidden',
            background: '#ffffff',
            boxShadow: 'var(--shadow-sm)',
            transition: 'box-shadow 0.2s ease',
        }}>
            {/* Main row — always visible */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: 'pointer', padding: '0' }}
            >
                {/* Colour-coded header bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: cfg.bgLight,
                    borderBottom: expanded ? `1px solid ${cfg.border}20` : 'none',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#b0a99e' }}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        {/* Risk badge */}
                        <span style={{
                            background: cfg.bg, color: '#fff',
                            fontFamily: "'DM Mono', monospace", fontSize: 9,
                            padding: '2px 10px', borderRadius: 999,
                            textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                        }}>
                            {cfg.label}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', textTransform: 'capitalize' }}>
                            {clause.riskCategory}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Deviation score */}
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 700,
                                color: cfg.bg,
                            }}>
                                {score}% deviation
                            </span>
                        </div>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9c9790', display: 'flex' }}>
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>
                </div>

                {/* Side-by-side columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {/* LEFT — original */}
                    <div style={{
                        padding: '14px 18px',
                        borderRight: '1px solid var(--border-light)',
                    }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#b0a99e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            Original Legal Text
                        </p>
                        <p style={{
                            fontFamily: "'DM Mono', monospace", fontSize: 11,
                            color: '#3a3530', lineHeight: 1.7, fontStyle: 'italic',
                            display: '-webkit-box',
                            WebkitLineClamp: expanded ? 999 : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            "{clause.originalText}"
                        </p>
                    </div>

                    {/* RIGHT — plain English */}
                    <div style={{ padding: '14px 18px' }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#b0a99e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                            Plain English
                        </p>
                        <p style={{
                            fontSize: 12, color: 'var(--ink)', lineHeight: 1.7, fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: expanded ? 999 : 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {clause.plainEnglish}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">

                    {/* Why dangerous */}
                    {clause.whyDangerous && (
                        <div style={{ display: 'flex', gap: 10, padding: '12px 14px', background: cfg.bgLight, borderRadius: 10, border: `1px solid ${cfg.border}20` }}>
                            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2, color: cfg.bg }} />
                            <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
                                <strong style={{ color: cfg.bg }}>Risk: </strong>{clause.whyDangerous}
                            </p>
                        </div>
                    )}

                    {/* Law citation */}
                    {clause.lawCitation && (
                        <div style={{ background: 'var(--ashoka)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
                            <BookOpen size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginTop: 2 }} />
                            <div>
                                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {clause.relevantLaw || 'Indian Law'}
                                </p>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>
                                    {clause.lawCitation}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Deviation bar */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Deviation from standard Indian contracts
                            </span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: cfg.bg, fontWeight: 700 }}>
                                {score}%
                            </span>
                        </div>
                        <div style={{ height: 5, background: 'var(--paper-dark)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${score}%`, background: cfg.bg, borderRadius: 999, transition: 'width 0.6s ease' }} />
                        </div>
                        {clause.benchmarkNote && (
                            <p style={{ fontSize: 11, color: '#6b6560', marginTop: 6, fontStyle: 'italic' }}>
                                {clause.benchmarkNote}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SideBySideView({ analysis }) {
    const [filter, setFilter] = useState('all');
    const { clauses = [] } = analysis;

    const counts = ['all', 'critical', 'high', 'medium', 'low'].reduce((acc, l) => {
        acc[l] = l === 'all' ? clauses.length : clauses.filter(c => c.riskLevel === l).length;
        return acc;
    }, {});
    const filtered = filter === 'all' ? clauses : clauses.filter(c => c.riskLevel === filter);

    const dotColors = { critical: '#b52d1e', high: '#d4721a', medium: '#b8891e', low: '#2a6e46' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>
                    Side-by-Side Clause View
                </p>
                <p style={{ fontSize: 12, color: '#9c9790' }}>
                    Every clause presented twice — original legal language on the left, plain-English simplification on the right. Click any row to expand risk details.
                </p>
            </div>

            {/* Column headers */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 0, padding: '0 4px',
            }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: 18 }}>
                    Legal Language
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: 18 }}>
                    What It Means
                </p>
            </div>

            {/* Filter strip */}
            <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--paper-dark)', borderRadius: 14, overflowX: 'auto' }} className="no-scrollbar">
                {['all', 'critical', 'high', 'medium', 'low'].map(l => (
                    <button key={l} onClick={() => setFilter(l)} style={{
                        flexShrink: 0, padding: '7px 14px', borderRadius: 10, border: 'none',
                        fontSize: 12, fontWeight: filter === l ? 600 : 400, cursor: 'pointer',
                        background: filter === l ? '#ffffff' : 'transparent',
                        color: filter === l ? 'var(--ink)' : '#9c9790',
                        boxShadow: filter === l ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s ease',
                    }}>
                        {l !== 'all' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColors[l], display: 'inline-block', flexShrink: 0 }} />}
                        {l === 'all' ? `All (${counts.all})` : `${l} (${counts[l]})`}
                    </button>
                ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9c9790', padding: '32px 0', fontSize: 13 }}>
                        No clauses found.
                    </p>
                )}
                {filtered.map((c, i) => (
                    <ClauseRow key={c.id} clause={c} index={i} />
                ))}
            </div>
        </div>
    );
}
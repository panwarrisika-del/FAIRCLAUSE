import { useState } from 'react';
import { X, AlertTriangle, BookOpen, TrendingDown } from 'lucide-react';

const RISK_CONFIG = {
    critical: {
        bg: '#b52d1e',
        bgLight: '#fdf0ee',
        border: '#b52d1e',
        label: 'Critical',
        textOnDark: '#ffffff',
        dot: '#b52d1e',
    },
    high: {
        bg: '#d4721a',
        bgLight: '#fef5ee',
        border: '#d4721a',
        label: 'High',
        textOnDark: '#ffffff',
        dot: '#d4721a',
    },
    medium: {
        bg: '#b8891e',
        bgLight: '#fefaee',
        border: '#b8891e',
        label: 'Medium',
        textOnDark: '#ffffff',
        dot: '#b8891e',
    },
    low: {
        bg: '#2a6e46',
        bgLight: '#eef6f1',
        border: '#2a6e46',
        label: 'Low',
        textOnDark: '#ffffff',
        dot: '#2a6e46',
    },
};

// Deviation score: how far this clause deviates from "normal" Indian contracts
function deviationScore(clause) {
    if (clause.benchmarkPercentile != null) {
        return Math.round(100 - clause.benchmarkPercentile);
    }
    const map = { critical: 92, high: 74, medium: 48, low: 18 };
    return map[clause.riskLevel] || 50;
}

function DeviationBar({ score, color }) {
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Deviation from standard
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color, fontWeight: 600 }}>
                    {score}%
                </span>
            </div>
            <div style={{ height: 4, background: 'var(--paper-dark)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${score}%`, borderRadius: 999,
                    background: color,
                    transition: 'width 0.6s ease',
                }} />
            </div>
        </div>
    );
}

function HeatCell({ clause, onClick, isSelected }) {
    const cfg = RISK_CONFIG[clause.riskLevel] || RISK_CONFIG.medium;
    const score = deviationScore(clause);

    return (
        <div
            onClick={() => onClick(clause)}
            title={clause.plainEnglish || clause.riskCategory}
            style={{
                background: cfg.bg,
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                border: isSelected ? '2px solid #ffffff' : '2px solid transparent',
                boxShadow: isSelected
                    ? `0 0 0 3px ${cfg.bg}60, 0 4px 16px rgba(0,0,0,0.15)`
                    : '0 2px 6px rgba(0,0,0,0.12)',
                opacity: 1,
                position: 'relative',
                minHeight: 72,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 18px rgba(0,0,0,0.18)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isSelected ? `0 0 0 3px ${cfg.bg}60` : '0 2px 6px rgba(0,0,0,0.12)'; }}
        >
            {/* Category label */}
            <div>
                <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                    color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em',
                    display: 'block', marginBottom: 4,
                }}>
                    {clause.riskCategory || 'Clause'}
                </span>
                <p style={{
                    fontSize: 11, color: '#ffffff', fontWeight: 500, lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {clause.plainEnglish || clause.originalText}
                </p>
            </div>

            {/* Score pill */}
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>
                    {cfg.label}
                </span>
                <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700,
                    background: 'rgba(0,0,0,0.2)', color: '#ffffff',
                    padding: '2px 6px', borderRadius: 4,
                }}>
                    {score}% dev
                </span>
            </div>
        </div>
    );
}

function ClauseDetail({ clause, onClose }) {
    const cfg = RISK_CONFIG[clause.riskLevel] || RISK_CONFIG.medium;
    const score = deviationScore(clause);

    return (
        <div style={{
            background: '#ffffff', borderRadius: 18, padding: '24px',
            border: `1px solid ${cfg.border}30`,
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
        }} className="animate-scale-in">
            {/* Close */}
            <button onClick={onClose} style={{
                position: 'absolute', top: 16, right: 16,
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--paper-mid)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9c9790',
            }}>
                <X size={14} />
            </button>

            {/* Risk badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                    background: cfg.bg, color: '#fff',
                    fontFamily: "'DM Mono', monospace", fontSize: 10,
                    padding: '4px 12px', borderRadius: 999,
                    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                }}>
                    {cfg.label} Risk
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9c9790', textTransform: 'capitalize' }}>
                    {clause.riskCategory}
                </span>
                {clause.section && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#b0a99e' }}>
                        § {clause.section}
                    </span>
                )}
            </div>

            {/* Side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                {/* Original */}
                <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                        Original Legal Text
                    </p>
                    <div style={{
                        background: 'var(--paper-mid)', borderRadius: 10, padding: '12px 14px',
                        borderLeft: `3px solid ${cfg.border}`,
                        minHeight: 80,
                    }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#3a3530', lineHeight: 1.7, fontStyle: 'italic' }}>
                            "{clause.originalText}"
                        </p>
                    </div>
                </div>

                {/* Plain English */}
                <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                        What It Actually Means
                    </p>
                    <div style={{
                        background: cfg.bgLight, borderRadius: 10, padding: '12px 14px',
                        borderLeft: `3px solid ${cfg.border}`,
                        minHeight: 80,
                    }}>
                        <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.7 }}>
                            {clause.plainEnglish}
                        </p>
                    </div>
                </div>
            </div>

            {/* Why dangerous */}
            {clause.whyDangerous && (
                <div style={{ display: 'flex', gap: 10, background: `${cfg.bgLight}`, borderRadius: 10, padding: '12px 14px', marginBottom: 12, border: `1px solid ${cfg.border}20` }}>
                    <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2, color: cfg.bg }} />
                    <p style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
                        <strong style={{ color: cfg.bg }}>Why this is risky: </strong>
                        {clause.whyDangerous}
                    </p>
                </div>
            )}

            {/* Law citation */}
            {clause.lawCitation && (
                <div style={{ background: 'var(--ashoka)', borderRadius: 10, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10 }}>
                    <BookOpen size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                            {clause.relevantLaw || 'Indian Law'}
                        </p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>
                            {clause.lawCitation}
                        </p>
                    </div>
                </div>
            )}

            {/* Deviation bar */}
            <DeviationBar score={score} color={cfg.bg} />

            {/* Benchmark note */}
            {clause.benchmarkNote && (
                <p style={{ fontSize: 11, color: '#6b6560', marginTop: 10, fontStyle: 'italic', lineHeight: 1.6 }}>
                    {clause.benchmarkNote}
                </p>
            )}
        </div>
    );
}

export default function RiskHeatmap({ analysis }) {
    const [selected, setSelected] = useState(null);
    const { clauses = [] } = analysis;

    const counts = ['critical', 'high', 'medium', 'low'].reduce((acc, l) => {
        acc[l] = clauses.filter(c => c.riskLevel === l).length; return acc;
    }, {});

    const handleClick = (clause) => {
        setSelected(prev => prev?.id === clause.id ? null : clause);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Legend + summary */}
            <div style={{ background: '#ffffff', borderRadius: 16, padding: '18px 22px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>
                            Risk Heatmap
                        </p>
                        <p style={{ fontSize: 12, color: '#9c9790' }}>
                            Click any clause to see original vs simplified view and risk details
                        </p>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {['critical', 'high', 'medium', 'low'].map(l => (
                            counts[l] > 0 && (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: 3, background: RISK_CONFIG[l].bg, display: 'inline-block', flexShrink: 0 }} />
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6b6560', textTransform: 'capitalize' }}>
                                        {l} ({counts[l]})
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* Heatmap grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 10,
            }}>
                {clauses.map(c => (
                    <HeatCell
                        key={c.id}
                        clause={c}
                        onClick={handleClick}
                        isSelected={selected?.id === c.id}
                    />
                ))}
            </div>

            {/* Detail panel */}
            {selected && (
                <ClauseDetail
                    clause={selected}
                    onClose={() => setSelected(null)}
                />
            )}

            {clauses.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9c9790', padding: '40px 0', fontSize: 13 }}>
                    No clauses to display.
                </p>
            )}
        </div>
    );
}
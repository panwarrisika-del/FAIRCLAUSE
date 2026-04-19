import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import BenchmarkBadge from './BenchmarkBadge';
import NegotiationPanel from './NegotiationPanel';

const LEVEL_META = {
    critical: { label: 'Critical Risk', dotColor: '#b52d1e', bg: '#fdf0ee', border: '#b52d1e', borderLeft: 3 },
    high: { label: 'High Risk', dotColor: '#d4721a', bg: '#fef5ee', border: '#d4721a', borderLeft: 3 },
    medium: { label: 'Medium Risk', dotColor: '#b8891e', bg: '#fefaee', border: '#b8891e', borderLeft: 3 },
    low: { label: 'Low Risk', dotColor: '#2a6e46', bg: '#eef6f1', border: '#2a6e46', borderLeft: 3 },
};

function ClauseCard({ clause, contractType }) {
    const [open, setOpen] = useState(false);
    const [showNeg, setShowNeg] = useState(false);
    const meta = LEVEL_META[clause.riskLevel] || LEVEL_META.medium;

    return (
        <div style={{
            background: open ? '#ffffff' : meta.bg,
            borderRadius: 14,
            border: `1px solid ${meta.border}22`,
            borderLeft: `3px solid ${meta.border}`,
            overflow: 'hidden',
            transition: 'background 0.2s ease, box-shadow 0.2s ease',
            boxShadow: open ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        }}>
            {/* Header row */}
            <div
                onClick={() => setOpen(!open)}
                style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Label row */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.dotColor, display: 'inline-block', flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: meta.dotColor, fontWeight: 500 }}>
                            {meta.label}
                        </span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', textTransform: 'capitalize' }}>
                            {clause.riskCategory}
                        </span>
                        {clause.benchmarkPercentile != null && clause.benchmarkPercentile < 15 && (
                            <BenchmarkBadge percentile={clause.benchmarkPercentile} />
                        )}
                    </div>

                    {/* Original text */}
                    <p style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 11,
                        background: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: '8px 12px',
                        color: '#3a3530', lineHeight: 1.6, marginBottom: 8,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        fontStyle: 'italic',
                    }}>
                        "{clause.originalText}"
                    </p>

                    {/* Plain English */}
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.5 }}>
                        {clause.plainEnglish}
                    </p>
                </div>

                <button style={{ color: '#9c9790', flexShrink: 0, marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
            </div>

            {/* Expanded detail */}
            {open && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }} className="animate-fade-in">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Why dangerous */}
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: 10 }}>
                            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1, color: 'var(--high)' }} />
                            <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>
                                <strong style={{ color: 'var(--high)' }}>Why this is risky: </strong>
                                {clause.whyDangerous}
                            </div>
                        </div>

                        {/* Law citation */}
                        {clause.lawCitation && (
                            <div style={{ background: 'var(--ashoka)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
                                <BookOpen size={13} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                                        {clause.relevantLaw}
                                    </p>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>
                                        {clause.lawCitation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Benchmark note */}
                        {clause.benchmarkNote && (
                            <div style={{ fontSize: 12, color: '#6b6560', background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '10px 14px', fontStyle: 'italic' }}>
                                {clause.benchmarkNote}
                            </div>
                        )}

                        {/* Section */}
                        {clause.section && (
                            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790' }}>
                                Contract section: {clause.section}
                            </p>
                        )}

                        {/* Negotiation button */}
                        <button
                            onClick={e => { e.stopPropagation(); setShowNeg(!showNeg); }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: 'var(--ink)', color: '#fff',
                                border: 'none', borderRadius: 10, padding: '9px 16px',
                                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                transition: 'opacity 0.15s ease',
                                alignSelf: 'flex-start',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <Zap size={11} /> Get Negotiation Script
                        </button>

                        {showNeg && <NegotiationPanel clause={clause} contractType={contractType} />}
                    </div>
                </div>
            )}
        </div>
    );
}

function MissingCard({ clause }) {
    return (
        <div style={{
            background: 'var(--high-bg)', borderRadius: 14, padding: '14px 18px',
            border: '1px solid rgba(212,114,26,0.25)', borderLeft: '3px solid var(--high)',
        }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>
                Missing Clause: {clause.name}
            </p>
            <p style={{ fontSize: 12, color: '#5a4020', lineHeight: 1.6 }}>{clause.whyImportant}</p>
            {clause.legalRequirement && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', marginTop: 8 }}>
                    Legal basis: {clause.legalRequirement}
                </p>
            )}
        </div>
    );
}

export default function ClauseViewer({ analysis, contractType }) {
    const [filter, setFilter] = useState('all');
    const { clauses = [], missingClauses = [] } = analysis;

    const levels = ['all', 'critical', 'high', 'medium', 'low'];
    const counts = levels.reduce((acc, l) => {
        acc[l] = l === 'all' ? clauses.length : clauses.filter(c => c.riskLevel === l).length;
        return acc;
    }, {});
    const filtered = filter === 'all' ? clauses : clauses.filter(c => c.riskLevel === filter);

    const dotColors = { critical: '#b52d1e', high: '#d4721a', medium: '#b8891e', low: '#2a6e46' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Filter row */}
            <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--paper-dark)', borderRadius: 14, overflowX: 'auto' }} className="no-scrollbar">
                {levels.map(l => (
                    <button key={l} onClick={() => setFilter(l)} style={{
                        flexShrink: 0, padding: '7px 14px', borderRadius: 10,
                        fontSize: 12, fontWeight: filter === l ? 600 : 400, cursor: 'pointer', border: 'none',
                        background: filter === l ? '#ffffff' : 'transparent',
                        color: filter === l ? 'var(--ink)' : '#9c9790',
                        boxShadow: filter === l ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.15s ease',
                    }}>
                        {l !== 'all' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColors[l] || '#999', display: 'inline-block', flexShrink: 0 }} />}
                        {l === 'all' ? `All (${counts.all})` : `${l} (${counts[l]})`}
                    </button>
                ))}
            </div>

            {/* Clauses list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9c9790', padding: '32px 0', fontSize: 13 }}>
                        No {filter} risk clauses found.
                    </p>
                )}
                {filtered.map(c => <ClauseCard key={c.id} clause={c} contractType={contractType} />)}
            </div>

            {/* Missing clauses */}
            {missingClauses.length > 0 && (filter === 'all' || filter === 'high') && (
                <div style={{ paddingTop: 8 }}>
                    <p className="section-label" style={{ marginBottom: 10 }}>Missing Protections</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {missingClauses.map(m => <MissingCard key={m.id} clause={m} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
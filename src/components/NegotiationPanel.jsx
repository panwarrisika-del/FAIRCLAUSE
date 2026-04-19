import { useState, useEffect } from 'react';
import { getNegotiationAdvice } from '../api/claude';

export default function NegotiationPanel({ clause, contractType }) {
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getNegotiationAdvice(clause, contractType)
            .then(setAdvice)
            .catch(() => setError('Could not generate negotiation advice.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', color: '#9c9790' }}>
            <div style={{ width: 14, height: 14, border: '2px solid var(--border)', borderTopColor: 'var(--saffron)', borderRadius: '50%' }} className="animate-spin" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11 }}>Consulting Indian law database...</span>
        </div>
    );

    if (error) return (
        <p style={{ fontSize: 12, color: 'var(--critical)', padding: '8px 0' }}>{error}</p>
    );

    if (!advice) return null;

    return (
        <div style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 14, padding: '18px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 14 }} className="animate-fade-in">

            {/* Counter clause */}
            {advice.counterClause && (
                <div>
                    <p className="section-label" style={{ marginBottom: 8 }}>Suggested Counter-Clause</p>
                    <p style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 11,
                        background: 'var(--paper-mid)', border: '1px solid var(--border)',
                        borderRadius: 10, padding: '12px 14px',
                        color: '#3a3530', lineHeight: 1.7, fontStyle: 'italic',
                    }}>
                        "{advice.counterClause}"
                    </p>
                </div>
            )}

            {/* Talking points */}
            {advice.talkingPoints?.length > 0 && (
                <div>
                    <p className="section-label" style={{ marginBottom: 8 }}>What To Say</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {advice.talkingPoints.map((p, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--green-light)', border: '1px solid rgba(42,110,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'var(--green-india)', fontWeight: 700 }}>+</span>
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6 }}>{p}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Legal grounding */}
            {advice.legalGrounding && (
                <div style={{ background: 'var(--ashoka)', borderRadius: 10, padding: '12px 16px' }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                        Legal Basis
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6 }}>{advice.legalGrounding}</p>
                </div>
            )}

            {/* Escalation */}
            {advice.escalationPath && (
                <div style={{ background: 'var(--paper-mid)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#4a4540' }}>
                    <strong style={{ color: 'var(--high)' }}>If they refuse: </strong>{advice.escalationPath}
                </div>
            )}

            {/* Outcome */}
            {advice.likelyOutcome && (
                <p style={{ fontSize: 11, color: '#9c9790', fontStyle: 'italic' }}>{advice.likelyOutcome}</p>
            )}
        </div>
    );
}


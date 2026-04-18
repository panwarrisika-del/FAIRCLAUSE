import { useState, useEffect } from 'react';

import { getNegotiationAdvice } from '../api/claude';

export default function NegotiationPanel({ clause, contractType }) {

    const [advice, setAdvice] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    useEffect(() => {

        getNegotiationAdvice(clause, contractType)

            .then(setAdvice)

            .catch(() => setError('Could not generate advice.'))

            .finally(() => setLoading(false));

    }, []);

    if (loading) return (

        <div className="flex items-center gap-2 text-xs opacity-40 py-3">

            <div className="w-3 h-3 border border-[var(--ink)] border-t-transparent rounded-full animate-spin" />

            Consulting Indian law database…

        </div>

    );

    if (error) return <p className="text-xs text-[var(--critical)] py-2">{error}</p>;

    if (!advice) return null;

    return (

        <div className="bg-white/70 rounded-xl p-4 space-y-4 animate-fade-in border border-black/5">

            {/* Counter clause */}

            {advice.counterClause && (

                <div>

                    <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-2">Suggested Counter-Clause</p>

                    <p className="font-mono text-xs bg-[var(--paper-mid)] border border-[var(--border)] p-3 rounded-lg leading-relaxed italic">

                        "{advice.counterClause}"

                    </p>

                </div>

            )}

            {/* Talking points */}

            {advice.talkingPoints?.length > 0 && (

                <div>

                    <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-2">What To Say</p>

                    <ul className="space-y-2">

                        {advice.talkingPoints.map((p, i) => (

                            <li key={i} className="text-sm flex gap-2 leading-snug">

                                <span className="text-[var(--green-india)] font-bold shrink-0">✓</span>{p}

                            </li>

                        ))}

                    </ul>

                </div>

            )}

            {/* Legal grounding */}

            {advice.legalGrounding && (

                <div className="bg-[var(--ashoka)] rounded-lg p-3">

                    <p className="font-mono text-xs text-white opacity-50 mb-1 uppercase tracking-wide">Legal Basis</p>

                    <p className="text-white text-sm opacity-90">{advice.legalGrounding}</p>

                </div>

            )}

            {/* Escalation path */}

            {advice.escalationPath && (

                <div className="text-xs bg-[var(--paper-mid)] p-2 rounded-lg opacity-60">

                    <strong>If they refuse:</strong> {advice.escalationPath}

                </div>

            )}

            {/* Outcome */}

            {advice.likelyOutcome && (

                <p className="text-xs opacity-50 italic">{advice.likelyOutcome}</p>

            )}

        </div>

    );

}


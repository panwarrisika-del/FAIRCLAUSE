import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const GRADE_META = {

    A: { color: '#2d7a4f', label: 'Safe' },

    B: { color: '#4a9e6a', label: 'Mostly Safe' },

    C: { color: '#c49a2a', label: 'Risky' },

    D: { color: '#e07b39', label: 'Very Risky' },

    F: { color: '#c0392b', label: 'Dangerous' },

};

const RISK_COLORS = { critical: '#c0392b', high: '#e07b39', medium: '#c49a2a', low: '#2d7a4f' };

export default function RiskDashboard({ analysis, contractType, fileName }) {

    const {

        clauses = [], missingClauses = [], overallScore = 50, letterGrade = 'C',

        partyBias = 50, executiveSummary = [], indianLawsViolated = [],

        jurisdiction = 'India', consumerForumAdvice = ''

    } = analysis;

    const gradeMeta = GRADE_META[letterGrade] || GRADE_META.C;

    const counts = clauses.reduce((acc, c) => {

        acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1; return acc;

    }, {});

    const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));

    const catCounts = clauses.reduce((acc, c) => {

        acc[c.riskCategory] = (acc[c.riskCategory] || 0) + 1; return acc;

    }, {});

    const radarData = Object.entries(catCounts).map(([subject, A]) => ({ subject, A }));

    return (

        <div className="space-y-5 animate-fade-in">

            {/* Header row */}

            <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">

                <div>

                    <p className="font-mono text-xs opacity-40 uppercase tracking-widest mb-1">{jurisdiction}</p>

                    <h2 className="font-display text-xl font-bold truncate max-w-[240px]">{fileName}</h2>

                    <p className="text-xs opacity-40 mt-1 capitalize">{contractType} agreement</p>

                </div>

                <div className="text-right">

                    <div style={{ color: gradeMeta.color }} className="font-display text-6xl font-extrabold leading-none">{letterGrade}</div>

                    <div className="text-xs font-mono mt-1" style={{ color: gradeMeta.color }}>{gradeMeta.label}</div>

                </div>

            </div>

            {/* Score cards */}

            <div className="grid grid-cols-2 gap-3">

                <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">

                    <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-3">Safety Score</p>

                    <div className="flex items-end gap-1">

                        <span className="font-display text-4xl font-bold" style={{ color: gradeMeta.color }}>{overallScore}</span>

                        <span className="opacity-30 text-sm mb-1">/100</span>

                    </div>

                    <div className="mt-3 h-2 bg-[var(--paper-dark)] rounded-full overflow-hidden">

                        <div className="h-full rounded-full" style={{ width: `${overallScore}%`, background: gradeMeta.color, transition: 'width 1s ease' }} />

                    </div>

                    <p className="text-xs opacity-40 mt-2">100 = fully safe · 0 = very dangerous</p>

                </div>

                <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">

                    <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-3">Power Imbalance</p>

                    <div className="flex justify-between text-xs mb-1 opacity-50">

                        <span>You</span><span>Other Party</span>

                    </div>

                    <div className="h-4 bg-[var(--paper-dark)] rounded-full overflow-hidden relative">

                        <div className="h-full rounded-full transition-all duration-700"

                            style={{ width: `${partyBias}%`, background: `linear-gradient(90deg, var(--green-india), var(--saffron) 60%, var(--critical))` }} />

                        <div className="absolute inset-y-0 w-0.5 bg-[var(--ink)] opacity-20" style={{ left: '50%' }} />

                    </div>

                    <p className="text-xs opacity-50 mt-2 text-center">

                        {partyBias > 70 ? '⚠ Heavily one-sided against you' :

                            partyBias > 50 ? 'Somewhat skewed against you' :

                                partyBias > 40 ? 'Roughly balanced' : 'Leans in your favour'}

                    </p>

                </div>

            </div>

            {/* Risk count row */}

            <div className="grid grid-cols-4 gap-2">

                {['critical', 'high', 'medium', 'low'].map(level => (

                    <div key={level} className={`risk-${level} rounded-xl p-3 text-center`}>

                        <div className="font-display text-2xl font-bold" style={{ color: RISK_COLORS[level] }}>{counts[level] || 0}</div>

                        <div className="text-xs capitalize opacity-60 mt-0.5">{level}</div>

                    </div>

                ))}

            </div>

            {/* Violated laws */}

            {indianLawsViolated.length > 0 && (

                <div className="bg-white border-2 border-[var(--critical)] rounded-2xl p-5">

                    <p className="font-mono text-xs text-[var(--critical)] uppercase tracking-wider mb-3">⚖️ Potential Indian Law Violations</p>

                    <ul className="space-y-1">

                        {indianLawsViolated.map((law, i) => (

                            <li key={i} className="flex gap-2 text-sm">

                                <span style={{ color: 'var(--critical)' }}>•</span>

                                <span className="font-mono text-xs">{law}</span>

                            </li>

                        ))}

                    </ul>

                    <p className="text-xs opacity-40 mt-3">AI-flagged potential violations — not confirmed legal conclusions. Verify with an advocate.</p>

                </div>

            )}

            {/* Missing clauses */}

            {missingClauses.length > 0 && (

                <div className="bg-[#fef6f0] border border-[var(--high)] rounded-2xl p-5">

                    <p className="font-semibold text-sm text-[var(--high)] mb-2">⚠ {missingClauses.length} Important Clause{missingClauses.length > 1 ? 's' : ''} Are Missing</p>

                    <ul className="space-y-1 text-sm">

                        {missingClauses.map(m => (

                            <li key={m.id} className="flex gap-2 opacity-70">

                                <span>→</span><span>{m.name}</span>

                            </li>

                        ))}

                    </ul>

                </div>

            )}

            {/* Executive summary */}

            <div className="bg-white rounded-2xl p-5 border border-[var(--border)]">

                <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-4">What This Contract Means For You</p>

                <ul className="space-y-3">

                    {executiveSummary.map((point, i) => (

                        <li key={i} className="flex gap-3 text-sm">

                            <span className="text-[var(--saffron)] font-bold shrink-0 mt-0.5">→</span>

                            <span className="leading-relaxed">{point}</span>

                        </li>

                    ))}

                </ul>

            </div>

            {/* Consumer forum advice */}

            {consumerForumAdvice && (

                <div className="bg-[var(--ashoka)] bg-opacity-5 border border-[var(--ashoka)] border-opacity-20 rounded-xl p-4 text-sm">

                    <span className="font-semibold opacity-70">Legal Escalation: </span>

                    <span className="opacity-60">{consumerForumAdvice}</span>

                </div>

            )}

            {/* Charts */}

            {pieData.length > 0 && (

                <div className="grid grid-cols-2 gap-3">

                    <div className="bg-white rounded-2xl p-4 border border-[var(--border)]">

                        <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-2">Risk Mix</p>

                        <ResponsiveContainer width="100%" height={150}>

                            <PieChart>

                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={62} dataKey="value" paddingAngle={3}>

                                    {pieData.map((entry, i) => (

                                        <Cell key={i} fill={RISK_COLORS[entry.name] || '#aaa'} />

                                    ))}

                                </Pie>

                                <Tooltip formatter={(v, n) => [`${v} clause${v > 1 ? 's' : ''}`, n]} />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                    {radarData.length >= 3 && (

                        <div className="bg-white rounded-2xl p-4 border border-[var(--border)]">

                            <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-2">By Category</p>

                            <ResponsiveContainer width="100%" height={150}>

                                <RadarChart data={radarData}>

                                    <PolarGrid stroke="var(--border)" />

                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8 }} />

                                    <Radar dataKey="A" stroke="var(--saffron)" fill="var(--saffron)" fillOpacity={0.2} />

                                </RadarChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

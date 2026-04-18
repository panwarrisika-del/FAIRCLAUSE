import { useState } from 'react';

import { ChevronDown, ChevronUp, AlertTriangle, BookOpen, Zap } from 'lucide-react';

import BenchmarkBadge from './BenchmarkBadge';

import NegotiationPanel from './NegotiationPanel';

const LEVEL_META = {

    critical: { icon: '🔴', label: 'Critical Risk', cls: 'risk-critical' },

    high: { icon: '🟠', label: 'High Risk', cls: 'risk-high' },

    medium: { icon: '🟡', label: 'Medium Risk', cls: 'risk-medium' },

    low: { icon: '🟢', label: 'Low Risk', cls: 'risk-low' },

};

function ClauseCard({ clause, contractType }) {

    const [open, setOpen] = useState(false);

    const [showNeg, setShowNeg] = useState(false);

    const meta = LEVEL_META[clause.riskLevel] || LEVEL_META.medium;

    return (

        <div className={`${meta.cls} rounded-xl p-4 transition-all`}>

            <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(!open)}>

                <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2 mb-2">

                        <span className="text-sm">{meta.icon}</span>

                        <span className="font-mono text-xs opacity-50 uppercase tracking-wide">{meta.label}</span>

                        <span className="font-mono text-xs opacity-30 capitalize">{clause.riskCategory}</span>

                        {clause.benchmarkPercentile != null && clause.benchmarkPercentile < 15 && (

                            <BenchmarkBadge percentile={clause.benchmarkPercentile} />

                        )}

                    </div>

                    <p className="font-mono text-xs bg-black/5 rounded-lg p-2 leading-relaxed line-clamp-2 italic">

                        "{clause.originalText}"

                    </p>

                    <p className="text-sm mt-2 font-medium leading-snug">{clause.plainEnglish}</p>

                </div>

                <button className="opacity-30 shrink-0 mt-1">

                    {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}

                </button>

            </div>

            {open && (

                <div className="mt-4 pt-4 border-t border-black/10 space-y-3 animate-fade-in">

                    {/* Why dangerous */}

                    <div className="flex gap-2 text-sm">

                        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[var(--saffron)]" />

                        <div><span className="font-semibold">Why this is risky: </span>{clause.whyDangerous}</div>

                    </div>

                    {/* Indian law citation */}

                    {clause.lawCitation && (

                        <div className="bg-[var(--ashoka)] rounded-xl p-3 flex gap-2">

                            <BookOpen size={14} className="text-white opacity-70 shrink-0 mt-0.5" />

                            <div>

                                <p className="font-mono text-xs text-white opacity-60 mb-0.5">{clause.relevantLaw}</p>

                                <p className="text-white text-sm opacity-90">{clause.lawCitation}</p>

                            </div>

                        </div>

                    )}

                    {/* Benchmark note */}

                    {clause.benchmarkNote && (

                        <div className="bg-black/5 rounded-lg p-3 text-sm opacity-70 italic">

                            📊 {clause.benchmarkNote}

                        </div>

                    )}

                    {/* Section label */}

                    {clause.section && (

                        <p className="text-xs opacity-40 font-mono">Contract section: {clause.section}</p>

                    )}

                    {/* Negotiation toggle */}

                    <button

                        onClick={e => { e.stopPropagation(); setShowNeg(!showNeg); }}

                        className="flex items-center gap-1.5 text-xs font-semibold bg-[var(--ink)] text-white rounded-lg px-3 py-2 hover:opacity-80 transition">

                        <Zap size={11} /> Get Negotiation Script

                    </button>

                    {showNeg && (

                        <NegotiationPanel clause={clause} contractType={contractType} />

                    )}

                </div>

            )}

        </div>

    );

}

function MissingCard({ clause }) {

    return (

        <div className="risk-high rounded-xl p-4">

            <p className="font-semibold text-sm">🚫 Missing Clause: {clause.name}</p>

            <p className="text-sm opacity-70 mt-1 leading-relaxed">{clause.whyImportant}</p>

            {clause.legalRequirement && (

                <p className="font-mono text-xs opacity-50 mt-2">Legal basis: {clause.legalRequirement}</p>

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

    return (

        <div className="space-y-4">

            {/* Filter tabs */}

            <div className="flex gap-1 bg-[var(--paper-dark)] p-1 rounded-xl overflow-x-auto">

                {levels.map(l => (

                    <button key={l} onClick={() => setFilter(l)}

                        className={`flex-shrink-0 px-3 py-1.5 text-xs rounded-lg capitalize font-medium transition-all ${filter === l ? 'bg-white shadow-sm text-[var(--ink)]' : 'opacity-40 hover:opacity-60'

                            }`}>

                        {l === 'all' ? `All (${counts.all})` : `${l} (${counts[l]})`}

                    </button>

                ))}

            </div>

            {/* Clauses */}

            <div className="space-y-3">

                {filtered.length === 0 && (

                    <p className="text-center opacity-40 py-8 text-sm">No {filter} risk clauses found.</p>

                )}

                {filtered.map(c => (

                    <ClauseCard key={c.id} clause={c} contractType={contractType} />

                ))}

            </div>

            {/* Missing clauses */}

            {missingClauses.length > 0 && (filter === 'all' || filter === 'high') && (

                <div className="pt-2">

                    <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-3">Missing Protections</p>

                    <div className="space-y-3">

                        {missingClauses.map(m => <MissingCard key={m.id} clause={m} />)}

                    </div>

                </div>

            )}

        </div>

    );

}


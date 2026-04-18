import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Scale, FileText } from 'lucide-react';

function SignScore({ analysis }) {
    const { overallScore = 50, partyBias = 50, clauses = [], missingClauses = [] } = analysis;

    const criticalCount = clauses.filter(c => c.riskLevel === 'critical').length;
    const highCount = clauses.filter(c => c.riskLevel === 'high').length;
    const missingCount = missingClauses.length;

    // Calculate "should you sign" score 0-100
    let signScore = overallScore;
    signScore -= criticalCount * 12;
    signScore -= highCount * 5;
    signScore -= missingCount * 4;
    signScore -= (partyBias - 50) * 0.3;
    signScore = Math.max(0, Math.min(100, Math.round(signScore)));

    const verdict = signScore >= 70
        ? { label: 'Looks Reasonable to Sign', color: 'var(--green-india)', icon: CheckCircle, bg: '#f0f8f4', border: '#2d7a4f' }
        : signScore >= 45
            ? { label: 'Sign Only After Negotiating', color: 'var(--medium)', icon: AlertTriangle, bg: '#fefbf0', border: '#c49a2a' }
            : { label: 'Do Not Sign As-Is', color: 'var(--critical)', icon: XCircle, bg: '#fdf1f0', border: '#c0392b' };

    const Icon = verdict.icon;

    return (
        <div className="rounded-2xl border-2 p-6 text-center space-y-4 animate-count-up"
            style={{ background: verdict.bg, borderColor: verdict.border }}>
            <Icon size={40} className="mx-auto" style={{ color: verdict.color }} />
            <div>
                <p className="font-display font-extrabold text-2xl" style={{ color: verdict.color }}>
                    {verdict.label}
                </p>
                <p className="text-sm opacity-60 mt-1">Based on AI analysis of Indian law standards</p>
            </div>

            {/* Score meter */}
            <div className="max-w-xs mx-auto">
                <div className="flex justify-between text-xs opacity-50 mb-1">
                    <span>Don't Sign</span>
                    <span>Safe to Sign</span>
                </div>
                <div className="h-3 bg-white rounded-full border border-black/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${signScore}%`, background: `linear-gradient(90deg, var(--critical), var(--medium), var(--green-india))` }} />
                </div>
                <p className="font-mono text-xs font-bold mt-1 text-center" style={{ color: verdict.color }}>
                    {signScore}% Sign Confidence
                </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                    { label: 'Critical Issues', value: criticalCount, color: 'var(--critical)' },
                    { label: 'High Risks', value: highCount, color: 'var(--high)' },
                    { label: 'Missing Clauses', value: missingCount, color: 'var(--medium)' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-3 border border-black/5">
                        <p className="font-display font-extrabold text-2xl" style={{ color: s.color }}>{s.value}</p>
                        <p className="font-mono text-xs opacity-50 mt-0.5 leading-tight">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PlainEnglishSummary({ analysis, userRole }) {
    const { executiveSummary = [], consumerForumAdvice, jurisdiction, indianLawsViolated = [] } = analysis;

    const roleAdvice = {
        tenant: 'As a tenant, your main protections come from the Model Tenancy Act 2021 and state rent control laws.',
        employee: 'As an employee, the Code on Wages 2019 and Industrial Disputes Act protect your basic rights.',
        gig: 'As a gig worker, the Code on Social Security 2020 gives you rights even without an employment contract.',
        borrower: 'As a borrower, RBI Fair Practices Code protects you from hidden charges and unfair collection.',
        other: 'The Consumer Protection Act 2019 and Contract Act 1872 protect you in most Indian agreements.',
    };

    return (
        <div className="space-y-4">

            {/* Plain English */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <FileText size={16} className="text-[var(--saffron)]" />
                    <p className="font-display font-bold text-base">What This Contract Actually Means</p>
                </div>
                <div className="space-y-3">
                    {executiveSummary.map((point, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="w-6 h-6 rounded-full bg-[var(--saffron)]/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="font-mono text-xs font-bold text-[var(--saffron)]">{i + 1}</span>
                            </div>
                            <p className="text-sm leading-relaxed opacity-80">{point}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your rights as role */}
            {userRole && roleAdvice[userRole] && (
                <div className="rounded-xl border border-[var(--ashoka)]/20 bg-[var(--ashoka)]/5 p-4">
                    <p className="font-mono text-xs text-[var(--ashoka)] font-bold uppercase tracking-wide mb-1">
                        Your Rights as a {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </p>
                    <p className="text-sm opacity-80 leading-relaxed">{roleAdvice[userRole]}</p>
                </div>
            )}

            {/* Laws violated */}
            {indianLawsViolated.length > 0 && (
                <div className="rounded-xl border border-[var(--critical)]/20 bg-[var(--critical)]/5 p-4">
                    <p className="font-mono text-xs text-[var(--critical)] font-bold uppercase tracking-wide mb-2">
                        ⚖ Potential Indian Law Issues
                    </p>
                    <div className="space-y-1">
                        {indianLawsViolated.map((law, i) => (
                            <p key={i} className="text-sm font-medium">· {law}</p>
                        ))}
                    </div>
                    <p className="text-xs opacity-50 mt-2">AI-flagged — verify with an advocate.</p>
                </div>
            )}

            {/* Jurisdiction */}
            {jurisdiction && (
                <div className="flex items-center gap-2 text-xs opacity-40">
                    <Scale size={12} />
                    <span>{jurisdiction}</span>
                </div>
            )}

            {/* Consumer forum advice */}
            {consumerForumAdvice && (
                <div className="rounded-xl bg-[var(--paper-mid)] border border-[var(--border)] p-4">
                    <p className="font-mono text-xs opacity-40 uppercase tracking-wide mb-1">Legal Escalation</p>
                    <p className="text-sm opacity-70 leading-relaxed">{consumerForumAdvice}</p>
                </div>
            )}
        </div>
    );
}

export default function SummaryPanel({ analysis, userRole }) {
    const [tab, setTab] = useState('verdict');

    return (
        <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-1 bg-[var(--paper-mid)] rounded-xl p-1">
                {[
                    { key: 'verdict', label: '✅ Should I Sign?' },
                    { key: 'summary', label: '📋 Plain English' },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${tab === t.key
                                ? 'bg-white shadow-sm text-[var(--saffron)]'
                                : 'opacity-50 hover:opacity-80'
                            }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'verdict' && <SignScore analysis={analysis} />}
            {tab === 'summary' && <PlainEnglishSummary analysis={analysis} userRole={userRole} />}
        </div>
    );
}
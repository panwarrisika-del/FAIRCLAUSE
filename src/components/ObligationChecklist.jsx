import { useState } from 'react';

import { CheckCircle2, Circle, IndianRupee, Calendar, Clock } from 'lucide-react';

const PRIORITY_COLOR = { high: 'var(--critical)', medium: 'var(--medium)', low: 'var(--low)' };

const TYPE_ICONS = { payment: IndianRupee, deadline: Calendar, renewal: Clock, notice: Clock };

export default function ObligationChecklist({ obligations = [] }) {

    const [checked, setChecked] = useState({});

    if (!obligations.length) return (

        <p className="text-center opacity-40 py-10 text-sm">No obligations extracted.</p>

    );

    return (

        <div className="space-y-2">

            <p className="font-mono text-xs opacity-40 uppercase tracking-wider mb-4">

                Your Obligations Under This Agreement

            </p>

            {obligations.map((ob, i) => {

                const done = checked[i];

                const Icon = TYPE_ICONS[ob.type] || Circle;

                return (

                    <div key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))}

                        className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all ${done

                                ? 'opacity-40 border-[var(--border)] bg-white'

                                : 'bg-white border-[var(--border)] hover:border-[var(--saffron)]'

                            }`}>

                        <div className="mt-0.5 shrink-0">

                            {done

                                ? <CheckCircle2 size={17} color="var(--low)" />

                                : <Circle size={17} color={PRIORITY_COLOR[ob.priority] || '#999'} />}

                        </div>

                        <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-2 mb-0.5">

                                <Icon size={11} className="opacity-30" />

                                <span className="font-mono text-xs opacity-30 uppercase tracking-wide">{ob.type}</span>

                                {ob.priority === 'high' && (

                                    <span className="bg-[var(--critical)] text-white text-xs px-1.5 rounded font-bold">!</span>

                                )}

                            </div>

                            <p className={`text-sm font-medium leading-snug ${done ? 'line-through' : ''}`}>

                                {ob.description}

                            </p>

                            <div className="flex flex-wrap gap-3 mt-1 text-xs opacity-50">

                                {ob.amount && <span>💰 {ob.amount}</span>}

                                {ob.deadline && <span>📅 {ob.deadline}</span>}

                            </div>

                            {ob.consequence && !done && (

                                <p className="text-xs mt-1 opacity-60" style={{ color: 'var(--critical)' }}>

                                    If missed: {ob.consequence}

                                </p>

                            )}

                        </div>

                    </div>

                );

            })}

        </div>

    );

}


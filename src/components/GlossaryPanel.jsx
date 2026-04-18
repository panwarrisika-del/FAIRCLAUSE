import { useState } from 'react';

export default function GlossaryPanel({ terms = [] }) {

    const [query, setQuery] = useState('');

    const filtered = terms.filter(t =>

        t.term.toLowerCase().includes(query.toLowerCase())

    );

    return (

        <div className="space-y-3">

            <input

                value={query}

                onChange={e => setQuery(e.target.value)}

                placeholder="Search legal terms (e.g. indemnity, lien, force majeure)…"

                className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--saffron)]"

            />

            {filtered.length === 0 && (

                <p className="text-center opacity-40 py-10 text-sm">No terms found.</p>

            )}

            <div className="space-y-2">

                {filtered.map((t, i) => (

                    <div key={i} className="bg-white rounded-xl p-4 border border-[var(--border)] hover:border-[var(--saffron)] transition">

                        <p className="font-display font-bold text-[var(--saffron)] mb-1">{t.term}</p>

                        <p className="text-sm opacity-70 leading-relaxed">{t.definition}</p>

                    </div>

                ))}

            </div>

        </div>

    );

}


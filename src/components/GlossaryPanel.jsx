import { useState } from 'react';
import { Search } from 'lucide-react';

export default function GlossaryPanel({ terms = [] }) {
    const [query, setQuery] = useState('');
    const filtered = terms.filter(t =>
        t.term.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Search box */}
            <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9c9790', pointerEvents: 'none' }} />
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search legal terms (e.g. indemnity, lien, force majeure)..."
                    style={{
                        width: '100%', padding: '11px 14px 11px 38px',
                        borderRadius: 12, border: '1px solid var(--border)',
                        background: '#ffffff', color: 'var(--ink)',
                        fontSize: 13, outline: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'border-color 0.15s ease',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--saffron)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
            </div>

            {filtered.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9c9790', padding: '40px 0', fontSize: 13 }}>
                    No terms found.
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((t, i) => (
                    <div key={i} style={{
                        background: '#ffffff', borderRadius: 14, padding: '16px 18px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                    >
                        <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: 'var(--saffron)', marginBottom: 6 }}>
                            {t.term}
                        </p>
                        <p style={{ fontSize: 13, color: '#4a4540', lineHeight: 1.65 }}>
                            {t.definition}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { extractTextFromFile } from '../utils/pdfParser';

const LAWS = [
    'Model Tenancy Act 2021',
    'Code on Wages 2019',
    'Consumer Protection Act 2019',
    'DPDP Act 2023',
    'RBI Guidelines',
    'Gig Worker Rights',
    'Industrial Disputes Act',
];

const STATS = [
    { value: '6+', label: 'Indian Laws' },
    { value: '10K+', label: 'Contracts Benchmarked' },
    { value: '4', label: 'Contract Types' },
];

export default function UploadZone({ onTextExtracted }) {
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pasteMode, setPasteMode] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const inputRef = useRef();

    const handleFile = async (file) => {
        setLoading(true); setError('');
        try {
            const text = await extractTextFromFile(file);
            if (!text || text.trim().length < 80)
                throw new Error('File appears empty or unreadable. Try pasting the text instead.');
            onTextExtracted(text, file.name);
        } catch (e) {
            setError(e.message || 'Could not read file.');
        } finally { setLoading(false); }
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div style={{ maxWidth: 640, margin: '0 auto' }} className="animate-slide-up">

            {/* ── HERO ── */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>

                {/* India badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 24 }}>
                    <div style={{ width: 1, height: 20, background: 'var(--saffron)', borderRadius: 1 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--saffron)', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>
                        India-Only Legal Analysis
                    </span>
                    <div style={{ width: 1, height: 20, background: 'var(--saffron)', borderRadius: 1 }} />
                </div>

                {/* Main heading */}
                <h1 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(42px, 7vw, 64px)',
                    fontWeight: 900,
                    color: 'var(--ink)',
                    lineHeight: 1.08,
                    letterSpacing: '-0.02em',
                    marginBottom: 20,
                }}>
                    अपना Contract
                    <br />
                    <span style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>समझो।</span>
                </h1>

                <p style={{ fontSize: 15, color: '#6b6560', lineHeight: 1.7, maxWidth: 480, margin: '0 auto', marginBottom: 32 }}>
                    Upload your rental, employment, gig, or loan agreement.
                    Get instant risk analysis grounded in real Indian laws.
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{
                            padding: '10px 24px',
                            borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: 'var(--saffron)' }}>
                                {s.value}
                            </div>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#9c9790', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── DISCLAIMER ── */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: 'rgba(26,63,122,0.05)',
                border: '1px solid rgba(26,63,122,0.15)',
                borderRadius: 12, padding: '12px 16px',
                marginBottom: 24, fontSize: 12, color: '#3a4a6a',
            }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--ashoka)' }} />
                <span style={{ lineHeight: 1.6 }}>
                    <strong>Not legal advice.</strong> AI-generated analysis for informational purposes only.
                    For critical matters, consult a licensed Indian advocate or your local consumer forum.
                </span>
            </div>

            {/* ── UPLOAD / PASTE ── */}
            {!pasteMode ? (
                <>
                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !loading && inputRef.current.click()}
                        style={{
                            border: `2px dashed ${dragging ? 'var(--saffron)' : 'var(--border)'}`,
                            borderRadius: 18,
                            padding: '52px 32px',
                            textAlign: 'center',
                            cursor: loading ? 'default' : 'pointer',
                            background: dragging ? 'rgba(217,93,26,0.04)' : '#ffffff',
                            transition: 'all 0.2s ease',
                            boxShadow: dragging ? '0 0 0 4px rgba(217,93,26,0.08)' : 'var(--shadow-sm)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Decorative corner lines */}
                        {!loading && <>
                            <div style={{ position: 'absolute', top: 14, left: 14, width: 20, height: 20, borderTop: '2px solid var(--saffron)', borderLeft: '2px solid var(--saffron)', borderRadius: '3px 0 0 0', opacity: dragging ? 1 : 0.3 }} />
                            <div style={{ position: 'absolute', top: 14, right: 14, width: 20, height: 20, borderTop: '2px solid var(--saffron)', borderRight: '2px solid var(--saffron)', borderRadius: '0 3px 0 0', opacity: dragging ? 1 : 0.3 }} />
                            <div style={{ position: 'absolute', bottom: 14, left: 14, width: 20, height: 20, borderBottom: '2px solid var(--saffron)', borderLeft: '2px solid var(--saffron)', borderRadius: '0 0 0 3px', opacity: dragging ? 1 : 0.3 }} />
                            <div style={{ position: 'absolute', bottom: 14, right: 14, width: 20, height: 20, borderBottom: '2px solid var(--saffron)', borderRight: '2px solid var(--saffron)', borderRadius: '0 0 3px 0', opacity: dragging ? 1 : 0.3 }} />
                        </>}

                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, border: '3px solid var(--paper-dark)', borderTopColor: 'var(--saffron)', borderRadius: '50%' }} className="animate-spin" />
                                <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>Reading your document…</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 16,
                                    background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8db 100%)',
                                    border: '1px solid rgba(217,93,26,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(217,93,26,0.12)',
                                }} className="animate-float">
                                    <Upload size={26} style={{ color: 'var(--saffron)' }} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 16, marginBottom: 4 }}>
                                        {dragging ? 'Drop it here' : 'Drop your agreement here'}
                                    </p>
                                    <p style={{ fontSize: 12, color: '#9c9790' }}>
                                        PDF, DOCX or TXT · Rental · Employment · Loan · Gig
                                    </p>
                                </div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: 'var(--saffron)', color: '#fff',
                                    padding: '9px 20px', borderRadius: 10,
                                    fontSize: 13, fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(217,93,26,0.3)',
                                }}>
                                    <Upload size={13} /> Browse file
                                </div>
                            </div>
                        )}
                    </div>

                    <input ref={inputRef} type="file" accept=".pdf,.txt,.docx" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#b0a99e', letterSpacing: '0.1em' }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
                    </div>

                    {/* Paste button */}
                    <button onClick={() => setPasteMode(true)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        border: '1px solid var(--border)', borderRadius: 12, padding: '13px',
                        fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)',
                        background: '#fff', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.color = 'var(--saffron)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--ink-soft)'; }}
                    >
                        <FileText size={14} /> Paste contract text
                        <ArrowRight size={13} style={{ marginLeft: 4, opacity: 0.5 }} />
                    </button>
                </>

            ) : (
                /* ── PASTE MODE ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <textarea
                        value={pasteText}
                        onChange={e => setPasteText(e.target.value)}
                        placeholder="Paste your agreement text here... (Hindi, English, or Hinglish all work)"
                        style={{
                            width: '100%', height: 220,
                            border: '1px solid var(--border)', borderRadius: 14,
                            padding: '16px', fontFamily: "'DM Mono', monospace",
                            fontSize: 12, color: 'var(--ink)', background: '#fff',
                            resize: 'none', outline: 'none', lineHeight: 1.7,
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'border-color 0.15s ease',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--saffron)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setPasteMode(false)} className="btn-ghost" style={{ flex: 1, padding: '12px' }}>
                            Cancel
                        </button>
                        <button
                            onClick={() => pasteText.trim().length > 80 && onTextExtracted(pasteText, 'Pasted Agreement')}
                            disabled={pasteText.trim().length < 80}
                            className="btn-primary"
                            style={{
                                flex: 1, opacity: pasteText.trim().length < 80 ? 0.4 : 1,
                                cursor: pasteText.trim().length < 80 ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}>
                            Analyse <ArrowRight size={14} />
                        </button>
                    </div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#b0a99e', textAlign: 'center' }}>
                        {pasteText.trim().length} / 80 characters minimum
                    </p>
                </div>
            )}

            {error && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--critical-bg)', border: '1px solid var(--critical)', borderRadius: 10, fontSize: 13, color: 'var(--critical)', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {/* ── LAW CHIPS ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 36 }}>
                {LAWS.map(f => (
                    <span key={f} style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10, letterSpacing: '0.04em',
                        background: '#fff', border: '1px solid var(--border-light)',
                        color: '#9c9790', padding: '4px 12px', borderRadius: 999,
                    }}>
                        {f}
                    </span>
                ))}
            </div>

            {/* Privacy */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
                <Shield size={10} style={{ color: '#c8c1b6' }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c8c1b6', letterSpacing: '0.06em' }}>
                    Documents are analysed in-session and never stored
                </span>
            </div>
        </div>
    );
}
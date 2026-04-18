import { useState, useRef } from 'react';
import { Upload, FileText, Shield, Lock } from 'lucide-react';

const USER_ROLES = [
    { value: 'tenant', label: '🏠 Tenant', desc: 'Reviewing a rental or lease agreement' },
    { value: 'employee', label: '💼 Employee', desc: 'Reviewing a job or employment offer' },
    { value: 'gig', label: '🛵 Gig Worker', desc: 'Reviewing a platform or freelance contract' },
    { value: 'borrower', label: '💰 Borrower', desc: 'Reviewing a loan or credit agreement' },
    { value: 'other', label: '📄 Other', desc: 'Some other kind of agreement' },
];

export default function UploadZone({ onTextExtracted }) {
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pasting, setPasting] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const [role, setRole] = useState('');
    const [roleError, setRoleError] = useState(false);
    const fileRef = useRef();

    const checkRole = () => {
        if (!role) { setRoleError(true); return false; }
        setRoleError(false);
        return true;
    };

    const processFile = async (file) => {
        if (!checkRole()) return;
        setLoading(true);
        try {
            if (file.type === 'application/pdf') {
                const { extractTextFromPDF } = await import('../utils/pdfParser');
                const text = await extractTextFromPDF(file);
                onTextExtracted(text, file.name, role);
            } else {
                const text = await file.text();
                onTextExtracted(text, file.name, role);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handlePasteSubmit = () => {
        if (!checkRole()) return;
        if (pasteText.trim().length < 50) return;
        onTextExtracted(pasteText, 'Pasted Agreement', role);
    };

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Hero */}
            <div className="text-center pt-6 pb-2">
                <div className="inline-flex items-center gap-2 bg-[var(--saffron)]/10 border border-[var(--saffron)]/20 rounded-full px-4 py-1.5 mb-5">
                    <span className="font-mono text-xs text-[var(--saffron)] font-semibold tracking-widest uppercase">India-Only Legal Analysis</span>
                </div>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-tight mb-3">
                    अपना Contract
                    <br />
                    <span style={{ color: 'var(--saffron)' }}>समझो।</span>
                </h1>
                <p className="text-base opacity-60 max-w-md mx-auto leading-relaxed">
                    Upload your rental, employment, gig, or loan agreement.
                    Get instant risk analysis grounded in real Indian laws.
                </p>
            </div>

            {/* Step 1 — Who are you */}
            <div className="card">
                <p className="font-display font-bold text-base mb-1">
                    <span className="text-[var(--saffron)]">Step 1</span> — Who are you in this agreement?
                </p>
                <p className="text-xs opacity-50 mb-4">This helps us tailor the analysis to your specific rights under Indian law.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {USER_ROLES.map(r => (
                        <button key={r.value} onClick={() => { setRole(r.value); setRoleError(false); }}
                            className={`text-left p-3 rounded-xl border transition-all ${role === r.value
                                    ? 'border-[var(--saffron)] bg-[var(--saffron)]/5'
                                    : 'border-[var(--border)] bg-white hover:border-[var(--saffron)]/50'
                                }`}>
                            <p className="font-semibold text-sm">{r.label}</p>
                            <p className="text-xs opacity-50 mt-0.5">{r.desc}</p>
                        </button>
                    ))}
                </div>
                {roleError && (
                    <p className="text-xs text-[var(--critical)] mt-2">⚠ Please select your role before uploading.</p>
                )}
            </div>

            {/* Step 2 — Upload */}
            <div className="card">
                <p className="font-display font-bold text-base mb-4">
                    <span className="text-[var(--saffron)]">Step 2</span> — Upload your agreement
                </p>

                {!pasting ? (
                    <>
                        <div
                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center py-10 px-6 ${dragging
                                    ? 'border-[var(--saffron)] bg-[var(--saffron)]/5'
                                    : 'border-[var(--border)] hover:border-[var(--saffron)]/60 hover:bg-[var(--paper-mid)]'
                                }`}>
                            {loading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-[var(--saffron)] border-t-transparent rounded-full animate-spin" />
                                    <p className="text-sm opacity-50">Reading your document…</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-14 h-14 bg-[var(--saffron)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Upload size={24} color="var(--saffron)" />
                                    </div>
                                    <p className="font-display font-bold text-lg mb-1">Drop your agreement here</p>
                                    <p className="text-sm opacity-40">PDF or TXT · Rental · Employment · Loan · Gig</p>
                                </>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden"
                            onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }} />

                        <button onClick={() => setPasting(true)}
                            className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-xl text-sm hover:bg-[var(--paper-mid)] transition">
                            <FileText size={15} className="opacity-40" />
                            Paste contract text instead
                        </button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <textarea
                            value={pasteText}
                            onChange={e => setPasteText(e.target.value)}
                            placeholder="Paste your contract text here…"
                            rows={8}
                            className="w-full border border-[var(--border)] rounded-xl p-4 text-sm bg-white focus:outline-none focus:border-[var(--saffron)] resize-none leading-relaxed"
                        />
                        <div className="flex gap-2">
                            <button onClick={handlePasteSubmit}
                                disabled={pasteText.trim().length < 50}
                                className="flex-1 bg-[var(--saffron)] text-white rounded-xl py-3 font-semibold text-sm hover:opacity-90 transition disabled:opacity-30">
                                Analyse This Contract
                            </button>
                            <button onClick={() => setPasting(false)}
                                className="px-4 border border-[var(--border)] rounded-xl text-sm hover:bg-[var(--paper-mid)] transition">
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Privacy notice */}
            <div className="rounded-2xl border border-[var(--green-india)]/20 bg-[var(--green-india)]/5 p-4">
                <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-xl bg-[var(--green-india)]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield size={16} color="var(--green-india)" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-[var(--green-india)] mb-1">🔒 Your Privacy is Protected</p>
                        <p className="text-xs opacity-70 leading-relaxed">
                            We <strong>never store your documents</strong>. Your contract is analysed in-session only, encrypted in transit,
                            and permanently discarded after analysis. FairClause does not retain, share, or sell any document data.
                        </p>
                    </div>
                </div>
            </div>

            {/* Not legal advice */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-4 flex gap-3 items-start">
                <Lock size={15} className="opacity-30 mt-0.5 shrink-0" />
                <p className="text-xs opacity-50 leading-relaxed">
                    <strong>Not legal advice.</strong> AI-generated analysis for informational purposes only.
                    For critical matters, consult a licensed Indian advocate or approach your local consumer forum.
                </p>
            </div>

            {/* Law tags */}
            <div className="flex flex-wrap gap-2 justify-center pb-4">
                {['Model Tenancy Act', 'Code on Wages 2019', 'Consumer Protection Act 2019', 'DPDP Act 2023', 'RBI Guidelines', 'Gig Worker Rights'].map(tag => (
                    <span key={tag} className="font-mono text-xs opacity-30 border border-[var(--border)] px-2.5 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    );
}

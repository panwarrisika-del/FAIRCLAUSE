import { jsPDF } from 'jspdf';
import { Download, ExternalLink, Phone } from 'lucide-react';

const LEGAL_RESOURCES = [
    { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in', info: '1915 — free helpline for consumer disputes' },
    { name: 'eDaakhil — Online Consumer Forum', url: 'https://edaakhil.nic.in', info: 'File consumer complaints online' },
    { name: 'India Code (All Central Laws)', url: 'https://www.indiacode.nic.in', info: 'Read every Indian law for free' },
    { name: 'RBI Ombudsman', url: 'https://rbi.org.in/Scripts/Complaints.aspx', info: 'Banking and NBFC loan complaints' },
    { name: 'Labour Commissioner', url: 'https://labour.gov.in', info: 'File wage theft or labour law complaints' },
    { name: 'TRAI Consumer Portal', url: 'https://www.trai.gov.in', info: 'Telecom service agreement complaints' },
];

// Strip ALL characters that jsPDF / helvetica cannot render:
// emoji, unicode symbols, arrows, rupee sign, etc.
// Replace common ones with ASCII equivalents first, then strip the rest.
function safeText(str) {
    if (!str) return '';
    return String(str)
        // arrows
        .replace(/→|➔|►|▶/g, '->')
        .replace(/←/g, '<-')
        // bullets / dashes
        .replace(/•|·|‣|⁃/g, '-')
        .replace(/–|—/g, '-')
        // legal / warning symbols
        .replace(/⚖️?/g, '[LAW]')
        .replace(/⚠️?/g, '[!]')
        .replace(/🚫/g, '[MISSING]')
        .replace(/✓|✔/g, '[OK]')
        .replace(/✗|✘|✕/g, '[X]')
        // rupee
        .replace(/₹|Rs\.?/g, 'Rs.')
        // quotation marks
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        // ellipsis
        .replace(/…/g, '...')
        // strip any remaining non-Latin-1 characters (anything above U+00FF)
        // jsPDF helvetica only supports Latin-1
        .replace(/[^\x00-\xFF]/g, '')
        .trim();
}

export default function ExportPanel({ analysis, fileName, contractType }) {

    const exportPDF = () => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        const {
            clauses = [],
            missingClauses = [],
            overallScore = 0,
            letterGrade = 'N/A',
            partyBias = 50,
            executiveSummary = [],
            indianLawsViolated = [],
            jurisdiction = 'India',
        } = analysis;

        const PAGE_W = 210;
        const MARGIN = 15;
        const MAX_W = PAGE_W - MARGIN * 2;  // 180mm
        const PAGE_H = 297;
        const FOOT_Y = PAGE_H - 10;

        // ── helpers ──────────────────────────────────────────────────
        const checkPage = (neededMM = 10) => {
            if (y + neededMM > FOOT_Y - 4) {
                doc.addPage();
                y = 18;
            }
        };

        // Draws wrapped text, returns new y
        const addText = (rawText, x, opts = {}) => {
            const {
                size = 10,
                bold = false,
                color = [15, 14, 12],
                indent = 0,
            } = opts;

            const text = safeText(rawText);
            if (!text) return y;

            doc.setFontSize(size);
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.setTextColor(color[0], color[1], color[2]);

            const lines = doc.splitTextToSize(text, MAX_W - indent);
            const lineH = size * 0.42;

            lines.forEach(line => {
                checkPage(lineH + 1);
                doc.text(line, x + indent, y);
                y += lineH + 0.8;
            });
            return y;
        };

        const addDivider = (marginV = 3) => {
            y += marginV;
            checkPage(4);
            doc.setDrawColor(214, 208, 196);
            doc.setLineWidth(0.3);
            doc.line(MARGIN, y, PAGE_W - MARGIN, y);
            y += marginV;
        };

        const addSection = (title, colorArr = [15, 14, 12]) => {
            y += 5;
            checkPage(10);
            addText(title, MARGIN, { size: 13, bold: true, color: colorArr });
            y += 1;
        };

        // ── page 1 header bar ────────────────────────────────────────
        doc.setFillColor(232, 93, 30);   // saffron
        doc.rect(0, 0, PAGE_W, 12, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text('FAIRCLAUSE INDIA  |  AI-GENERATED REPORT  |  NOT LEGAL ADVICE', MARGIN, 8);

        let y = 20;

        // Title
        addText('Contract Risk Analysis Report', MARGIN, { size: 18, bold: true });
        y += 1;
        addText(
            `File: ${safeText(fileName)}  |  Type: ${safeText(contractType)}  |  ${safeText(jurisdiction)}`,
            MARGIN, { size: 9, color: [100, 100, 100] }
        );
        addText(
            `Grade: ${letterGrade}  |  Safety Score: ${overallScore}/100  |  Power Imbalance: ${partyBias}%`,
            MARGIN, { size: 9, bold: true, color: [100, 100, 100] }
        );
        addDivider(4);

        // ── Key Findings ─────────────────────────────────────────────
        if (executiveSummary.length > 0) {
            addSection('Key Findings');
            executiveSummary.forEach(s => {
                checkPage(8);
                addText(`- ${s}`, MARGIN, { size: 10, indent: 3 });
                y += 1;
            });
        }

        // ── Indian Law Violations ─────────────────────────────────────
        if (indianLawsViolated.length > 0) {
            addSection('Potential Indian Law Issues', [192, 57, 43]);
            indianLawsViolated.forEach(l => {
                checkPage(6);
                addText(`[LAW] ${l}`, MARGIN, { size: 9, color: [192, 57, 43], indent: 3 });
                y += 0.5;
            });
        }

        addDivider(4);

        // ── Flagged Clauses ───────────────────────────────────────────
        addSection('Flagged Clauses');
        clauses.forEach(c => {
            checkPage(30);

            const levelColor =
                c.riskLevel === 'critical' ? [192, 57, 43] :
                    c.riskLevel === 'high' ? [224, 123, 57] :
                        c.riskLevel === 'medium' ? [196, 154, 42] :
                            [45, 122, 79];

            // Level badge line
            addText(
                `[${(c.riskLevel || 'UNKNOWN').toUpperCase()}]  ${(c.riskCategory || '').toUpperCase()}`,
                MARGIN, { size: 9, bold: true, color: levelColor }
            );

            // Original clause text
            addText(`"${c.originalText}"`, MARGIN, { size: 8, color: [80, 80, 80], indent: 3 });

            // Why dangerous
            if (c.whyDangerous) {
                addText(`-> ${c.whyDangerous}`, MARGIN, { size: 9, color: [15, 14, 12], indent: 3 });
            }

            // Law citation
            if (c.lawCitation) {
                addText(`[LAW] ${c.lawCitation}`, MARGIN, { size: 8, color: [26, 77, 143], indent: 3 });
            }

            y += 3;
        });

        // ── Missing Clauses ───────────────────────────────────────────
        if (missingClauses.length > 0) {
            addDivider(4);
            addSection('Missing Protections', [224, 123, 57]);
            missingClauses.forEach(m => {
                checkPage(12);
                addText(`[MISSING] ${m.name}`, MARGIN, { size: 9, bold: true, color: [224, 123, 57], indent: 3 });
                if (m.whyImportant) {
                    addText(m.whyImportant, MARGIN, { size: 9, color: [15, 14, 12], indent: 6 });
                }
                y += 2;
            });
        }

        // ── Legal Resources ───────────────────────────────────────────
        addDivider(4);
        addSection('Free Indian Legal Resources');
        LEGAL_RESOURCES.forEach(r => {
            checkPage(8);
            addText(r.name, MARGIN, { size: 9, bold: true, indent: 3 });
            addText(r.info, MARGIN, { size: 8, color: [100, 100, 100], indent: 6 });
            y += 1;
        });

        // ── Footer on every page ──────────────────────────────────────
        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.setFont('helvetica', 'normal');
            doc.text(
                'This report is AI-generated and does not constitute legal advice. Consult a licensed Indian advocate.',
                MARGIN, FOOT_Y
            );
            doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, FOOT_Y, { align: 'right' });
        }

        const safeName = (fileName || 'contract').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
        doc.save(`FairClause-${safeName}.pdf`);
    };

    return (
        <div className="space-y-5">

            {/* Download card */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--border)] text-center">
                <Download size={28} className="mx-auto mb-3" style={{ color: 'var(--saffron)' }} />
                <p className="font-display text-xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
                    Download Risk Report
                </p>
                <p className="text-sm mb-5" style={{ color: '#6b6560' }}>
                    Full PDF with all flagged clauses, Indian law citations, and negotiation scripts.
                </p>
                <button onClick={exportPDF}
                    className="rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
                    style={{ background: 'var(--saffron)', color: '#ffffff' }}>
                    <Download size={15} /> Download PDF Report
                </button>
            </div>

            {/* Legal resources */}
            <div className="rounded-2xl p-5 border border-[var(--border)]" style={{ background: 'var(--paper-mid)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--ink)' }}>
                    Indian Legal Resources
                </p>
                <p className="text-sm mb-4" style={{ color: '#6b6560' }}>
                    For critical-risk contracts, these are your free options in India:
                </p>
                <div className="space-y-3">
                    {LEGAL_RESOURCES.map(r => (
                        <a key={r.name} href={r.url} target="_blank" rel="noreferrer"
                            className="flex items-start gap-3 p-3 rounded-xl transition group"
                            style={{ background: '#ffffff', border: '1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--saffron)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <ExternalLink size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--ashoka)' }} />
                            <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{r.name}</p>
                                <p className="text-xs" style={{ color: '#9c9790' }}>{r.info}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Helpline callout */}
            <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: 'var(--saffron)' }}>
                <Phone size={28} className="shrink-0" style={{ color: 'rgba(255,255,255,0.85)' }} />
                <div>
                    <p className="font-display font-bold text-lg" style={{ color: '#ffffff' }}>
                        National Consumer Helpline
                    </p>
                    <p className="text-2xl font-mono font-extrabold tracking-widest" style={{ color: '#ffffff' }}>
                        1915
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Free · Toll-free · Available in Hindi + regional languages
                    </p>
                </div>
            </div>
        </div>
    );
}
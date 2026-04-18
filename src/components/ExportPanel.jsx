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

export default function ExportPanel({ analysis, fileName, contractType }) {

    const exportPDF = () => {

        const doc = new jsPDF();

        const {

            clauses = [], missingClauses = [], overallScore, letterGrade,

            partyBias, executiveSummary = [], indianLawsViolated = [], jurisdiction

        } = analysis;

        const addText = (text, x, y, opts = {}) => {

            const { size = 10, bold = false, color = [15, 14, 12] } = opts;

            doc.setFontSize(size);

            doc.setFont('helvetica', bold ? 'bold' : 'normal');

            doc.setTextColor(...color);

            const lines = doc.splitTextToSize(text, 170);

            doc.text(lines, x, y);

            return y + lines.length * (size * 0.42) + 3;

        };

        let y = 18;

        // Header bar

        doc.setFillColor(232, 93, 30);

        doc.rect(0, 0, 210, 12, 'F');

        doc.setTextColor(255, 255, 255);

        doc.setFontSize(7);

        doc.setFont('helvetica', 'bold');

        doc.text('FAIRCLAUSE INDIA · AI-GENERATED REPORT · NOT LEGAL ADVICE', 15, 8);

        y = 20;

        y = addText('Contract Risk Analysis Report', 15, y, { size: 18, bold: true });

        y = addText(`File: ${fileName}  |  Type: ${contractType}  |  ${jurisdiction}`, 15, y, { size: 9, color: [100, 100, 100] });

        y = addText(`Grade: ${letterGrade}  |  Safety Score: ${overallScore}/100  |  Power Imbalance: ${partyBias}%`, 15, y, { size: 9, color: [100, 100, 100] });

        y += 4;

        y = addText('Key Findings', 15, y, { size: 13, bold: true });

        executiveSummary.forEach(s => { y = addText(`• ${s}`, 18, y); });

        y += 4;

        if (indianLawsViolated.length > 0) {

            y = addText('Potential Indian Law Issues', 15, y, { size: 12, bold: true, color: [192, 57, 43] });

            indianLawsViolated.forEach(l => { y = addText(`⚖ ${l}`, 18, y, { color: [192, 57, 43] }); });

            y += 4;

        }

        y = addText('Flagged Clauses', 15, y, { size: 12, bold: true });

        clauses.forEach(c => {

            if (y > 265) { doc.addPage(); y = 15; }

            y = addText(`[${c.riskLevel.toUpperCase()}] ${c.riskCategory?.toUpperCase()}`, 15, y, { size: 9, bold: true });

            y = addText(`"${c.originalText}"`, 15, y, { size: 8, color: [80, 80, 80] });

            y = addText(`→ ${c.whyDangerous}`, 15, y, { size: 9 });

            if (c.lawCitation) y = addText(`⚖ ${c.lawCitation}`, 15, y, { size: 8, color: [26, 77, 143] });

            y += 2;

        });

        if (missingClauses.length > 0) {

            if (y > 250) { doc.addPage(); y = 15; }

            y = addText('Missing Protections', 15, y, { size: 12, bold: true });

            missingClauses.forEach(m => {

                y = addText(`🚫 ${m.name}: ${m.whyImportant}`, 15, y);

            });

        }

        // Footer

        doc.setFontSize(7);

        doc.setTextColor(150, 150, 150);

        doc.text('This report is AI-generated and does not constitute legal advice. Consult a licensed Indian advocate for critical decisions.', 15, 287);

        doc.save(`FairClause-${fileName.replace(/\.[^/.]+$/, '')}.pdf`);

    };

    return (

        <div className="space-y-5">

            {/* Download */}

            <div className="bg-white rounded-2xl p-6 border border-[var(--border)] text-center">

                <Download size={28} className="mx-auto text-[var(--saffron)] mb-3" />

                <p className="font-display text-xl font-bold mb-1">Download Risk Report</p>

                <p className="text-sm opacity-50 mb-5">Full PDF with all flagged clauses, Indian law citations, and negotiation scripts.</p>

                <button onClick={exportPDF}

                    className="bg-[var(--saffron)] text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition inline-flex items-center gap-2">

                    <Download size={15} /> Download PDF Report

                </button>

            </div>

            {/* Legal resources */}

            <div className="bg-[var(--paper-mid)] rounded-2xl p-5 border border-[var(--border)]">

                <p className="font-semibold text-sm mb-1">🇮🇳 Indian Legal Resources</p>

                <p className="text-sm opacity-50 mb-4">For critical-risk contracts, these are your free options in India:</p>

                <div className="space-y-3">

                    {LEGAL_RESOURCES.map(r => (

                        <a key={r.name} href={r.url} target="_blank" rel="noreferrer"

                            className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[var(--border)] hover:border-[var(--saffron)] transition group">

                            <ExternalLink size={14} className="mt-0.5 shrink-0 text-[var(--ashoka)] group-hover:text-[var(--saffron)] transition" />

                            <div>

                                <p className="text-sm font-medium">{r.name}</p>

                                <p className="text-xs opacity-50">{r.info}</p>

                            </div>

                        </a>

                    ))}

                </div>

            </div>

            {/* Helpline callout */}

            <div className="bg-[var(--saffron)] rounded-2xl p-5 text-white flex items-center gap-4">

                <Phone size={28} className="shrink-0 opacity-80" />

                <div>

                    <p className="font-display font-bold text-lg">National Consumer Helpline</p>

                    <p className="text-2xl font-mono font-extrabold tracking-widest">1915</p>

                    <p className="text-sm opacity-80">Free · Toll-free · Available in Hindi + regional languages</p>

                </div>

            </div>

        </div>

    );

}

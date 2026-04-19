import { useState } from 'react';
import UploadZone from './components/UploadZone';
import SummaryTab from './components/SummaryTab';
import RiskDashboard from './components/RiskDashboard';
import RiskHeatmap from './components/RiskHeatmap';
import SideBySideView from './components/SideBySideView';
import ClauseViewer from './components/ClauseViewer';
import ObligationChecklist from './components/ObligationChecklist';
import GlossaryPanel from './components/GlossaryPanel';
import ExportPanel from './components/ExportPanel';
import {
  detectContractType, analyzeRisks,
  extractObligations, buildGlossary
} from './api/claude';

const TABS = ['Summary', 'Overview', 'Heatmap', 'Side-by-Side', 'Clauses', 'Obligations', 'Glossary', 'Export'];

const LOADING_STEPS = [
  { label: 'Detecting contract type', icon: '01', detail: 'Rental · Employment · Gig · Loan' },
  { label: 'Retrieving relevant Indian laws', icon: '02', detail: 'Model Tenancy Act · Code on Wages · CPA 2019' },
  { label: 'Analysing clauses for risk', icon: '03', detail: 'Flagging critical, high, medium, low risks' },
  { label: 'Benchmarking against Indian standards', icon: '04', detail: 'Comparing to 10,000+ Indian contracts' },
  { label: 'Extracting your obligations', icon: '05', detail: 'Payments · Deadlines · Notices' },
  { label: 'Building legal glossary', icon: '06', detail: 'Plain-English definitions for legal terms' },
  { label: 'Finalising report', icon: '07', detail: 'Compiling analysis and recommendations' },
];

const RISK_DOT = { critical: '#b52d1e', high: '#d4721a', medium: '#b8891e', low: '#2a6e46' };

export default function App() {
  const [stage, setStage] = useState('upload');
  const [loadStep, setLoadStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [contractType, setContractType] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [glossary, setGlossary] = useState([]);
  const [activeTab, setActiveTab] = useState('Summary');
  const [error, setError] = useState('');

  const handleTextExtracted = async (text, name) => {
    setFileName(name); setStage('analyzing'); setError('');
    try {
      setLoadStep(0);
      const typeResult = await detectContractType(text);
      setContractType(typeResult.type);

      setLoadStep(1);
      const riskResult = await analyzeRisks(text, typeResult.type);
      setAnalysis(riskResult);
      setLoadStep(3);

      setLoadStep(4);
      const [obResult, glossResult] = await Promise.all([
        extractObligations(text),
        buildGlossary(text),
      ]);

      setObligations(obResult.obligations || []);
      setGlossary(glossResult.terms || []);
      setLoadStep(6);

      setStage('results');
    } catch (e) {
      console.error(e);
      setError('Analysis failed: ' + (e.message || 'Unknown error. Please try again.'));
      setStage('upload');
    }
  };

  const reset = () => {
    setStage('upload'); setAnalysis(null); setObligations([]);
    setGlossary([]); setContractType(''); setFileName('');
    setActiveTab('Summary'); setError('');
  };

  const riskCounts = analysis ? analysis.clauses?.reduce((acc, c) => {
    acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1; return acc;
  }, {}) : {};

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: '1px solid var(--border-light)',
        background: 'rgba(245,241,234,0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{
              width: 34, height: 34, background: 'var(--saffron)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(217,93,26,0.35)',
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontWeight: 900, fontSize: 16 }}>F</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                FairClause
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#b0a99e', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4 }}>
                India
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: '#b0a99e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Not Legal Advice
            </span>
            {stage === 'results' && (
              <button onClick={reset} style={{
                fontSize: 12, fontWeight: 500, color: 'var(--ink-soft)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '7px 14px', background: '#fff', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                New Contract
              </button>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── UPLOAD ── */}
        {stage === 'upload' && (
          <>
            {error && (
              <div style={{ marginBottom: 24, padding: '14px 18px', background: 'var(--critical-bg)', border: '1px solid var(--critical)', borderRadius: 12, fontSize: 13, color: 'var(--critical)' }}>
                {error}
              </div>
            )}
            <UploadZone onTextExtracted={handleTextExtracted} />
          </>
        )}

        {/* ── ANALYZING ── */}
        {stage === 'analyzing' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '65vh', justifyContent: 'center', gap: 48 }}>

            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--paper-dark)" strokeWidth="5" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--saffron)" strokeWidth="5"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - (loadStep + 1) / LOADING_STEPS.length)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: 'var(--saffron)', lineHeight: 1 }}>
                  {Math.round(((loadStep + 1) / LOADING_STEPS.length) * 100)}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9c9790', marginTop: 2 }}>%</span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                Analysing Your Contract
              </h2>
              <p style={{ fontSize: 13, color: '#9c9790' }}>Cross-referencing Indian laws and market benchmarks</p>
            </div>

            <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LOADING_STEPS.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
                  borderRadius: 10,
                  background: i === loadStep ? '#ffffff' : 'transparent',
                  boxShadow: i === loadStep ? 'var(--shadow-sm)' : 'none',
                  border: i === loadStep ? '1px solid var(--border-light)' : '1px solid transparent',
                  opacity: i > loadStep ? 0.3 : 1,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < loadStep ? 'var(--green-india)' : i === loadStep ? 'var(--saffron)' : 'var(--paper-dark)',
                    fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 500,
                    color: i <= loadStep ? '#fff' : '#9c9790',
                    transition: 'background 0.3s ease',
                  }}>
                    {i < loadStep ? '✓' : step.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: i === loadStep ? 600 : 400, color: 'var(--ink)' }}>{step.label}</p>
                    {i === loadStep && <p style={{ fontSize: 11, color: '#9c9790', marginTop: 1 }}>{step.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === 'results' && analysis && (
          <div className="animate-scale-in">

            {/* Contract banner */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 28, padding: '16px 20px',
              background: '#ffffff', borderRadius: 14,
              border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="section-label" style={{ marginBottom: 3 }}>Analysed Agreement</p>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fileName}
                </p>
                {Object.keys(riskCounts).length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {['critical', 'high', 'medium', 'low'].filter(l => riskCounts[l]).map(l => (
                      <span key={l} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontFamily: "'DM Mono', monospace", fontSize: 9,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        padding: '2px 8px', borderRadius: 999,
                        background: `${RISK_DOT[l]}18`, color: RISK_DOT[l],
                        border: `1px solid ${RISK_DOT[l]}40`,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: RISK_DOT[l], display: 'inline-block' }} />
                        {riskCounts[l]} {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span style={{
                background: 'var(--ink)', color: '#fff',
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                padding: '6px 14px', borderRadius: 8,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                flexShrink: 0, marginLeft: 16,
              }}>
                {contractType}
              </span>
            </div>

            {/* ── TABS ── scrollable on mobile */}
            <div style={{
              display: 'flex', borderBottom: '1px solid var(--border-light)',
              marginBottom: 28, overflowX: 'auto', gap: 0,
            }} className="no-scrollbar">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '10px 16px',
                  fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'var(--saffron)' : '#9c9790',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--saffron)' : 'transparent'}`,
                  marginBottom: -1,
                  background: 'none', border: 'none',
                  borderBottomStyle: 'solid', borderBottomWidth: 2,
                  borderBottomColor: activeTab === tab ? 'var(--saffron)' : 'transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <div key={activeTab} className="animate-fade-in">
              {activeTab === 'Summary' && <SummaryTab analysis={analysis} contractType={contractType} />}
              {activeTab === 'Overview' && <RiskDashboard analysis={analysis} contractType={contractType} fileName={fileName} />}
              {activeTab === 'Heatmap' && <RiskHeatmap analysis={analysis} />}
              {activeTab === 'Side-by-Side' && <SideBySideView analysis={analysis} />}
              {activeTab === 'Clauses' && <ClauseViewer analysis={analysis} contractType={contractType} />}
              {activeTab === 'Obligations' && <ObligationChecklist obligations={obligations} />}
              {activeTab === 'Glossary' && <GlossaryPanel terms={glossary} />}
              {activeTab === 'Export' && <ExportPanel analysis={analysis} fileName={fileName} contractType={contractType} />}
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '32px 24px', background: 'rgba(245,241,234,0.6)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, background: 'var(--saffron)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontWeight: 900, fontSize: 11 }}>F</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>FairClause</span>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#b0a99e', letterSpacing: '0.08em', textAlign: 'center' }}>
            AI-Powered · Not Legal Advice · Built for India's 500M Contract-Signers
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#c8c1b6', letterSpacing: '0.06em' }}>
            Documents analysed in-session · Never stored · Always encrypted
          </p>
        </div>
      </footer>
    </div>
  );
}
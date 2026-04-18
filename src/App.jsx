import { useState } from 'react';
import UploadZone from './components/UploadZone';
import RiskDashboard from './components/RiskDashboard';
import ClauseViewer from './components/ClauseViewer';
import ObligationChecklist from './components/ObligationChecklist';
import GlossaryPanel from './components/GlossaryPanel';
import ExportPanel from './components/ExportPanel';
import SummaryPanel from './components/SummaryPanel';
import {
  detectContractType, analyzeRisks,
  extractObligations, buildGlossary
} from './api/claude';

const TABS = ['Summary', 'Overview', 'Clauses', 'Obligations', 'Glossary', 'Export'];

const LOADING_STEPS = [
  { label: 'Detecting contract type…', icon: '🔍' },
  { label: 'Retrieving relevant Indian laws…', icon: '📚' },
  { label: 'Analysing clauses for risk…', icon: '⚖️' },
  { label: 'Benchmarking against Indian standards…', icon: '📊' },
  { label: 'Extracting your obligations…', icon: '📋' },
  { label: 'Building legal glossary…', icon: '📖' },
  { label: 'Finalising report…', icon: '✅' },
];

export default function App() {
  const [stage, setStage] = useState('upload');
  const [loadStep, setLoadStep] = useState(0);
  const [fileName, setFileName] = useState('');
  const [contractType, setContractType] = useState('');
  const [userRole, setUserRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [obligations, setObligations] = useState([]);
  const [glossary, setGlossary] = useState([]);
  const [activeTab, setActiveTab] = useState('Summary');
  const [error, setError] = useState('');

  const handleTextExtracted = async (text, name, role) => {
    setFileName(name);
    setUserRole(role || '');
    setStage('analyzing');
    setError('');

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
    setUserRole(''); setActiveTab('Summary'); setError('');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/90 backdrop-blur-sm">
        <div className="page-wrapper h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-[var(--saffron)] rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-extrabold font-mono">F</span>
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">FairClause</span>
            <span className="font-mono text-xs opacity-30 border border-[var(--border)] px-1.5 py-0.5 rounded hidden sm:inline">India</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs opacity-25 hidden sm:block">NOT LEGAL ADVICE</span>
            {stage === 'results' && (
              <button onClick={reset}
                className="text-xs border border-[var(--border)] rounded-lg px-3 py-1.5 hover:bg-[var(--paper-mid)] transition font-medium">
                New Contract
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="page-wrapper py-10">

        {/* ── UPLOAD ── */}
        {stage === 'upload' && (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}
            <UploadZone onTextExtracted={handleTextExtracted} />
          </>
        )}

        {/* ── ANALYZING ── */}
        {stage === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] gap-8 animate-fade-in">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 border-4 border-[var(--paper-dark)] rounded-full" />
              <div className="absolute inset-0 border-4 border-[var(--saffron)] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-extrabold text-[var(--saffron)]">
                  {Math.round((loadStep / LOADING_STEPS.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-display text-2xl font-bold mb-2">Analysing Your Contract</p>
              <p className="text-sm opacity-50">Cross-referencing Indian laws and market benchmarks</p>
            </div>

            <div className="w-full max-w-sm space-y-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= loadStep ? 'opacity-100' : 'opacity-20'
                  }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < loadStep ? 'bg-[var(--green-india)] text-white' :
                      i === loadStep ? 'bg-[var(--saffron)] text-white pulse-glow' :
                        'bg-[var(--paper-dark)] text-[var(--ink)]'
                    }`}>
                    {i < loadStep ? '✓' : step.icon}
                  </div>
                  <span className={i === loadStep ? 'font-medium' : ''}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {stage === 'results' && analysis && (
          <div className="animate-slide-up">

            {/* Contract banner */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border border-[var(--border)]">
              <div className="min-w-0">
                <p className="font-mono text-xs opacity-30 uppercase tracking-widest mb-0.5">Analysed Agreement</p>
                <p className="font-semibold truncate">{fileName}</p>
                {userRole && (
                  <p className="text-xs opacity-40 mt-0.5 capitalize">Analysed as: {userRole}</p>
                )}
              </div>
              <span className="bg-[var(--ink)] text-white font-mono text-xs px-3 py-1.5 rounded-full uppercase tracking-wide shrink-0 ml-3 capitalize">
                {contractType}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] mb-6 gap-0 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all ${activeTab === tab
                      ? 'border-[var(--saffron)] text-[var(--saffron)]'
                      : 'border-transparent opacity-40 hover:opacity-70'
                    }`}>{tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'Summary' && <SummaryPanel analysis={analysis} userRole={userRole} />}
            {activeTab === 'Overview' && <RiskDashboard analysis={analysis} contractType={contractType} fileName={fileName} />}
            {activeTab === 'Clauses' && <ClauseViewer analysis={analysis} contractType={contractType} />}
            {activeTab === 'Obligations' && <ObligationChecklist obligations={obligations} />}
            {activeTab === 'Glossary' && <GlossaryPanel terms={glossary} />}
            {activeTab === 'Export' && <ExportPanel analysis={analysis} fileName={fileName} contractType={contractType} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-20 py-8">
        <div className="page-wrapper text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-5 h-5 bg-[var(--saffron)] rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-extrabold font-mono">F</span>
            </div>
            <span className="font-display font-bold text-sm">FairClause</span>
          </div>
          <p className="font-mono text-xs opacity-25">
            AI-Powered · Not Legal Advice · Built for India's 500M Contract-Signers
          </p>
          <p className="font-mono text-xs opacity-20">
            Documents are analysed in-session and never stored
          </p>
        </div>
      </footer>
    </div>
  );
}
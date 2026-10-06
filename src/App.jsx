import React, { useEffect, useRef, useState } from 'react';

// DO NOT CHANGE THESE ENDPOINTS
const API_BASE_URL = 'https://docuagent-backend-1xma.onrender.com';

const INITIAL_STAGES = [
  {
    step: 1,
    title: 'Query understanding',
    status: 'queued',
    details: 'Waiting to analyze the request.',
  },
  {
    step: 2,
    title: 'Document retrieval',
    status: 'queued',
    details: 'Waiting for semantic retrieval.',
  },
  {
    step: 3,
    title: 'Evidence evaluation',
    status: 'queued',
    details: 'Waiting for evidence assessment.',
  },
  {
    step: 4,
    title: 'Route decision',
    status: 'queued',
    details: 'Waiting for source selection.',
  },
  {
    step: 5,
    title: 'Web research',
    status: 'queued',
    details: 'Waiting for external research.',
  },
  {
    step: 6,
    title: 'Answer synthesis',
    status: 'queued',
    details: 'Waiting for final synthesis.',
  },
];

function Icon({ name, className = 'w-5 h-5' }) {
  const paths = {
    bolt: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    document: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
    upload: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    ),
    search: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    ),
    brain: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A5 5 0 0112 21a5 5 0 01-4.646-3.101"
      />
    ),
    globe: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
        />
      </>
    ),
    copy: (
      <>
        <rect
          x="9"
          y="9"
          width="11"
          height="11"
          rx="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 9V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h3"
        />
      </>
    ),
    check: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 12l4 4L19 6"
      />
    ),
    x: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 6l12 12M18 6L6 18"
      />
    ),
    chevron: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    ),
    plus: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v14M5 12h14"
      />
    ),
    minus: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14"
      />
    ),
    external: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5h5v5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 5l-8 8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 13v5a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h5"
        />
      </>
    ),
    warning: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3m0 4h.01M10.29 3.86L2.82 17a2 2 0 001.74 3h14.88a2 2 0 001.74-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </>
    ),
    layers: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3l9 5-9 5-9-5 9-5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l9 5 9-5M3 16l9 5 9-5"
        />
      </>
    ),
  };

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {paths[name]}
    </svg>
  );
}

function cleanPlainText(text) {
  if (!text) return '';

  return String(text)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[*+]\s+/gm, '- ')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createInitialStages() {
  return INITIAL_STAGES.map((stage) => ({ ...stage }));
}

function normalizeStages(logs, route) {
  const stages = createInitialStages();

  if (Array.isArray(logs)) {
    logs.forEach((log, index) => {
      if (!log || typeof log !== 'object') return;

      const step =
        Number(log.step) ||
        Number(log.stage) ||
        index + 1;

      const target = stages.find((stage) => stage.step === step);

      if (!target) return;

      target.status = log.status || 'completed';
      target.details =
        log.details ||
        log.message ||
        target.details;
    });
  }

  const normalizedRoute = String(route || '').toLowerCase();

  if (
    normalizedRoute.includes('document') &&
    !normalizedRoute.includes('mixed')
  ) {
    stages[4].status = 'skipped';
    stages[4].details = 'External research was not required.';
  }

  if (
    normalizedRoute.includes('web') &&
    !normalizedRoute.includes('mixed') &&
    !normalizedRoute.includes('document')
  ) {
    stages[1].status = 'skipped';
    stages[1].details = 'Document retrieval was not required.';

    stages[2].status = 'skipped';
    stages[2].details = 'No document evidence was required.';
  }

  return stages;
}

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [chunkCount, setChunkCount] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTrace, setShowTrace] = useState(true);

  const [stages, setStages] = useState(createInitialStages());
  const [elapsedMs, setElapsedMs] = useState(0);

  const fileInputRef = useRef(null);
  const eventSourceRef = useRef(null);
  const queryStartedAtRef = useRef(null);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      if (queryStartedAtRef.current) {
        setElapsedMs(
          Date.now() - queryStartedAtRef.current
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setErrorMsg('Please select a PDF document.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg('The document must be smaller than 10 MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setChunkCount(null);
    setUploadStatus('');
    setErrorMsg('');
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      selectFile(droppedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Extracting text and indexing knowledge...');
    setErrorMsg('');
    setChunkCount(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadStatus(
          data.message || 'Document indexed successfully.'
        );
        setChunkCount(data.chunkCount || null);
      } else {
        setErrorMsg(
          data.error || 'Failed to process document.'
        );
        setUploadStatus('');
      }
    } catch (err) {
      setErrorMsg(
        'Cannot connect to backend server'
      );
      setUploadStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  const updateStage = (incomingStage) => {
    if (!incomingStage) return;

    setStages((currentStages) =>
      currentStages.map((stage) =>
        stage.step === Number(incomingStage.step)
          ? {
            ...stage,
            ...incomingStage,
          }
          : stage
      )
    );
  };

  const handleQueryFallback = async (cleanQuery) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: cleanQuery,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMsg(
          data.answer ||
          data.error ||
          'Query execution failed.'
        );
        setLoading(false);
        return;
      }

      setResponse(data);

      setStages(
        normalizeStages(
          data.logs,
          data.route || data.routeUsed
        )
      );

      setLoading(false);
    } catch (err) {
      setErrorMsg(
        'Failed to communicate with backend query agent.'
      );
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || loading) return;

    const cleanQuery = query.trim();

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setLoading(true);
    setResponse(null);
    setErrorMsg('');
    setCopied(false);
    setStages(createInitialStages());

    queryStartedAtRef.current = Date.now();
    setElapsedMs(0);

    let receivedEvent = false;
    let completed = false;

    const streamUrl =
      `${API_BASE_URL}/api/query/stream?query=` +
      encodeURIComponent(cleanQuery);

    const eventSource = new EventSource(streamUrl);

    eventSourceRef.current = eventSource;

    eventSource.addEventListener('connected', () => {
      receivedEvent = true;
    });

    eventSource.addEventListener('stage', (event) => {
      receivedEvent = true;

      try {
        const stage = JSON.parse(event.data);
        updateStage(stage);
      } catch (err) {
        console.error('Invalid stage event:', err);
      }
    });

    eventSource.addEventListener('result', (event) => {
      receivedEvent = true;
      completed = true;

      try {
        const data = JSON.parse(event.data);

        setResponse(data);

        setStages(
          normalizeStages(
            data.logs,
            data.route || data.routeUsed
          )
        );
      } catch (err) {
        setErrorMsg('Received an invalid response from the agent.');
      }
    });

    eventSource.addEventListener('error', (event) => {
      receivedEvent = true;

      let message = 'Query execution failed.';

      try {
        if (event?.data) {
          const data = JSON.parse(event.data);
          message =
            data.error ||
            data.message ||
            message;
        }
      } catch (err) {
        console.error('SSE error:', err);
      }

      setErrorMsg(message);
      setLoading(false);
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.addEventListener('complete', () => {
      completed = true;
      setLoading(false);
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.onerror = () => {
      if (completed) return;

      eventSource.close();
      eventSourceRef.current = null;

      if (!receivedEvent) {
        handleQueryFallback(cleanQuery);
      } else {
        setErrorMsg(
          'The live agent connection was interrupted.'
        );
        setLoading(false);
      }
    };
  };

  const copyToClipboard = async () => {
    if (!response?.answer) return;

    try {
      await navigator.clipboard.writeText(
        cleanPlainText(response.answer)
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      setErrorMsg('Unable to copy response.');
    }
  };

  const getRoute = () => {
    if (!response) return 'Unknown';

    return (
      response.routeUsed ||
      response.route ||
      response.queryType ||
      'Unknown'
    );
  };

  const getConfidence = () => {
    if (!response) return null;

    return (
      response.confidence ||
      response.answerConfidence ||
      null
    );
  };

  const getConfidenceNumber = () => {
    const confidence = getConfidence();

    if (typeof confidence === 'number') {
      return confidence > 1
        ? Math.round(confidence)
        : Math.round(confidence * 100);
    }

    if (typeof confidence === 'string') {
      const normalized = confidence.toLowerCase();

      if (normalized.includes('high')) return 90;
      if (normalized.includes('medium')) return 70;
      if (normalized.includes('low')) return 40;

      const number = parseInt(confidence, 10);

      if (!Number.isNaN(number)) {
        return number <= 1
          ? Math.round(number * 100)
          : number;
      }
    }

    return null;
  };

  const getRouteLabel = () => {
    const route = getRoute().toLowerCase();

    if (
      route.includes('mixed') ||
      (route.includes('document') &&
        route.includes('web'))
    ) {
      return 'MIXED';
    }

    if (
      route.includes('pinecone') ||
      route.includes('document')
    ) {
      return 'DOCUMENT';
    }

    if (
      route.includes('tavily') ||
      route.includes('web')
    ) {
      return 'WEB';
    }

    return 'AGENT';
  };

  const getRouteColor = () => {
    const label = getRouteLabel();

    if (label === 'DOCUMENT') {
      return {
        text: 'text-emerald-300',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/25',
        dot: 'bg-emerald-400',
      };
    }

    if (label === 'WEB') {
      return {
        text: 'text-amber-300',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/25',
        dot: 'bg-amber-400',
      };
    }

    if (label === 'MIXED') {
      return {
        text: 'text-cyan-300',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/25',
        dot: 'bg-cyan-400',
      };
    }

    return {
      text: 'text-indigo-300',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/25',
      dot: 'bg-indigo-400',
    };
  };

  const getEvidence = () => {
    if (!response) return [];

    if (Array.isArray(response.evidence)) {
      return response.evidence;
    }

    if (Array.isArray(response.sources)) {
      return response.sources.filter(
        (source) =>
          source.type === 'document' ||
          source.type === 'pdf'
      );
    }

    return [];
  };

  const getWebSources = () => {
    if (!response) return [];

    if (Array.isArray(response.webSources)) {
      return response.webSources;
    }

    if (Array.isArray(response.sources)) {
      return response.sources.filter(
        (source) =>
          source.type === 'web' ||
          source.type === 'tavily'
      );
    }

    return [];
  };

  const getCompletedStages = () => {
    return stages.filter(
      (stage) =>
        stage.status === 'completed' ||
        stage.status === 'skipped'
    ).length;
  };

  const getProgress = () => {
    return Math.round(
      (getCompletedStages() / stages.length) * 100
    );
  };

  const getStatusLabel = (status) => {
    if (status === 'running') return 'Running';
    if (status === 'completed') return 'Completed';
    if (status === 'skipped') return 'Skipped';
    if (status === 'error') return 'Error';
    return 'Queued';
  };

  const renderStageIcon = (stage) => {
    if (stage.status === 'running') {
      return (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-300/30 border-t-indigo-300 animate-spin" />
      );
    }

    if (stage.status === 'completed') {
      return (
        <Icon
          name="check"
          className="w-4 h-4 text-emerald-300"
        />
      );
    }

    if (stage.status === 'skipped') {
      return (
        <Icon
          name="minus"
          className="w-4 h-4 text-slate-500"
        />
      );
    }

    if (stage.status === 'error') {
      return (
        <Icon
          name="warning"
          className="w-4 h-4 text-rose-300"
        />
      );
    }

    return (
      <span className="w-2.5 h-2.5 rounded-full border border-slate-600" />
    );
  };

  const confidenceNumber = getConfidenceNumber();
  const routeColors = getRouteColor();
  const evidence = getEvidence();
  const webSources = getWebSources();

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-indigo-500/30">

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softGlow {
          0%, 100% {
            opacity: .45;
          }
          50% {
            opacity: .8;
          }
        }

        @keyframes progressMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(350%);
          }
        }

        .fade-up {
          animation: fadeUp .45s ease-out both;
        }

        .soft-glow {
          animation: softGlow 3s ease-in-out infinite;
        }

        .progress-animation {
          animation: progressMove 1.7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .soft-glow,
          .progress-animation {
            animation: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] soft-glow" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-50 border-b border-slate-800/70 bg-[#090d17]/90 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Icon
                  name="bolt"
                  className="w-5 h-5 text-white"
                />
              </div>

              <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#090d17]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  DocuAgent
                </h1>

                <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-200 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                  CRAG
                </span>
              </div>

              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Intelligent Document Research Agent
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">
                SYSTEM ONLINE
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">
                VECTOR STORE
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                PINECONE
              </span>
            </div>

          </div>

        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-8">

        {errorMsg && (
          <div className="mb-6 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 flex items-center justify-between fade-up">

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Icon
                  name="warning"
                  className="w-4 h-4 text-rose-300"
                />
              </div>

              <span className="text-sm text-rose-200">
                {errorMsg}
              </span>

            </div>

            <button
              onClick={() => setErrorMsg('')}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Dismiss error"
            >
              <Icon
                name="x"
                className="w-4 h-4"
              />
            </button>

          </div>
        )}

        <section className="mb-8 fade-up">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">

            <div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs uppercase tracking-[0.2em] text-indigo-300 font-bold">
                  AI Knowledge Engine
                </span>
                <span className="h-px w-8 bg-indigo-500/40" />
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Ask your documents.
                <br />
                <span className="text-slate-400">
                  Let the agent find the evidence.
                </span>
              </h2>

              <p className="mt-4 text-sm lg:text-base text-slate-400 max-w-2xl leading-7">
                Upload a document and ask questions. DocuAgent retrieves
                relevant evidence, evaluates its quality, and decides whether
                to use your knowledge base, external web context, or both.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <div className="px-4 py-3 rounded-xl border border-slate-800 bg-slate-900/70">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Architecture
                </p>

                <p className="text-sm font-semibold text-slate-200 mt-1">
                  RAG + Agentic Routing
                </p>
              </div>

            </div>

          </div>

        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          <aside className="xl:col-span-4 space-y-5">

            <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/95 shadow-2xl shadow-black/20 overflow-hidden fade-up">

              <div className="px-5 py-4 border-b border-slate-800/70 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Icon
                      name="document"
                      className="w-4 h-4 text-indigo-300"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Knowledge Base
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload a document to give the agent context
                    </p>
                  </div>

                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${chunkCount
                      ? 'text-emerald-300'
                      : 'text-slate-500'
                    }`}
                >
                  {chunkCount ? 'Indexed' : 'Ready'}
                </span>

              </div>

              <div className="p-5 space-y-4">

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`relative rounded-xl border-2 border-dashed ${dragActive
                      ? 'border-indigo-400 bg-indigo-500/10'
                      : 'border-slate-700 bg-[#080c15]'
                    } hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-all group overflow-hidden`}
                >

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="px-5 py-7 text-center">

                    <div className="mx-auto w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 flex items-center justify-center transition-all">

                      <Icon
                        name="upload"
                        className="w-5 h-5 text-slate-400 group-hover:text-indigo-300 transition-colors"
                      />

                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-200">
                      {file
                        ? file.name
                        : 'Upload your PDF document'}
                    </p>

                    <p className="mt-1.5 text-xs text-slate-400">
                      Drag and drop here or choose a file
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-semibold text-slate-200 transition-all"
                    >
                      <Icon
                        name="document"
                        className="w-4 h-4"
                      />
                      Choose PDF
                    </button>

                    <p className="mt-3 text-xs text-slate-500">
                      PDF documents only • Maximum 10 MB
                    </p>

                  </div>

                </div>

                {file && (
                  <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg bg-slate-900/90 border border-slate-800 fade-up">

                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/15 text-rose-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                      PDF
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    {chunkCount && (
                      <span className="text-xs text-indigo-300 font-semibold whitespace-nowrap">
                        {chunkCount} chunks
                      </span>
                    )}

                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={!file || isUploading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/15 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Indexing document...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="upload"
                        className="w-4 h-4"
                      />
                      Process Knowledge Base
                    </>
                  )}
                </button>

                {uploadStatus && (
                  <div className="flex items-start gap-3 px-3.5 py-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 fade-up">

                    <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Icon
                        name="check"
                        className="w-3.5 h-3.5 text-emerald-300"
                      />
                    </div>

                    <p className="text-xs text-emerald-200 leading-5">
                      {uploadStatus}
                    </p>

                  </div>
                )}

              </div>

            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/80 p-5 fade-up">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Agent Architecture
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Runtime decision pipeline
                  </p>
                </div>

                <span className="text-xs text-indigo-300 font-mono">
                  v1.0
                </span>

              </div>

              <div className="space-y-1">

                {[
                  ['01', 'Query', 'Interpret user intent'],
                  ['02', 'Retrieve', 'Search semantic memory'],
                  ['03', 'Evaluate', 'Assess evidence quality'],
                  ['04', 'Route', 'Document / Web / Mixed'],
                  ['05', 'Synthesize', 'Generate grounded answer'],
                ].map(
                  ([number, title, description], idx) => (
                    <div
                      key={number}
                      className="relative flex gap-3 py-2.5"
                    >

                      {idx < 4 && (
                        <div className="absolute left-[12px] top-9 h-6 w-px bg-slate-800" />
                      )}

                      <span className="relative z-10 w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0">
                        {number}
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          {title}
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {description}
                        </p>
                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </aside>

          <section className="xl:col-span-8 space-y-5">

            <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/95 shadow-2xl shadow-black/20 overflow-hidden fade-up">

              <div className="px-5 py-4 border-b border-slate-800/70 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon
                      name="search"
                      className="w-4 h-4 text-cyan-300"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Agent Query
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Ask a question and let the agent choose the evidence source
                    </p>
                  </div>

                </div>

                <span className="hidden sm:block text-xs font-mono text-slate-500">
                  AUTO ROUTING
                </span>

              </div>

              <div className="p-5">

                <div className="relative">

                  <textarea
                    rows={4}
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        handleQuery();
                      }
                    }}
                    placeholder="Ask a question about the uploaded document..."
                    className="w-full resize-none bg-[#080c15] border border-slate-800 rounded-xl px-4 py-4 pr-32 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/10 transition-all leading-6"
                  />

                  <button
                    onClick={handleQuery}
                    disabled={
                      loading ||
                      !query.trim()
                    }
                    className="absolute right-3 bottom-3 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Running
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Run Agent
                        <Icon
                          name="chevron"
                          className="w-3.5 h-3.5"
                        />
                      </span>
                    )}
                  </button>

                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  {[
                    'What is this document about?',
                    'What are the main strengths?',
                    'What information is missing?',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() =>
                        setQuery(suggestion)
                      }
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}

                </div>

              </div>

            </div>

            {loading && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 fade-up">

                <div className="flex items-center justify-between gap-4 mb-5">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full border-2 border-indigo-300/30 border-t-indigo-300 animate-spin" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-indigo-200">
                        Agent is working
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Executing the retrieval and reasoning pipeline
                      </p>
                    </div>

                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {getProgress()}%
                  </span>

                </div>

                <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        getProgress(),
                        8
                      )}%`,
                    }}
                  />
                </div>

              </div>
            )}

            {(loading || stages.some(
              (stage) =>
                stage.status !== 'queued'
            )) && (
                <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/95 shadow-xl overflow-hidden fade-up">

                  <button
                    onClick={() =>
                      setShowTrace(!showTrace)
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Icon
                          name="layers"
                          className="w-4 h-4 text-indigo-300"
                        />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">
                          Agent Execution Trace
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Live view of the agent decision pipeline
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      {loading && (
                        <span className="hidden sm:block text-xs text-indigo-300">
                          Processing
                        </span>
                      )}

                      <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                        <Icon
                          name={
                            showTrace
                              ? 'minus'
                              : 'plus'
                          }
                          className="w-3.5 h-3.5"
                        />
                      </span>

                    </div>

                  </button>

                  {showTrace && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/70">

                      <div className="pt-4 space-y-1">

                        {stages.map((stage, idx) => {

                          const isLast =
                            idx ===
                            stages.length - 1;

                          const statusClass =
                            stage.status === 'running'
                              ? 'border-indigo-500/30 bg-indigo-500/5'
                              : stage.status ===
                                'completed'
                                ? 'border-emerald-500/10 bg-emerald-500/[0.02]'
                                : stage.status ===
                                  'skipped'
                                  ? 'border-slate-800/60 bg-slate-900/20'
                                  : 'border-transparent bg-transparent';

                          return (
                            <div
                              key={stage.step}
                              className={`relative flex gap-4 rounded-xl px-3 py-3 transition-all duration-300 ${statusClass}`}
                            >

                              {!isLast && (
                                <div className="absolute left-[25px] top-[45px] bottom-[-8px] w-px bg-slate-800" />
                              )}

                              <div
                                className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${stage.status ===
                                    'running'
                                    ? 'bg-indigo-500/10 border-indigo-500/30'
                                    : stage.status ===
                                      'completed'
                                      ? 'bg-emerald-500/10 border-emerald-500/20'
                                      : stage.status ===
                                        'skipped'
                                        ? 'bg-slate-900 border-slate-800'
                                        : 'bg-slate-900 border-slate-800'
                                  }`}
                              >
                                {renderStageIcon(stage)}
                              </div>

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between gap-3">

                                  <p
                                    className={`text-sm font-semibold ${stage.status ===
                                        'running'
                                        ? 'text-indigo-200'
                                        : stage.status ===
                                          'completed'
                                          ? 'text-slate-200'
                                          : 'text-slate-400'
                                      }`}
                                  >
                                    {stage.title}
                                  </p>

                                  <span
                                    className={`text-[10px] uppercase tracking-wider font-semibold shrink-0 ${stage.status ===
                                        'running'
                                        ? 'text-indigo-300'
                                        : stage.status ===
                                          'completed'
                                          ? 'text-emerald-300'
                                          : stage.status ===
                                            'skipped'
                                            ? 'text-slate-500'
                                            : 'text-slate-600'
                                      }`}
                                  >
                                    {getStatusLabel(
                                      stage.status
                                    )}
                                  </span>

                                </div>

                                <p className="text-xs text-slate-500 mt-1 leading-5">
                                  {stage.details}
                                </p>

                              </div>

                            </div>
                          );
                        })}

                      </div>

                    </div>
                  )}

                </div>
              )}

            {response && !loading && (
              <div className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <div className="rounded-xl border border-slate-800 bg-[#0c111d]/95 p-4 hover:border-slate-700 transition-colors">

                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Agent Route
                    </p>

                    <div className="flex items-center gap-2 mt-2.5">

                      <span
                        className={`w-2 h-2 rounded-full ${routeColors.dot}`}
                      />

                      <span
                        className={`text-sm font-bold ${routeColors.text}`}
                      >
                        {getRouteLabel()}
                      </span>

                    </div>

                    <p className="text-xs text-slate-400 mt-1.5 truncate">
                      {getRoute()}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0c111d]/95 p-4 hover:border-slate-700 transition-colors">

                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Evidence
                    </p>

                    <p className="text-lg font-bold text-slate-100 mt-2">
                      {response.retrievedCount ??
                        response.chunkCount ??
                        evidence.length ??
                        '—'}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      retrieved context items
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0c111d]/95 p-4 hover:border-slate-700 transition-colors">

                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Confidence
                    </p>

                    <div className="flex items-center gap-3 mt-2.5">

                      {confidenceNumber !== null ? (
                        <>
                          <span className="text-sm font-bold text-slate-100">
                            {confidenceNumber}%
                          </span>

                          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${confidenceNumber >= 80
                                  ? 'bg-emerald-400'
                                  : confidenceNumber >= 60
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                                }`}
                              style={{
                                width: `${Math.min(
                                  confidenceNumber,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-slate-500">
                          Not provided
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-slate-400 mt-1.5">
                      evidence-grounded assessment
                    </p>

                  </div>

                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/95 shadow-xl overflow-hidden">

                  <button
                    onClick={() =>
                      setShowTrace(!showTrace)
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Icon
                          name="layers"
                          className="w-4 h-4 text-indigo-300"
                        />
                      </div>

                      <div className="text-left">

                        <p className="text-sm font-semibold text-white">
                          Agent Execution Trace
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Observable system decisions
                        </p>

                      </div>

                    </div>

                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Icon
                        name={
                          showTrace
                            ? 'minus'
                            : 'plus'
                        }
                        className="w-3.5 h-3.5"
                      />
                    </span>

                  </button>

                  {showTrace && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/70">

                      <div className="pt-4 space-y-1">

                        {stages.map((stage, idx) => {

                          const isLast =
                            idx ===
                            stages.length - 1;

                          return (
                            <div
                              key={stage.step}
                              className={`relative flex gap-4 rounded-xl px-3 py-3 ${stage.status ===
                                  'completed'
                                  ? 'bg-emerald-500/[0.02]'
                                  : stage.status ===
                                    'skipped'
                                    ? 'bg-slate-900/20'
                                    : ''
                                }`}
                            >

                              {!isLast && (
                                <div className="absolute left-[25px] top-[45px] bottom-[-8px] w-px bg-slate-800" />
                              )}

                              <div
                                className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${stage.status ===
                                    'completed'
                                    ? 'bg-emerald-500/10 border-emerald-500/20'
                                    : stage.status ===
                                      'skipped'
                                      ? 'bg-slate-900 border-slate-800'
                                      : 'bg-slate-900 border-slate-800'
                                  }`}
                              >
                                {renderStageIcon(stage)}
                              </div>

                              <div className="min-w-0 flex-1">

                                <div className="flex items-center justify-between gap-3">

                                  <p className="text-sm font-semibold text-slate-200">
                                    {stage.title}
                                  </p>

                                  <span
                                    className={`text-[10px] uppercase tracking-wider font-semibold ${stage.status ===
                                        'completed'
                                        ? 'text-emerald-300'
                                        : stage.status ===
                                          'skipped'
                                          ? 'text-slate-500'
                                          : 'text-slate-400'
                                      }`}
                                  >
                                    {getStatusLabel(
                                      stage.status
                                    )}
                                  </span>

                                </div>

                                <p className="text-xs text-slate-500 mt-1 leading-5">
                                  {stage.details}
                                </p>

                              </div>

                            </div>
                          );
                        })}

                      </div>

                    </div>
                  )}

                </div>

                <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#101426] to-[#0c111d] shadow-2xl shadow-indigo-950/20 overflow-hidden fade-up">

                  <div className="px-5 py-4 border-b border-indigo-500/10 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Icon
                          name="brain"
                          className="w-4 h-4 text-indigo-300"
                        />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-white">
                          Synthesized Answer
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Grounded response generated from available evidence
                        </p>

                      </div>

                    </div>

                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <Icon
                        name={
                          copied
                            ? 'check'
                            : 'copy'
                        }
                        className="w-3.5 h-3.5"
                      />
                      {copied
                        ? 'Copied'
                        : 'Copy'}
                    </button>

                  </div>

                  <div className="p-6">

                    <div className="text-[15px] text-slate-200 leading-7 whitespace-pre-wrap">
                      {cleanPlainText(
                        response.answer
                      )}
                    </div>

                    {elapsedMs > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-800/70 flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Agent completed in{' '}
                        {(elapsedMs / 1000).toFixed(
                          1
                        )}
                        s
                      </div>
                    )}

                  </div>

                </div>

                {evidence.length > 0 && (
                  <div className="rounded-2xl border border-slate-800/80 bg-[#0c111d]/95 overflow-hidden fade-up">

                    <div className="px-5 py-4 border-b border-slate-800/70">

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm font-semibold text-white">
                            Supporting Evidence
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Retrieved context used by the agent
                          </p>

                        </div>

                        <span className="text-xs font-mono text-emerald-300">
                          {evidence.length} SOURCE
                          {evidence.length === 1
                            ? ''
                            : 'S'}
                        </span>

                      </div>

                    </div>

                    <div className="p-4 space-y-3">

                      {evidence.map(
                        (item, idx) => {

                          const text =
                            typeof item ===
                              'string'
                              ? item
                              : item.text ||
                              item.content ||
                              item.quote ||
                              item.details ||
                              '';

                          const filename =
                            typeof item ===
                              'object'
                              ? item.filename ||
                              item.source ||
                              'Document'
                              : 'Document';

                          return (
                            <div
                              key={idx}
                              className="rounded-xl bg-[#080c15] border border-slate-800 p-4 hover:border-slate-700 transition-colors"
                            >

                              <div className="flex items-center gap-2 mb-3">

                                <span className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-xs text-emerald-300 font-bold">
                                  {idx + 1}
                                </span>

                                <span className="text-xs font-medium text-slate-400 truncate">
                                  {filename}
                                </span>

                              </div>

                              <p className="text-sm text-slate-300 leading-6">
                                {cleanPlainText(
                                  text
                                )}
                              </p>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

                {webSources.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/15 bg-[#0c111d]/95 overflow-hidden fade-up">

                    <div className="px-5 py-4 border-b border-amber-500/10">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <Icon
                            name="globe"
                            className="w-4 h-4 text-amber-300"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-white">
                            Web Research
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            External sources selected for this answer
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">

                      {webSources.map(
                        (source, idx) => {

                          const title =
                            typeof source ===
                              'string'
                              ? source
                              : source.title ||
                              source.name ||
                              'Web Source';

                          const url =
                            typeof source ===
                              'object'
                              ? source.url ||
                              source.link ||
                              ''
                              : '';

                          const snippet =
                            typeof source ===
                              'object'
                              ? source.content ||
                              source.snippet ||
                              ''
                              : '';

                          return (
                            <div
                              key={idx}
                              className="rounded-xl bg-[#080c15] border border-slate-800 p-4 hover:border-amber-500/25 transition-colors"
                            >

                              <div className="flex gap-3">

                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-300 flex items-center justify-center shrink-0">
                                  <Icon
                                    name="globe"
                                    className="w-4 h-4"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="text-sm font-semibold text-slate-200 truncate">
                                    {title}
                                  </p>

                                  {url && (
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 truncate mt-1.5 transition-colors"
                                    >
                                      <span className="truncate">
                                        {url}
                                      </span>

                                      <Icon
                                        name="external"
                                        className="w-3 h-3 shrink-0"
                                      />
                                    </a>
                                  )}

                                  {snippet && (
                                    <p className="text-xs text-slate-400 leading-5 mt-2 line-clamp-3">
                                      {cleanPlainText(
                                        snippet
                                      )}
                                    </p>
                                  )}

                                </div>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

                {evidence.length === 0 &&
                  webSources.length === 0 && (
                    <div className="rounded-xl border border-slate-800 bg-[#0c111d]/70 px-4 py-4">

                      <div className="flex items-start gap-3">

                        <Icon
                          name="warning"
                          className="w-4 h-4 text-slate-500 mt-0.5 shrink-0"
                        />

                        <p className="text-xs text-slate-400 leading-5">
                          Source-level evidence was not returned by the current backend response. The answer is still displayed, but detailed provenance is unavailable for this response.
                        </p>

                      </div>

                    </div>
                  )}

              </div>
            )}

            {!response && !loading && (
              <div className="rounded-2xl border border-slate-800/70 bg-[#0c111d]/50 min-h-[360px] flex items-center justify-center fade-up">

                <div className="text-center max-w-md px-6">

                  <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center mb-5">

                    <Icon
                      name="brain"
                      className="w-6 h-6 text-indigo-300/80"
                    />

                  </div>

                  <h3 className="text-base font-semibold text-slate-200">
                    Your agent is ready
                  </h3>

                  <p className="text-sm text-slate-400 leading-6 mt-2">
                    Upload a document using the Knowledge Base panel, then ask a question. The agent will retrieve relevant evidence and determine the appropriate knowledge source.
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mt-5">

                    <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      Semantic Retrieval
                    </span>

                    <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      Evidence Evaluation
                    </span>

                    <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      Agentic Routing
                    </span>

                    <span className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      Web Research
                    </span>

                  </div>

                </div>

              </div>
            )}

          </section>

        </div>

        <footer className="mt-10 pt-5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">

          <p className="text-xs text-slate-500">
            DocuAgent • Agentic Retrieval-Augmented Generation
          </p>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Pinecone</span>
            <span>•</span>
            <span>Groq</span>
            <span>•</span>
            <span>Tavily</span>
          </div>

        </footer>

      </main>
    </div>
  );
}
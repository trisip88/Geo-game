import React, { useState } from 'react';
import { MatchRecord } from '../types';
import { RGOGC_JSON_SCHEMA } from '../data/jsonSchema';
import {
  FileJson,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  FileCode,
  Layers,
} from 'lucide-react';

interface JsonRecordViewerProps {
  matchRecord: MatchRecord;
}

export const JsonRecordViewer: React.FC<JsonRecordViewerProps> = ({ matchRecord }) => {
  const [activeTab, setActiveTab] = useState<'match' | 'schema'>('match');
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const matchJsonString = JSON.stringify(matchRecord, null, 2);
  const schemaJsonString = JSON.stringify(RGOGC_JSON_SCHEMA, null, 2);

  const activeContent = activeTab === 'match' ? matchJsonString : schemaJsonString;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'match' ? 'rgogc-match.json' : 'rgogc-schema.json';
    const blob = new Blob([activeContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-b-8 border-indigo-200 text-slate-800">
      {/* Header bar */}
      <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
            <FileJson className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-900">
              Live JSON Schema & Match Telemetry Engine
            </h3>
            <p className="text-[11px] text-slate-400 font-bold">
              Standard JSON Output Schema · Updates with every round
            </p>
          </div>
        </div>

        {/* Tab Selector and Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'match'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Match Payload</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'schema'
                  ? 'bg-white text-pink-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-all border border-indigo-200 active:scale-95 shadow-sm"
            title="Copy JSON to Clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-pink-50 hover:bg-pink-100 text-pink-700 transition-all border border-pink-200 active:scale-95 shadow-sm"
            title="Download JSON File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {/* Collapse/Expand */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* JSON Payload viewer */}
      {isExpanded && (
        <div className="p-4 bg-slate-950">
          <div className="p-4 bg-slate-900 rounded-2xl max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400 border border-slate-800">
            <pre className="whitespace-pre overflow-x-auto">{activeContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

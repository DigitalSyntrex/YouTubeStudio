import React, { useState } from "react";
import { Episode } from "../types";
import { X, Download, Copy, Check, FileText, Code, Table, Printer } from "lucide-react";

interface ExportModalProps {
  episodes: Episode[];
  onClose: () => void;
  onOpenPrintCheatSheet?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ episodes, onClose, onOpenPrintCheatSheet }) => {
  const [format, setFormat] = useState<"markdown" | "json" | "csv">("markdown");
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    let md = `# Final Fantasy VI Pixel Remaster - YouTube Let's Play Playlist Plan\n\n`;
    md += `Total Episodes: ${episodes.length}\n`;
    md += `Estimated Total Duration: ~${(episodes.reduce((acc, c) => acc + c.estDurationMinutes, 0) / 60).toFixed(1)} hours\n\n`;

    episodes.forEach((ep) => {
      md += `## EP ${ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}: ${ep.title}\n`;
      md += `- **World**: ${ep.world}\n`;
      md += `- **Estimated Duration**: ~${ep.estDurationMinutes} mins\n`;
      md += `- **Start**: ${ep.startPoint}\n`;
      md += `- **End**: ${ep.endPoint}\n\n`;
      md += `### Description:\n\`\`\`\n${ep.description}\n\`\`\`\n\n`;
      md += `### Chapter Timestamps:\n`;
      ep.chapters.forEach((c) => {
        md += `- \`${c.timestamp}\` ${c.title}\n`;
      });
      md += `\n---\n\n`;
    });

    return md;
  };

  const generateJson = () => {
    return JSON.stringify(episodes, null, 2);
  };

  const generateCsv = () => {
    let csv = `"Part","World","Title","Est Minutes","Start Point","End Point","Status"\n`;
    episodes.forEach((ep) => {
      csv += `"${ep.partNumber}","${ep.world}","${ep.title.replace(/"/g, '""')}","${ep.estDurationMinutes}","${ep.startPoint.replace(/"/g, '""')}","${ep.endPoint.replace(/"/g, '""')}","${ep.status}"\n`;
    });
    return csv;
  };

  const getContent = () => {
    switch (format) {
      case "json":
        return generateJson();
      case "csv":
        return generateCsv();
      case "markdown":
      default:
        return generateMarkdown();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const text = getContent();
    const ext = format === "json" ? "json" : format === "csv" ? "csv" : "md";
    const mime = format === "json" ? "application/json" : "text/plain";

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FF6_Pixel_Remaster_Playlist_Plan.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Export Playlist Plan</h2>
              <p className="text-xs text-zinc-400">Export full episode series for Notion, YouTube batch upload or Sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 bg-[#121212] border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {[
              { id: "markdown", label: "Markdown (.md)", icon: FileText },
              { id: "json", label: "JSON (.json)", icon: Code },
              { id: "csv", label: "CSV (.csv)", icon: Table },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    format === f.id
                      ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-sm font-bold"
                      : "bg-[#09090b] text-zinc-300 border-white/10 hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {onOpenPrintCheatSheet && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintCheatSheet();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                title="Open Printable & PDF Cheat Sheet Studio"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF Cheat Sheet</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Raw"}</span>
            </button>
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-4 bg-[#09090b] flex-1 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">{getContent()}</pre>
        </div>
      </div>
    </div>
  );
};

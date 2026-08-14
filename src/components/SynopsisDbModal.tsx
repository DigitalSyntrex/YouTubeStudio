import React, { useState, useRef } from "react";
import { Database, FolderUp, X, Search, Trash2, Check, FileCheck, Copy } from "lucide-react";
import { PlaythroughSeries } from "../types";

export interface CustomSynopsisEntry {
  gameTitle: string;
  synopsis: string;
  sourceFile?: string;
}

interface SynopsisDbModalProps {
  activeSeries?: PlaythroughSeries;
  onUpdateSeriesSynopsis?: (seriesId: string, synopsis: string, source?: string) => void;
  onClose: () => void;
}

export const SynopsisDbModal: React.FC<SynopsisDbModalProps> = ({
  activeSeries,
  onUpdateSeriesSynopsis,
  onClose,
}) => {
  const [customDb, setCustomDb] = useState<CustomSynopsisEntry[]>(() => {
    const saved = localStorage.getItem("yt_custom_synopsis_db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse custom synopsis DB:", e);
      }
    }
    return [];
  });

  const [searchDbQuery, setSearchDbQuery] = useState("");
  const [templateCopied, setTemplateCopied] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseSynopsisDatabase = (fileText: string, fileName: string): CustomSynopsisEntry[] => {
    const entries: CustomSynopsisEntry[] = [];
    const blocks = fileText.split(/(?=\[[^\]]+\])/g);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
      if (match) {
        const title = match[1].trim();
        const syn = match[2].trim();
        if (title && syn) {
          entries.push({
            gameTitle: title,
            synopsis: syn,
            sourceFile: fileName,
          });
        }
      }
    }
    return entries;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseSynopsisDatabase(text, file.name);
      if (parsed.length === 0) {
        alert(
          "No valid game synopses found in the text file.\n\nPlease format your file as:\n\n[Game Title]\nSynopsis text...\n\n[Game Title 2]\nSynopsis text..."
        );
        return;
      }

      setCustomDb((prev) => {
        const map = new Map<string, CustomSynopsisEntry>();
        prev.forEach((item) => map.set(item.gameTitle.toLowerCase().trim(), item));
        parsed.forEach((item) => map.set(item.gameTitle.toLowerCase().trim(), item));
        const updated = Array.from(map.values());
        localStorage.setItem("yt_custom_synopsis_db", JSON.stringify(updated));
        return updated;
      });

      const currentTitle = activeSeries?.gameTitle || "";
      const activeMatch =
        parsed.find((p) => p.gameTitle.toLowerCase().trim() === currentTitle.toLowerCase().trim()) ||
        parsed.find(
          (p) =>
            currentTitle.toLowerCase().includes(p.gameTitle.toLowerCase().trim()) ||
            p.gameTitle.toLowerCase().trim().includes(currentTitle.toLowerCase().trim())
        );

      if (activeMatch && onUpdateSeriesSynopsis && activeSeries) {
        onUpdateSeriesSynopsis(
          activeSeries.id,
          activeMatch.synopsis,
          `Custom DB (${activeMatch.sourceFile || file.name})`
        );
        setUploadFeedback(
          `Imported ${parsed.length} entries! Matched & applied custom synopsis for "${currentTitle}".`
        );
      } else {
        setUploadFeedback(`Successfully imported ${parsed.length} game synopses into your local database!`);
      }

      setTimeout(() => setUploadFeedback(null), 6000);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleRemoveFromDb = (title: string) => {
    setCustomDb((prev) => {
      const updated = prev.filter((item) => item.gameTitle.toLowerCase().trim() !== title.toLowerCase().trim());
      localStorage.setItem("yt_custom_synopsis_db", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredDb = customDb.filter(
    (item) =>
      item.gameTitle.toLowerCase().includes(searchDbQuery.toLowerCase()) ||
      item.synopsis.toLowerCase().includes(searchDbQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/90 via-[#101426] to-cyan-950/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Custom Synopsis Database Library
              </h3>
              <p className="text-xs text-zinc-400">
                Upload & manage text files containing game story & world synopses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />

          {uploadFeedback && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-semibold p-3 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
          )}

          {/* File Upload & Format Guide */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <FolderUp className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Text File Formatting Guide
                </h4>
              </div>
              <button
                onClick={() => {
                  const sample = `[Final Fantasy VI]\nA world where magic has died out and technology rules. Terra Branford, a young woman gifted with mysterious magical powers, escapes the control of the evil Empire with the help of the Returners resistance...\n\n[Elden Ring]\nIn the Lands Between ruled by Queen Marika the Eternal, the Elden Ring, the source of the Erdtree, has been shattered. The Tarnished return to claim the shards and become the Elden Lord...`;
                  navigator.clipboard.writeText(sample);
                  setTemplateCopied(true);
                  setTimeout(() => setTemplateCopied(false), 3000);
                }}
                className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {templateCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                <span>{templateCopied ? "Copied Template!" : "Copy Format Template"}</span>
              </button>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Format your <code className="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">.txt</code> or <code className="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">.md</code> file using square brackets <code className="text-cyan-300 font-mono bg-black/40 px-1 py-0.5 rounded">[Game Title]</code> for titles, followed by the story paragraph:
            </p>

            <div className="bg-[#060913] border border-white/10 rounded-xl p-3 font-mono text-[11px] space-y-1">
              <p className="text-cyan-300 font-bold">[Game Title Here]</p>
              <p className="text-zinc-400 italic">Game story & plot overview paragraph here...</p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-zinc-400 font-medium">
                {customDb.length} total game synopses saved in local database
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <FolderUp className="w-4 h-4" />
                <span>Upload .txt / .md Database File</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDbQuery}
                onChange={(e) => setSearchDbQuery(e.target.value)}
                placeholder="Search saved game titles or plot synopses..."
                className="w-full bg-[#080d1a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Database Entries List */}
          <div className="space-y-3">
            {filteredDb.length === 0 ? (
              <div className="text-center py-8 bg-[#080d1a] border border-white/5 rounded-2xl p-6">
                <Database className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-semibold">
                  {searchDbQuery ? "No database entries match your search query." : "No custom synopsis database uploaded yet."}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Upload a .txt file containing [Game Title] blocks to build your offline library.
                </p>
              </div>
            ) : (
              filteredDb.map((item, idx) => {
                const isSelected = activeSeries?.gameSynopsis === item.synopsis;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30"
                        : "bg-[#080d1a] border-white/10 hover:border-cyan-500/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-xs font-black text-white flex items-center gap-2">
                          {item.gameTitle}
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px]">
                              Active
                            </span>
                          )}
                        </span>
                        {item.sourceFile && (
                          <p className="text-[10px] text-zinc-500">From {item.sourceFile}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {activeSeries && onUpdateSeriesSynopsis && (
                          <button
                            onClick={() => {
                              onUpdateSeriesSynopsis(
                                activeSeries.id,
                                item.synopsis,
                                `Custom DB (${item.sourceFile || "Library"})`
                              );
                              onClose();
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                                : "bg-purple-600 hover:bg-purple-500 text-white"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isSelected ? "Applied" : "Apply to Active Series"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveFromDb(item.gameTitle)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete from custom DB library"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                      "{item.synopsis}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#080d1a] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {customDb.length} game synopses in database
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import { CloudUpload, Disc3, Mic, MicOff, Pause, Play, Settings2, Upload, WandSparkles, X } from "lucide-react";
import TabButton from "./TabButton";

function AudioInput  ({activeTab, setActiveTab,
    file, setFile, audioUrl, setAudioUrl,
    status, setStatus, recording, startRecording, stopRecording, recordingTime, 
    formatTime, error, handleDrop, fileInputRef, loadFile, audioRef, duration,
    setDuration, currentTime, setCurrentTime, playing, setPlaying,
    runDemoAnalysis, togglePlayback
    }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                  <div>
                    <h3 className="text-base font-semibold">Audio input</h3>
                    <p className="mt-1 text-xs text-[#7f8592]">
                      Choose your source to get started
                    </p>
                  </div>
                  <Settings2 size={18} className="text-[#777d89]" />
                </div>

                <div className="p-5 md:p-6">
                  <div className="mb-6 flex rounded-xl bg-[#090c12] p-1">
                    <TabButton
                      active={activeTab === "upload"}
                      onClick={() => setActiveTab("upload")}
                      icon={Upload}
                      label="Upload file"
                    />
                    <TabButton
                      active={activeTab === "microphone"}
                      onClick={() => setActiveTab("microphone")}
                      icon={Mic}
                      label="Microphone"
                    />
                  </div>

                  {activeTab === "upload" ? (
                    <div
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={handleDrop}
                      className="flex min-h-[235px] flex-col items-center justify-center rounded-xl border border-dashed border-[#414650] bg-[#0c0f15] p-6 text-center transition hover:border-[#b6f36b]/50"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b6f36b]/15 bg-[#b6f36b]/[0.07] text-[#b6f36b]">
                        <CloudUpload size={26} />
                      </div>
                      <h4 className="text-sm font-semibold">
                        Drop your audio file here
                      </h4>
                      <p className="mt-2 text-xs text-[#7c8290]">
                        Or browse files from your device
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-5 rounded-lg bg-[#b6f36b] px-5 py-2.5 text-xs font-bold text-[#18210d] transition hover:bg-[#c9ff86]"
                      >
                        Browse files
                      </button>
                      <p className="mt-4 text-[11px] text-[#666c78]">
                        MP3, WAV, OGG, M4A · Max 100 MB
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                        className="hidden"
                        onChange={(event) =>
                          loadFile(event.target.files?.[0])
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-[235px] flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#0c0f15] p-6 text-center">
                      <div
                        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                          recording
                            ? "animate-pulse bg-red-500/15 text-red-400"
                            : "bg-[#b6f36b]/10 text-[#b6f36b]"
                        }`}
                      >
                        {recording ? <Mic size={28} /> : <MicOff size={28} />}
                      </div>
                      <h4 className="text-sm font-semibold">
                        {recording ? "Recording audio..." : "Microphone input"}
                      </h4>
                      <p className="mt-2 text-xs text-[#858b97]">
                        {recording
                          ? `Recording duration: ${formatTime(recordingTime)}`
                          : "Capture audio directly from your microphone"}
                      </p>
                      <button
                        onClick={
                          recording ? stopRecording : startRecording
                        }
                        className={`mt-5 rounded-lg px-5 py-2.5 text-xs font-bold ${
                          recording
                            ? "bg-red-500 text-white"
                            : "bg-[#b6f36b] text-[#18210d]"
                        }`}
                      >
                        {recording ? "Stop recording" : "Start recording"}
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  {/* Audio player */}
                  <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0c0f15] p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#242a35] text-[#b6f36b]">
                        <Disc3 size={23} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {file ? file.name : "No audio selected"}
                        </p>
                        <p className="mt-1 text-[11px] text-[#777d89]">
                          {file
                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                            : "Upload or record audio to begin"}
                        </p>
                      </div>
                      {file && (
                        <button
                          onClick={() => {
                            setFile(null);
                            setAudioUrl(null);
                            setStatus("idle");
                            setPlaying(false);
                          }}
                          className="text-[#858b97] hover:text-white"
                        >
                          <X size={17} />
                        </button>
                      )}
                    </div>

                    <audio
                      ref={audioRef}
                      src={audioUrl || undefined}
                      onLoadedMetadata={(event) =>
                        setDuration(event.currentTarget.duration)
                      }
                      onTimeUpdate={(event) =>
                        setCurrentTime(event.currentTarget.currentTime)
                      }
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onEnded={() => setPlaying(false)}
                    />

                    <div className="flex items-center gap-3">
                      <button
                        disabled={!file}
                        onClick={togglePlayback}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b6f36b] text-[#18210d] disabled:opacity-30"
                      >
                        {playing ? <Pause size={16} /> : <Play size={16} />}
                      </button>

                      <span className="text-[11px] tabular-nums text-[#9da2ad]">
                        {formatTime(currentTime)}
                      </span>

                      <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={Math.min(currentTime, duration || 1)}
                        disabled={!file}
                        onChange={(event) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = Number(
                              event.target.value
                            );
                          }
                        }}
                        className="h-1 min-w-0 flex-1 cursor-pointer accent-[#b6f36b]"
                      />

                      <span className="text-[11px] tabular-nums text-[#9da2ad]">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={!file || status === "analyzing"}
                    onClick={runDemoAnalysis}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b6f36b] py-3.5 text-sm font-bold text-[#17210c] transition hover:bg-[#c9ff86] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <WandSparkles size={18} />
                    {status === "analyzing"
                      ? "Analyzing..."
                      : "Run demo analysis"}
                  </button>

                  <p className="mt-3 text-center text-[11px] text-[#777d89]">
                    Demo results only · ML model not connected yet
                  </p>
                </div>
              </section>
  )
}

export default AudioInput
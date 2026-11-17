
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AudioLines,
  BarChart3,
  CircleHelp,
  CloudUpload,
  Disc3,
  Info,
  Menu,
  Mic,
  MicOff,
  Music2,
  Pause,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import "./App.css";
import  Sidebar  from "./components/Sidebar";
import Metric from "./components/Metric";
import StatCard from "./components/StatCard";
import TabButton from "./components/TabButton";
import RecentAnalyses from "./components/RecentAnalyses";

const DEMO_GENRES = [
  { name: "Electronic", value: 68, color: "#a78bfa" },
  { name: "Pop", value: 19, color: "#60a5fa" },
  { name: "Hip-Hop", value: 8, color: "#fbbf24" },
  { name: "Rock", value: 3, color: "#fb7185" },
  { name: "Jazz", value: 2, color: "#34d399" },
];

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};

function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState("idle");
  const [history, setHistory] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [error, setError] = useState("");

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const loadFile = (selectedFile) => {
    if (!selectedFile) return;

    if (
      !selectedFile.type.startsWith("audio/") &&
      !/\.(mp3|wav|ogg|m4a|flac|webm)$/i.test(selectedFile.name)
    ) {
      setError("Please select a supported audio file.");
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setStatus("idle");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setError("Unable to play this audio file.");
      }
    } else {
      audio.pause();
    }
  };

  const startRecording = async () => {
    try {
      setError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone recording is not supported.");
      }

      if (!window.MediaRecorder) {
        throw new Error("MediaRecorder is not supported.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        if (blob.size > 0) {
          const extension = recorder.mimeType.includes("mp4")
            ? "m4a"
            : "webm";

          const recordedFile = new File(
            [blob],
            `recording-${Date.now()}.${extension}`,
            { type: blob.type }
          );

          loadFile(recordedFile);
          setActiveTab("upload");
        }

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to access microphone.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    setRecording(false);
    clearInterval(timerRef.current);
  };

  const runDemoAnalysis = () => {
    if (!file) return;

    setStatus("analyzing");

    // Demo only. Replace with real ML inference later.
    window.setTimeout(() => {
      setStatus("complete");
      setHistory((previous) => [
        {
          id: Date.now(),
          name: file.name,
          genre: "Electronic",
          confidence: 68,
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...previous,
      ].slice(0, 6));
    }, 1300);
  };

  const hasResult = status === "complete";

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f2f5]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          setActiveTab={setActiveTab}
        />

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 md:px-9">
            <div className="flex items-center gap-4">
              <button
                className="text-[#a1a5af] lg:hidden"
                onClick={() => setMobileMenu(true)}
              >
                <Menu size={23} />
              </button>

              <span className="text-sm font-medium text-[#c5c8d0]">
                Workspace
              </span>
              <span className="text-[#505561]">/</span>
              <span className="text-sm text-[#818693]">Overview</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-[#b6f36b]/20 bg-[#b6f36b]/[0.06] px-3 py-1.5 text-[11px] text-[#b6f36b] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b6f36b]" />
                LOCAL PROCESSING
              </span>
              <button
                title="About MusicLens"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] text-[#9297a3]"
              >
                <CircleHelp size={17} />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1350px] px-5 py-8 md:px-9 md:py-10">
            {/* Hero */}
            <div className="mb-9">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b6f36b]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6f36b]">
                  Audio analysis studio
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-tight md:text-[38px]">
                Understand your sound<span className="text-[#b6f36b]">.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#898e9b]">
                Explore audio, visualize frequencies, and discover musical
                genres through intelligent analysis.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <StatCard
                icon={Music2}
                label="Tracks analyzed"
                value={history.length.toString().padStart(2, "0")}
                detail="Current session"
              />
              <StatCard
                icon={BarChart3}
                label="Genre categories"
                value="06"
                detail="Planned classification"
              />
              <StatCard
                icon={Activity}
                label="Model status"
                value="Demo"
                detail="Integration pending"
              />
              <StatCard
                icon={ShieldCheck}
                label="Privacy"
                value="Local"
                detail="No server upload"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
              {/* Input panel */}
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

              {/* Results */}
              <section className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                  <div>
                    <h3 className="text-base font-semibold">Genre analysis</h3>
                    <p className="mt-1 text-xs text-[#7f8592]">
                      Classification results
                    </p>
                  </div>
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-[#898e9b]">
                    DEMO MODE
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {!hasResult ? (
                    <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center text-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1d222c] text-[#626b7a]">
                        <AudioLines size={37} />
                      </div>
                      <h4 className="text-sm font-semibold">
                        {status === "analyzing"
                          ? "Preparing demo results..."
                          : "Waiting for analysis"}
                      </h4>
                      <p className="mt-2 max-w-[230px] text-xs leading-6 text-[#777d89]">
                        Select an audio file and run the demo to preview
                        the classification interface.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-7 rounded-xl border border-[#b6f36b]/15 bg-[#b6f36b]/[0.05] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#9ca3af]">
                            TOP PREDICTED GENRE
                          </span>
                          <Sparkles size={16} className="text-[#b6f36b]" />
                        </div>
                        <h4 className="text-3xl font-semibold tracking-tight">
                          Electronic
                        </h4>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-[#b6f36b]">
                            68%
                          </span>
                          <span className="text-xs text-[#858b97]">
                            Demo probability
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          Genre distribution
                        </h4>
                        <Info size={15} className="text-[#7e8490]" />
                      </div>

                      <div className="space-y-5">
                        {DEMO_GENRES.map((genre) => (
                          <div key={genre.name}>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-[#c8cbd2]">
                                {genre.name}
                              </span>
                              <span className="text-xs tabular-nums text-[#a1a6b1]">
                                {genre.value}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#252a34]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${genre.value}%`,
                                  backgroundColor: genre.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mt-auto pt-7 text-[11px] leading-5 text-[#777d89]">
                        These values are placeholders. Actual predictions
                        will appear after model integration.
                      </p>
                    </>
                  )}
                </div>
              </section>
            </div>

            {/* Audio tools */}
            <section
              id="audio-tools"
              className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Audio visualization
                  </h3>
                  <p className="mt-1 text-xs text-[#7f8592]">
                    Visual audio workspace
                  </p>
                </div>
                <span className="rounded-md bg-white/[0.05] px-3 py-1.5 text-[11px] text-[#a0a5af]">
                  Visual preview
                </span>
              </div>

              <div className="p-6">
                <div className="relative flex h-[170px] items-center justify-center gap-[3px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0e14] px-4">
                  {Array.from({ length: 95 }, (_, i) => {
                    const height =
                      12 +
                      Math.abs(
                        Math.sin(i * 0.73) *
                          Math.cos(i * 0.19) *
                          Math.sin(i * 0.11 + 1)
                      ) *
                        115;

                    return (
                      <div
                        key={i}
                        className="min-w-[2px] flex-1 rounded-full bg-[#b6f36b]/70"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}

                  <span className="absolute bottom-3 left-4 text-[10px] text-[#686e7b]">
                    STATIC WAVEFORM PREVIEW
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Metric label="Tempo" value="—" unit="BPM" />
                  <Metric label="Musical key" value="—" unit="KEY" />
                  <Metric label="Energy" value="—" unit="LEVEL" />
                </div>
              </div>
            </section>

            {/* History */}
            {/* It Stores the audio data as a history of recent analyses in local storage */}
            <RecentAnalyses history={history} setHistory={setHistory} />

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-[#686e7b]">
              <span>© {new Date().getFullYear()} MusicLens</span>
              <span>Built with React · JavaScript · Tailwind CSS</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

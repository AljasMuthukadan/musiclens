
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  CircleHelp,
  Menu,
  Music2,
  ShieldCheck,

  
} from "lucide-react";
import "./App.css";
import  Sidebar  from "./components/Sidebar";
import StatCard from "./components/ui/StatCard";
import RecentAnalyses from "./components/RecentAnalyses";
import AudioTools from "./components/AudioTools";
import GenreAnalyses from "./components/GenreAnalyses";
import AudioInput from "./components/AudioInput";

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
              <AudioInput
                startRecording={startRecording}
                stopRecording={stopRecording}
                recording={recording}
                recordingTime={recordingTime}
                formatTime={formatTime}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                file={file}
                setFile={setFile}
                audioUrl={audioUrl}
                setAudioUrl={setAudioUrl}
                status={status}
                setStatus={setStatus}
                error={error}
                handleDrop={handleDrop}
                fileInputRef={fileInputRef}
                loadFile={loadFile}
                audioRef={audioRef}
                duration={duration}
                setDuration={setDuration}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                playing={playing}
                setPlaying={setPlaying}
                runDemoAnalysis={runDemoAnalysis}
                togglePlayback={togglePlayback}
              />

              {/* Genre Analyses : Results */}
              <GenreAnalyses DEMO_GENRES={DEMO_GENRES} hasResult={hasResult} status={status} />
            </div>

            {/* Audio tools */}
            <AudioTools />

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

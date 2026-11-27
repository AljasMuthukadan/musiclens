
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Music2,
  ShieldCheck,
} from "lucide-react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/ui/StatCard";
import RecentAnalyses from "./components/RecentAnalyses";
import AudioTools from "./components/AudioTools";
import GenreAnalyses from "./components/GenreAnalyses";
import AudioInput from "./components/AudioInput";
import NavBar from "./components/ui/NavBar";

import { formatTime } from "./utils/formatTime";

import useAudio from "./hooks/useAudio";
import useHistory from "./hooks/useHistory";
import useMicrophone from "./hooks/useMicrophone";
import { getWaveformData } from "./utils/audioVisualizer";

const DEMO_GENRES = [
  { name: "Electronic", value: 100, color: "#a78bfa" },
  { name: "Pop", value: 0, color: "#60a5fa" },
  { name: "Hip-Hop", value: 0, color: "#fbbf24" },
  { name: "Rock", value: 0, color: "#fb7185" },
  { name: "Jazz", value: 0, color: "#34d399" },
];

const generateRandomGenres = () => {
  let remaining = 100;

  DEMO_GENRES.forEach((genre, index) => {
    if (index === DEMO_GENRES.length - 1) {
      // Give the last genre whatever remains
      genre.value = remaining;
    } else {
      // Generate a random value within the remaining limit
      const value = Math.floor(
        Math.random() * (remaining + 1)
      );

      genre.value = value;
      remaining -= value;
    }
  })
  return DEMO_GENRES;
};


const NEW_GENRES = generateRandomGenres();
console.log("Randomized genre values:", NEW_GENRES);

function App() {
  // -----------------------------------
  //  Application UI state
  // -----------------------------------

  const [activeTab, setActiveTab] = useState("upload");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [error, setError] = useState("");
  const [waveform, setWaveform] = useState([]);
  
  // -----------------------------------
  //  Analysis state
  // -----------------------------------

  const [status, setStatus] = useState("idle");

  const resetAnalysis = () => {
    setStatus("idle");
  };

  const hasResult = status === "complete";

  // -----------------------------------
  // History hook
  // -----------------------------------

  const {
    history,
    addToHistory,
    clearHistory,
  } = useHistory();

  // -----------------------------------
  // Audio hook
  // -----------------------------------

  const audio = useAudio({
    setError,
    resetAnalysis,
  });

  // -----------------------------------
  // Microphone hook
  // -----------------------------------

  const microphone = useMicrophone({
    setError,

    onRecorded: (recordedFile) => {
      const loaded = audio.loadFile(recordedFile);

      if (loaded) {
        setActiveTab("upload");
      }
    },
  });

   

  // -----------------------------------
  // Demo analysis
  // -----------------------------------
  const runDemoAnalysis = async () => {
  if (!audio.file || status === "analyzing") {
    return;
  }

  setStatus("analyzing");
  setError("");

  const audioContext = new AudioContext();

  try {
    // Step 1: Read the file
    const arrayBuffer = await audio.file.arrayBuffer();

    // Step 2: Decode the audio
    const audioBuffer = await audioContext.decodeAudioData(
      arrayBuffer
    );

    // Step 3: Access the samples
    const samples = audioBuffer.getChannelData(0);

    const waveformData = getWaveformData(audioBuffer); // Get waveform data
    setWaveform(waveformData); // Update the waveform state
    console.log("Waveform data:", waveformData);
    // Step 4: Real model inference will go here

    addToHistory({
      fileName: audio.file.name,
      analysisDate: new Date().toLocaleString(),
      genres : NEW_GENRES,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      samples: samples.length,
    });

  } catch (error) {
    setError(error.message || "Audio analysis failed.");
    setStatus("idle");
  } finally {
    await audioContext.close();
  }
};


  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f2f5]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          setActiveTab={setActiveTab}
        />

        <main className="min-w-0 flex-1 ">

          {/* Mobile navigation */}
          <NavBar setMobileMenu={setMobileMenu} />

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
                Understand your sound
                <span className="text-[#b6f36b]">.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#898e9b]">
                Explore audio, visualize frequencies, and discover
                musical genres through intelligent analysis.
              </p>

            </div>

            {/* Statistics */}
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
                value={DEMO_GENRES.length.toString().padStart(2, "0")}
                detail="Demo classification"
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

            {/* Main content */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">

              {/* Audio input */}
              <AudioInput
                // Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}

                // File state
                file={audio.file}
                setFile={audio.setFile}
                audioUrl={audio.audioUrl}
                setAudioUrl={audio.setAudioUrl}

                // Upload
                fileInputRef={audio.fileInputRef}
                loadFile={audio.loadFile}
                handleDrop={audio.handleDrop}
                clearAudio={audio.clearAudio}

                // Audio element
                audioRef={audio.audioRef}

                // Playback
                playing={audio.playing}
                setPlaying={audio.setPlaying}
                togglePlayback={audio.togglePlayback}

                // Duration and progress
                duration={audio.duration}
                setDuration={audio.setDuration}
                currentTime={audio.currentTime}
                setCurrentTime={audio.setCurrentTime}
                formatTime={formatTime}

                // New audio event handlers
                handleLoadedMetadata={
                  audio.handleLoadedMetadata
                }
                handleTimeUpdate={
                  audio.handleTimeUpdate
                }
                handlePlay={audio.handlePlay}
                handlePause={audio.handlePause}
                handleEnded={audio.handleEnded}

                // New player controls
                seekTo={audio.seekTo}
                volume={audio.volume}
                changeVolume={audio.changeVolume}
                playbackRate={audio.playbackRate}
                changePlaybackRate={
                  audio.changePlaybackRate
                }

                // Microphone
                recording={microphone.recording}
                recordingTime={microphone.recordingTime}
                startRecording={microphone.startRecording}
                stopRecording={microphone.stopRecording}

                // Analysis
                status={status}
                setStatus={setStatus}
                runDemoAnalysis={runDemoAnalysis}

                // Errors
                error={error}
              />

              {/* Genre results */}
              <GenreAnalyses
                DEMO_GENRES={DEMO_GENRES}
                hasResult={hasResult}
                status={status}
              />

            </div>

            {/* Audio tools */}
            <AudioTools waveform={waveform} />

            {/* Analysis history */}
            <RecentAnalyses
              history={history}
              clearHistory={clearHistory}
            />

            {/* Footer */}
            <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-[#686e7b]">

              <span>
                © {new Date().getFullYear()} MusicLens
              </span>

              <span>
                Built with React · JavaScript · Tailwind CSS
              </span>

            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

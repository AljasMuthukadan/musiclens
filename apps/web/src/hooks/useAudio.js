
import { useEffect, useRef, useState } from "react";
import { validateAudioFile } from "../utils/validateAudioFile";

export default function useAudio({ setError, resetAnalysis }) {
  // 1. React state
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1);

  // 2. References to HTML elements
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // 3. Release old object URLs
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 4. Load a new audio file
  const loadFile = (selectedFile) => {
    if (!selectedFile) return false;

    const validationError = validateAudioFile(selectedFile);

    if (validationError) {
      setError(validationError);
      return false;
    }

    audioRef.current?.pause();

    setError("");
    resetAnalysis();

    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
    setPlaying(false);
    setDuration(0);
    setCurrentTime(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    return true;
  };

  // 5. Drag-and-drop support
  const handleDrop = (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files?.[0]);
  };

  // 6. Play or pause
  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !file) return;

    try {
      setError("");

      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setError("Unable to play this audio file.");
    }
  };

  // 7. Update progress when browser plays audio
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);
  };

  // 8. Read actual duration
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(
      Number.isFinite(audio.duration) ? audio.duration : 0
    );
  };

  // 9. Synchronize playback status
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  // 10. Seek to a specific time in seconds
  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;

    const target = Math.max(
      0,
      Math.min(seconds, audio.duration)
    );

    audio.currentTime = target;
    setCurrentTime(target);
  };

  // 11. Set volume between 0 and 1
  const changeVolume = (value) => {
    const nextVolume = Math.max(0, Math.min(1, value));

    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }

    setVolumeState(nextVolume);
  };

  // 12. Change playback speed
  const changePlaybackRate = (rate) => {
    if (!Number.isFinite(rate) || rate < 0.5 || rate > 2) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }

    setPlaybackRateState(rate);
  };

  // 13. Remove the current audio
  const clearAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setFile(null);
    setAudioUrl(null);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    resetAnalysis();
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 14. Expose functionality to React components
  return {
    file,
    setFile,
    audioUrl,
    setAudioUrl,
    playing,
    setPlaying,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    volume,
    playbackRate,
    audioRef,
    fileInputRef,
    loadFile,
    handleDrop,
    togglePlayback,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePlay,
    handlePause,
    handleEnded,
    seekTo,
    changeVolume,
    changePlaybackRate,
    clearAudio,
  };
}

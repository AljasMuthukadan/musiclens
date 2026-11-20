
import { useState, useRef, useEffect } from "react";
import { validateAudioFile } from "../utils/validateAudioFile";

export default function useAudio({ setError, resetAnalysis }) {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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

    return true;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !file) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setError("Unable to play this audio file.");
    }
  };

  const clearAudio = () => {
    audioRef.current?.pause();

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
    audioRef,
    fileInputRef,
    loadFile,
    handleDrop,
    togglePlayback,
    clearAudio,
  };
}

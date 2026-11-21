
import { useEffect, useRef, useState } from "react";

const MAX_RECORDING_SECONDS = 60;

export default function useMicrophone({
  setError,
  onRecorded,
}) {
  // 1. React state
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // 2. References
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const mountedRef = useRef(true);
  const startingRef = useRef(false);
  const stopRequestedRef = useRef(false);

  // Keep latest callback references
  const onRecordedRef = useRef(onRecorded);
  const setErrorRef = useRef(setError);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
    setErrorRef.current = setError;
  }, [onRecorded, setError]);

  // 3. Stop the timer
  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 4. Release microphone access
  const releaseMicrophone = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }
  };

  // 5. Stop recording
  const stopRecording = () => {
    stopRequestedRef.current = true;

    clearTimer();

    const recorder = recorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    }

    if (mountedRef.current) {
      setRecording(false);
    }
  };

  // 6. Start recording
  const startRecording = async () => {
    if (
      startingRef.current ||
      recorderRef.current?.state === "recording"
    ) {
      return;
    }

    startingRef.current = true;
    stopRequestedRef.current = false;

    try {
      setErrorRef.current("");

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone recording requires a supported browser and HTTPS or localhost."
        );
      }

      if (typeof MediaRecorder === "undefined") {
        throw new Error(
          "Your browser does not support audio recording."
        );
      }

      // Ask the browser for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // The user may have stopped while permission was pending
      if (!mountedRef.current || stopRequestedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      chunksRef.current = [];

      // Choose a format supported by this browser
      const preferredTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      const supportedType = preferredTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );

      const recorder = new MediaRecorder(
        stream,
        supportedType ? { mimeType: supportedType } : {}
      );

      recorderRef.current = recorder;

      // Collect audio chunks
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording errors
      recorder.onerror = () => {
        if (mountedRef.current) {
          setErrorRef.current("An error occurred while recording.");
        }
      };

      // Convert recorded chunks into a File
      recorder.onstop = () => {
        clearTimer();
        releaseMicrophone();

        if (mountedRef.current) {
          setRecording(false);
        }

        const mimeType =
          recorder.mimeType || "audio/webm";

        const blob = new Blob(chunksRef.current, {
          type: mimeType,
        });

        chunksRef.current = [];
        recorderRef.current = null;

        if (!mountedRef.current || blob.size === 0) {
          return;
        }

        const extension = mimeType.includes("mp4")
          ? "m4a"
          : mimeType.includes("ogg")
            ? "ogg"
            : "webm";

        const recordedFile = new File(
          [blob],
          `recording-${Date.now()}.${extension}`,
          { type: mimeType }
        );

        // Send the file back to App.jsx
        onRecordedRef.current(recordedFile);
      };

      recorder.start();

      setRecording(true);
      setRecordingTime(0);

      const startedAt = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - startedAt) / 1000
        );

        if (elapsed >= MAX_RECORDING_SECONDS) {
          setRecordingTime(MAX_RECORDING_SECONDS);
          stopRecording();
          return;
        }

        setRecordingTime(elapsed);
      }, 250);

    } catch (error) {
      releaseMicrophone();
      recorderRef.current = null;

      if (mountedRef.current) {
        setRecording(false);
        setErrorRef.current(
          error.message || "Unable to access microphone."
        );
      }
    } finally {
      startingRef.current = false;
    }
  };

  // 7. Cleanup when component unmounts
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stopRequestedRef.current = true;

      clearTimer();

      const recorder = recorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = null;
        recorder.stop();
      }

      releaseMicrophone();
    };
  }, []);

  // 8. Return functions and state
  return {
    recording,
    recordingTime,
    startRecording,
    stopRecording,
  };
}

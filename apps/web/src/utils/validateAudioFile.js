const MAX_FILE_SIZE = 100 * 1024 * 1024;

const SUPPORTED_FORMATS =
  /\.(mp3|wav|ogg|m4a|flac|webm)$/i;

export function validateAudioFile(file) {
  if (!file) {
    return "No audio file selected.";
  }

  if (file.size === 0) {
    return "The audio file is empty.";
  }

  if (
    !file.type.startsWith("audio/") &&
    !SUPPORTED_FORMATS.test(file.name)
  ) {
    return "Please select a supported audio file.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File size must not exceed 100 MB.";
  }

  return null;
}
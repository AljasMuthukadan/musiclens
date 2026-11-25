export function getWaveformData  (audioBuffer, samplesPerBar = 120)  {
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;

  const blockSize = Math.floor(totalSamples / samplesPerBar);
  const waveform = [];
  console.log("Total samples:", totalSamples);
  console.log("Block size:", blockSize);
  console.log("Channel data:", channelData);

  for (let i = 0; i < samplesPerBar; i++) {
    const start = i * blockSize;
    const end =
      i === samplesPerBar - 1
        ? totalSamples
        : start + blockSize;

    let max = 0;

    for (let j = start; j < end; j++) {
      max = Math.max(max, Math.abs(channelData[j]));
    }

    waveform.push(max);
  }

  return waveform;
}
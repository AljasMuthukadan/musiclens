import { getWaveformData } from "../utils/audioVisualizer";

 
 const audioDecoder = async (audio) => {
     if (!audio.file){
      throw new Error("No audio file provided");
    }
   try {
     const audioContext = new AudioContext();
     const arrayBuffer = await audio.file.arrayBuffer()
     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
     const samples = audioBuffer.getChannelData(0); // Get samples from the first channel
     const waveformData = await getWaveformData(audioBuffer); // Get waveform data 

     console.log("Audio samples:", samples);
     console.log("Sample rate:", audioBuffer.sampleRate);
     console.log("Duration:", audioBuffer.duration);
     console.log("Number of samples:", samples.length);
     console.log("Waveform data:", waveformData);
     return {
         samples,
         audioBuffer,
         arrayBuffer,
         waveformData
     }

     // Step 3: Feature extraction will go here
   }catch (error) {
     console.error("Error decoding audio:", error);
   }
 };

 export default audioDecoder;
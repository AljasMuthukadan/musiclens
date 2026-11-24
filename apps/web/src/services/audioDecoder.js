 
 const audioDecoder = async (audio) => {
     if (!audio.file){
      throw new Error("No audio file provided");
    }
   try {
     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
     const arrayBuffer = await audio.file.arrayBuffer()
     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
     const samples = audioBuffer.getChannelData(0); // Get samples from the first channel

     console.log("Audio samples:", samples);
     console.log("Sample rate:", audioBuffer.sampleRate);
     console.log("Duration:", audioBuffer.duration);
     console.log("Number of samples:", samples.length);

     return {
         samples,
         audioBuffer,
         arrayBuffer
     }

     // Step 3: Feature extraction will go here
   }catch (error) {
     console.error("Error decoding audio:", error);
   }
 };

 export default audioDecoder;
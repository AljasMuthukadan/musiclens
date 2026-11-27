import { useEffect, useRef } from "react";

function AudioVisualizer({waveform}) {
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas || !waveform.length) return

        const ctx = canvas.getContext('2d')

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        // Set the canvas size to match the displayed size
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        // Scale the context to account for the device pixel ratio
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Clear the canvas before drawing
        ctx.clearRect(0, 0, width, height);
        
        const barWidth = width / waveform.length ; // Width of each bar
        const centerY = height / 2; // Center of the canvas vertically

        waveform.forEach((value, index) => {
            const barHeight = value * height; // Scale the value to the canvas height
            const x = index * (barWidth + 1); // X position of the bar
            const y = centerY - barHeight / 2; // Y position to center the bar vertically

            // Draw the bar
            ctx.fillStyle = '#b6f36b'; // Color of the bars
            ctx.beginPath();

           ctx.roundRect(x, y, barWidth, barHeight, 5);
           ctx.fill();
        });
        
    }, [waveform])
        
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[170px] rounded-xl border border-white/[0.06] bg-[#0b0e14]"
    ></canvas>
  )
}

export default AudioVisualizer
import Metric from "./ui/Metric";
import AudioVisualizer  from "./AudioVisualizer";

function AudioTools ({ waveform }) {
  return (
    <section
              id="audio-tools"
              className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Audio visualization
                  </h3>
                  <p className="mt-1 text-xs text-[#7f8592]">
                    Visual audio workspace
                  </p>
                </div>
                <span className="rounded-md bg-white/[0.05] px-3 py-1.5 text-[11px] text-[#a0a5af]">
                  Visual preview
                </span>
              </div>

              <div className="p-6">
                
                 <AudioVisualizer waveform={waveform} />


                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Metric label="Tempo" value="—" unit="BPM" />
                  <Metric label="Musical key" value="—" unit="KEY" />
                  <Metric label="Energy" value="—" unit="LEVEL" />
                </div>
              </div>
            </section>
  )
}

export default AudioTools
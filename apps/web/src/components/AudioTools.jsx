import Metric from "./ui/Metric";


function AudioTools () {
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
                <div className="relative flex h-[170px] items-center justify-center gap-[3px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0e14] px-4">
                  {Array.from({ length: 95 }, (_, i) => {
                    const height =
                      12 +
                      Math.abs(
                        Math.sin(i * 0.08) *
                          Math.cos(i * 0.19) *
                          Math.sin(i * 0.11 + 1)
                      ) *
                        115;

                    return (
                      <div
                        key={i}
                        className="min-w-[2px] flex-1 rounded-full bg-[#b6f36b]/70"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}

                  <span className="absolute bottom-3 left-4 text-[10px] text-[#686e7b]">
                    STATIC WAVEFORM PREVIEW
                  </span>
                </div>

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
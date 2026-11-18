import { AudioLines, Info, Sparkles } from 'lucide-react';

function GenreAnalyses({hasResult, status, DEMO_GENRES}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                  <div>
                    <h3 className="text-base font-semibold">Genre analysis</h3>
                    <p className="mt-1 text-xs text-[#7f8592]">
                      Classification results
                    </p>
                  </div>
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[10px] text-[#898e9b]">
                    DEMO MODE
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {!hasResult ? (
                    <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center text-center">
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1d222c] text-[#626b7a]">
                        <AudioLines size={37} />
                      </div>
                      <h4 className="text-sm font-semibold">
                        {status === "analyzing"
                          ? "Preparing demo results..."
                          : "Waiting for analysis"}
                      </h4>
                      <p className="mt-2 max-w-[230px] text-xs leading-6 text-[#777d89]">
                        Select an audio file and run the demo to preview
                        the classification interface.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-7 rounded-xl border border-[#b6f36b]/15 bg-[#b6f36b]/[0.05] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-[#9ca3af]">
                            TOP PREDICTED GENRE
                          </span>
                          <Sparkles size={16} className="text-[#b6f36b]" />
                        </div>
                        <h4 className="text-3xl font-semibold tracking-tight">
                          Electronic
                        </h4>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-[#b6f36b]">
                            68%
                          </span>
                          <span className="text-xs text-[#858b97]">
                            Demo probability
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          Genre distribution
                        </h4>
                        <Info size={15} className="text-[#7e8490]" />
                      </div>

                      <div className="space-y-5">
                        {DEMO_GENRES.map((genre) => (
                          <div key={genre.name}>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-[#c8cbd2]">
                                {genre.name}
                              </span>
                              <span className="text-xs tabular-nums text-[#a1a6b1]">
                                {genre.value}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[#252a34]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${genre.value}%`,
                                  backgroundColor: genre.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mt-auto pt-7 text-[11px] leading-5 text-[#777d89]">
                        These values are placeholders. Actual predictions
                        will appear after model integration.
                      </p>
                    </>
                  )}
                </div>
              </section>
  )
}

export default GenreAnalyses;

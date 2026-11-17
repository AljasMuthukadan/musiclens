import { Clock3, FileAudio, RotateCcw } from "lucide-react";


function RecentAnalyses ({setHistory, history}){
  return (
    <section
              id="history"
              className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Recent analyses
                  </h3>
                  <p className="mt-1 text-xs text-[#7f8592]">
                    Results from your current session
                  </p>
                </div>
                <button
                  onClick={() => setHistory([])}
                  className="flex items-center gap-2 text-xs text-[#9ca2ae] hover:text-white"
                >
                  <RotateCcw size={14} />
                  Clear
                </button>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <Clock3 size={26} className="mb-3 text-[#5f6674]" />
                  <p className="text-sm text-[#c0c4cd]">
                    No analyses yet
                  </p>
                  <p className="mt-2 text-xs text-[#777d89]">
                    Your session activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#222834] text-[#b6f36b]">
                        <FileAudio size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[11px] text-[#777d89]">
                          {item.date} · Demo result
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">
                          {item.genre}
                        </p>
                        <p className="mt-1 text-[11px] text-[#b6f36b]">
                          {item.confidence}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
  )
}

export default RecentAnalyses;
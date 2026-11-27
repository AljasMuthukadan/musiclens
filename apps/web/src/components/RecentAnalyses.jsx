
import { Clock3, FileAudio, RotateCcw } from "lucide-react";

function RecentAnalyses({ history, clearHistory }) {
  return (
    <section
      id="history"
      className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-sm font-semibold sm:text-base">
            Recent analyses
          </h3>
          <p className="mt-1 text-[11px] text-[#7f8592] sm:text-xs">
            Results from your current session
          </p>
        </div>

        <button
          onClick={clearHistory}
          className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#9ca2ae] transition hover:bg-white/[0.05] hover:text-white"
        >
          <RotateCcw size={14} />
          Clear
        </button>
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
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
          {history.slice().reverse().map((item) => (
            <div
              key={item.id}
              className="flex min-w-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-5"
            >
              {/* Left: Audio file details */}
              <div className="flex min-w-0 items-center gap-3 sm:flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#222834] text-[#b6f36b]">
                  <FileAudio size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[#f1f2f5] sm:text-sm">
                    {item.fileName}
                  </p>

                  <p className="mt-1 text-[10px] text-[#777d89] sm:text-[11px]">
                    {item.analysisDate} · Demo result
                  </p>
                </div>
              </div>

              {/* Right: Genre percentages in one row */}
              <div className="flex min-w-0 items-center gap-4 overflow-x-auto pl-12 scrollbar-none sm:pl-0 sm:gap-5">
                {item.genres.map((genre, index) => (
                  <div
                    key={`${item.id}-${genre.name}-${index}`}
                    className="shrink-0 text-left sm:text-right"
                  >
                    <p className="text-[10px] text-[#858b98] sm:text-[11px]">
                      {genre.name}
                    </p>

                    <p className="mt-1 text-xs font-semibold tabular-nums text-[#b6f36b]">
                      {genre.value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentAnalyses;

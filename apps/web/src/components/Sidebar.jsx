
import {
  Activity,
  AudioLines,
  Clock3,
  Headphones,
  Mic,
  MoreHorizontal,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
 export const Sidebar = ({ mobileMenu, setMobileMenu, setActiveTab }) => {
  return (
    <>
      <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[245px] flex-col border-r border-white/[0.07] bg-[#0e1016] p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-11 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b6f36b] text-[#17210e]">
                <AudioLines size={23} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  musiclens<span className="text-[#b6f36b]">.</span>
                </h1>
                <p className="text-[10px] tracking-[0.15em] text-[#747986]">
                  AUDIO INTELLIGENCE
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenu(false)}
              className="lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#626775]">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            <SidebarItem
              icon={Activity}
              label="Dashboard"
              active
            />
            <SidebarItem
              icon={Clock3}
              label="History"
              onClick={() =>
                document.getElementById("history")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            />
            <SidebarItem
              icon={SlidersHorizontal}
              label="Audio tools"
              onClick={() =>
                document.getElementById("audio-tools")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            />
          </nav>

          <p className="mb-3 mt-9 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#626775]">
            INPUT SOURCES
          </p>

          <nav className="space-y-1">
            <SidebarItem
              icon={Upload}
              label="Upload audio"
              onClick={() => setActiveTab("upload")}
            />
            <SidebarItem
              icon={Mic}
              label="Microphone"
              onClick={() => setActiveTab("microphone")}
            />
            <SidebarItem
              icon={Radio}
              label="Browser extension"
              disabled
            />
          </nav>

          <div className="mt-auto">
            <div className="rounded-xl border border-[#b6f36b]/15 bg-[#b6f36b]/[0.05] p-4">
              <Sparkles size={19} className="mb-3 text-[#b6f36b]" />
              <p className="text-sm font-semibold">Built for curious ears.</p>
              <p className="mt-2 text-xs leading-relaxed text-[#858a96]">
                Discover the science behind every sound.
              </p>
              <span className="mt-4 inline-flex rounded-md bg-white/[0.06] px-2 py-1 text-[10px] text-[#aeb3bf]">
                DEVELOPMENT BUILD
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#272c36] text-[#b6f36b]">
                <Headphones size={17} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Local workspace</p>
                <p className="text-[11px] text-[#777d89]">
                  Personal project
                </p>
              </div>
              <MoreHorizontal size={17} className="text-[#777d89]" />
            </div>
          </div>
        </aside>

        {mobileMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setMobileMenu(false)}
          />
        ) }

        </>
  )
}


export default Sidebar
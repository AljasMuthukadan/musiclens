import { CircleHelp, Menu } from "lucide-react";

function NavBar({ setMobileMenu }) {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 md:px-9">
            <div className="flex items-center gap-4">
              <button
                className="text-[#a1a5af] lg:hidden"
                onClick={() => setMobileMenu(true)}
              >
                <Menu size={23} />
              </button>

              <span className="text-sm font-medium text-[#c5c8d0]">
                Workspace
              </span>
              <span className="text-[#505561]">/</span>
              <span className="text-sm text-[#818693]">Overview</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-[#b6f36b]/20 bg-[#b6f36b]/[0.06] px-3 py-1.5 text-[11px] text-[#b6f36b] sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b6f36b]" />
                LOCAL PROCESSING
              </span>
              <button
                title="About MusicLens"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] text-[#9297a3]"
              >
                <CircleHelp size={17} />
              </button>
            </div>
          </header>
  )
}

export default NavBar
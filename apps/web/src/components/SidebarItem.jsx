 function SidebarItem({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[13px] transition ${
        active
          ? "bg-[#b6f36b]/[0.09] font-medium text-[#b6f36b]"
          : disabled
          ? "cursor-not-allowed text-[#555b67]"
          : "text-[#9298a5] hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {disabled && (
        <span className="text-[9px] text-[#555b67]">SOON</span>
      )}
    </button>
  );
}

export default SidebarItem;
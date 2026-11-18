function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-medium transition ${
        active
          ? "bg-[#252a34] text-white shadow-sm"
          : "text-[#7d8390] hover:text-white"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default TabButton;
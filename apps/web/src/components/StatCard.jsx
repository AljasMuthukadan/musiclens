function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-4 md:p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs text-[#858b97]">{label}</span>
        <Icon size={17} className="text-[#8d94a1]" />
      </div>
      <p className="text-2xl font-semibold tracking-tight md:text-[28px]">
        {value}
      </p>
      <p className="mt-2 text-[11px] text-[#777d89]">{detail}</p>
    </div>
  );
}
export default StatCard;
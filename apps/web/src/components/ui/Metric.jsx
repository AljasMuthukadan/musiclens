 function Metric({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0b0e14] p-4">
      <p className="text-[11px] text-[#7f8592]">{label}</p>
      <p className="mt-3 text-xl font-semibold">
        {value}
        <span className="ml-2 text-[10px] font-normal text-[#747b88]">
          {unit}
        </span>
      </p>
    </div>
  );
}

export default Metric;
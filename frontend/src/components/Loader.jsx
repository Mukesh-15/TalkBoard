import { useLoader } from "../context/LoaderContext";


export default function Loader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f0f0f7]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner ring */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
        </div>
        <span className="text-sm font-semibold text-orange-500 tracking-wide">
          Loading…
        </span>
      </div>
    </div>
  );
}

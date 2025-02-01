export function LoadingPokeball() {
  return (
    <div className="relative w-16 h-16 animate-bounce">
      <div className="absolute w-full h-full rounded-full border-4 border-t-red-500 border-b-red-500 border-l-white border-r-white animate-spin">
        <div className="absolute inset-[45%] rounded-full bg-white border-2 border-gray-800"></div>
      </div>
    </div>
  );
} 
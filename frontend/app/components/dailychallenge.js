'use client';

export default function DailyChallenge() {
  return (
    <div className="bg-gradient-to-r from-[#FFA75F] to-[#ff8c3d] rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between text-white gap-4">
        <div>
          <p className="text-xs lg:text-sm font-semibold opacity-90">DÉFI DU JOUR</p>
          <h2 className="text-xl lg:text-2xl font-bold mt-1 mb-2">Course de 5km</h2>
          <p className="text-xs lg:text-sm opacity-90">Rejoins 234 athlètes qui l ont déjà relevé !</p>
        </div>
        <button className="bg-white text-[#FFA75F] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform text-sm lg:text-base whitespace-nowrap">
          Participer
        </button>
      </div>
    </div>
  );
}
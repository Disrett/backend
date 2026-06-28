'use client';

export default function FeaturedAthletes({ athletes }) {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6 shadow-lg border-2 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#0047AB]">⭐ Athlètes de la semaine</h2>
        <span className="text-xs lg:text-sm text-gray-500 hidden sm:inline">Mis à jour aujourd hui</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {athletes.map((athlete) => (
          <div 
            key={athlete.id} 
            className="bg-gradient-to-br from-[#0047AB]/5 to-[#FFA75F]/5 rounded-xl p-4 border-2 border-[#0047AB]/20 hover:border-[#FFA75F] transition-all hover:shadow-md cursor-pointer group"
          >
            <div className="flex justify-end mb-2">
              <span className="text-2xl lg:text-3xl">{athlete.badge}</span>
            </div>
            
            <div className="flex justify-center mb-3">
              <div className="relative">
                <img 
                  src={athlete.image} 
                  alt={athlete.name}
                  className="w-16 lg:w-20 h-16 lg:h-20 rounded-full ring-4 ring-[#0047AB] group-hover:ring-[#FFA75F] transition-all"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#FFA75F] rounded-full p-1.5">
                  <svg className="w-3 lg:w-4 h-3 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h3 className="text-center font-bold text-[#0047AB] text-base lg:text-lg mb-1">
              {athlete.name}
            </h3>
            
            <div className="text-center mb-2">
              <span className="inline-block bg-[#FFA75F] text-white text-xs font-semibold px-2 lg:px-3 py-1 rounded-full">
                {athlete.achievement}
              </span>
            </div>
            
            <p className="text-center text-xs lg:text-sm text-gray-600 mb-3 min-h-[40px]">
              {athlete.description}
            </p>
            
            <div className="flex justify-around text-xs text-gray-500 mb-3 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="font-bold text-[#0047AB]">{athlete.stats.posts}</div>
                <div>Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-[#0047AB]">{athlete.stats.followers}</div>
                <div>Abonnés</div>
              </div>
            </div>
            
            <button className="w-full bg-[#0047AB] hover:bg-[#FFA75F] text-white font-semibold py-2 rounded-full transition-all group-hover:scale-105 text-sm lg:text-base">
              Suivre
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
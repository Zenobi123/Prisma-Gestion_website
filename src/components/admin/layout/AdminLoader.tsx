
export const AdminLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2E1A47]"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-[#D6DD00] opacity-20"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-[#2E1A47] animate-fade-in">
            Console d'administration
          </h2>
          <p className="text-gray-500 animate-fade-in delay-100">
            Chargement de votre espace de travail...
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#2E1A47] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#2E1A47] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#2E1A47] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

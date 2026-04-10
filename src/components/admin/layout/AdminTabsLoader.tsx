
export const AdminTabsLoader = () => {
  return (
    <div className="flex items-center justify-center p-8 h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E1A47]"></div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#2E1A47] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#2E1A47] rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-[#2E1A47] rounded-full animate-pulse delay-200"></div>
        </div>
        <p className="text-sm text-gray-500 animate-fade-in">Chargement...</p>
      </div>
    </div>
  );
};

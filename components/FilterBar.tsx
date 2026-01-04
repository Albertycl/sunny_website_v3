
import React from 'react';

interface FilterBarProps {
  onFilterChange: (type: string, value: string) => void;
  currentFilters: {
    departureCity: string;
    destination: string;
    month: string;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, currentFilters }) => {
  const cities = ['全部城市', '桃園', '台中', '高雄'];
  const destinations = ['全部目的地', '韓國', '埃及', '土耳其', '日本', '東南亞'];
  const months = ['全部月份', '01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl -mt-12 relative z-30 max-w-5xl mx-auto border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">出發城市</label>
        <select 
          className="w-full bg-gray-50 border-none rounded-lg p-3 text-gray-700 font-medium focus:ring-2 focus:ring-amber-400 outline-none transition-all"
          value={currentFilters.departureCity}
          onChange={(e) => onFilterChange('departureCity', e.target.value)}
        >
          {cities.map(c => <option key={c} value={c === '全部城市' ? '' : c}>{c}</option>)}
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">目的地</label>
        <select 
          className="w-full bg-gray-50 border-none rounded-lg p-3 text-gray-700 font-medium focus:ring-2 focus:ring-amber-400 outline-none transition-all"
          value={currentFilters.destination}
          onChange={(e) => onFilterChange('destination', e.target.value)}
        >
          {destinations.map(d => <option key={d} value={d === '全部目的地' ? '' : d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">出發月份</label>
        <select 
          className="w-full bg-gray-50 border-none rounded-lg p-3 text-gray-700 font-medium focus:ring-2 focus:ring-amber-400 outline-none transition-all"
          value={currentFilters.month}
          onChange={(e) => onFilterChange('month', e.target.value)}
        >
          {months.map(m => <option key={m} value={m === '全部月份' ? '' : m}>{m}</option>)}
        </select>
      </div>

      <button 
        className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 active:scale-95"
        onClick={() => {}} // Could trigger a manual search if needed
      >
        搜尋團體
      </button>
    </div>
  );
};

export default FilterBar;

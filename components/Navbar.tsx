
import React from 'react';
import { SUNNY_CONTACTS } from '../constants';

interface NavbarProps {
  onNavClick: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavClick('hero')}>
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-bold text-white text-xl">S</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">韓國導遊領隊桑尼Sunny</h1>
              <p className="text-xs text-amber-600 font-medium tracking-wide">專業領隊</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavClick('tours')} className="text-gray-600 hover:text-amber-500 font-medium transition-colors text-sm">尋找團體</button>
            <button onClick={() => onNavClick('feed')} className="text-gray-600 hover:text-amber-500 font-medium transition-colors text-sm">如何找到Sunny</button>


            <a
              href={SUNNY_CONTACTS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-5 py-2 rounded-full font-medium hover:bg-green-600 transition-all shadow-md active:scale-95 text-sm"
            >
              一鍵 LINE 諮詢
            </a>
          </div>

          <div className="md:hidden">

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

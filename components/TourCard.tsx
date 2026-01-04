
import React, { useState } from 'react';
import { Tour } from '../types';
import { SUNNY_CONTACTS } from '../constants';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const [imageError, setImageError] = useState(false);

  // 根據目的地名稱產生唯一的漸層配色
  const getGradientColors = (str: string) => {
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [
      ['#f59e0b', '#f97316'], // Orange
      ['#3b82f6', '#2563eb'], // Blue
      ['#10b981', '#059669'], // Green
      ['#8b5cf6', '#7c3aed'], // Purple
      ['#ef4444', '#dc2626'], // Red
    ];
    return hues[hash % hues.length];
  };

  const colors = getGradientColors(tour.destination);
  
  // 優化後的 SVG 備援 (使用 Base64 編碼避免字元錯誤)
  const getFallbackImage = () => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
        <defs>
          <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style='stop-color:${colors[0]};stop-opacity:1' />
            <stop offset='100%' style='stop-color:${colors[1]};stop-opacity:1' />
          </linearGradient>
        </defs>
        <rect width='800' height='500' fill='url(#g)' />
        <text x='50%' y='45%' font-family='sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle'>${tour.destination}</text>
        <text x='50%' y='55%' font-family='sans-serif' font-size='22' fill='white' fill-opacity='0.7' text-anchor='middle'>Sunny Visit Korea</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const transformGoogleDriveUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
      }
    }
    return url;
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 group flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 w-full flex items-center justify-center">
        <img 
          src={imageError ? getFallbackImage() : transformGoogleDriveUrl(tour.image)} 
          alt={tour.title} 
          onError={() => setImageError(true)}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ${!imageError && 'group-hover:scale-110'}`}
        />
        
        <div className="absolute top-4 left-4 flex gap-2 z-20">
          <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 shadow-sm uppercase tracking-wide">
            {tour.departureCity}出發
          </span>
          {tour.isFull && (
            <span className="bg-red-500 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wide">
              已滿團
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-amber-600 text-xs font-bold mb-2 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {tour.destination}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-amber-500 transition-colors">
          {tour.title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
          {tour.description}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">預計出發</span>
               <span className="text-sm font-bold text-gray-700">{tour.departureDate}</span>
             </div>
             <div className="text-right">
               <span className="text-[10px] text-amber-600 font-bold uppercase block">熱烈報名中</span>
             </div>
          </div>
          
          <div className="flex gap-2">
            <a 
              href={tour.itineraryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-amber-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              行程表 PDF
            </a>
            <a 
              href={SUNNY_CONTACTS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-all shadow-md flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.603.391.084.922.258 1.057.592.12.3.077.769.038 1.073l-.164 1.051c-.049.328-.242 1.284 1.042.7.531-.242 2.859-1.685 3.903-2.887l.001-.001c2.478-2.548 3.987-5.067 3.987-7.332z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

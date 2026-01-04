
import React from 'react';
import { MOCK_TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {MOCK_TESTIMONIALS.map((t) => (
        <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
          <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-2 border-amber-100" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{t.name}</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{t.tourName}</span>
            </div>
            <div className="flex text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">「{t.content}」</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;

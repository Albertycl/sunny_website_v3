
import React, { useState, useEffect } from 'react';
import { Tour } from '../types';

interface HeroProps {
  upcomingTour: Tour;
}

const Hero: React.FC<HeroProps> = ({ upcomingTour }) => {
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const transformGoogleDriveUrl = (url: string) => {
    if (!url) return url;
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
      }
    }
    return url;
  };

  useEffect(() => {
    const targetDate = new Date(upcomingTour.departureDate).getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingTour]);

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {!imageError && transformGoogleDriveUrl(upcomingTour.image) ? (
        <img
          src={transformGoogleDriveUrl(upcomingTour.image)}
          alt="Main Hero"
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
        </div>
      )}

      <div className="relative z-20 text-center text-white px-4 max-w-4xl">
        <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest animate-bounce">
          最新行程公佈
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg leading-tight">
          {upcomingTour.title}
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md font-medium">
          {upcomingTour.description}
        </p>

        <div className="flex justify-center gap-4 md:gap-8 mb-10">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Sec', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-md w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-1 border border-white/30">
                <span className="text-2xl md:text-3xl font-bold">{item.value.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-tighter opacity-80">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={upcomingTour.itineraryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            立即下載行程表
          </a>
          <button className="bg-transparent border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all active:scale-95">
            諮詢報名資訊
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Hero;

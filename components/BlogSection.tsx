
import React, { useState, useEffect } from 'react';
import { getSunnyInsights } from '../services/geminiService';

const BlogSection: React.FC = () => {
  const [insight, setInsight] = useState<string>('正在獲取 Sunny 的領隊秘笈...');
  const [topic, setTopic] = useState('韓國行李怎麼帶');

  useEffect(() => {
    const fetchInsight = async () => {
      setInsight('正在思考中...');
      const text = await getSunnyInsights(topic);
      setInsight(text || '');
    };
    fetchInsight();
  }, [topic]);

  const topics = ['韓國行李怎麼帶', '埃及必買清單', '如何挑選跟團行程', '百威旅行社的服務特色'];

  return (
    <div className="bg-amber-50 rounded-3xl p-8 md:p-12 border border-amber-100">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sunny 的私房推薦</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            不只是帶團，我更想分享我的旅遊心得與小撇步。點擊下方主題，看看我為大家整理的專屬內容！
          </p>
          <div className="flex flex-col gap-3">
            {topics.map(t => (
              <button 
                key={t}
                onClick={() => setTopic(t)}
                className={`text-left px-5 py-3 rounded-xl font-medium transition-all ${topic === t ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-amber-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-2/3 bg-white p-8 rounded-2xl shadow-xl min-h-[300px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V6C10.017 5.44772 10.4647 5 11.017 5H19.017C20.6739 5 22.017 6.34315 22.017 8V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H0.017C-0.535279 13 -1.017 12.5523 -1.017 12V6C-1.017 5.44772 -0.535279 5 0.017 5H8.017C9.67386 5 11.017 6.34315 11.017 8V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-amber-600 mb-4">{topic}</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {insight}
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-full"></div>
            <div>
              <p className="text-sm font-bold">Sunny</p>
              <p className="text-xs text-gray-400">百威旅行社 專業領隊</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

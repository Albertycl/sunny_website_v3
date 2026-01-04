
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TourCard from './components/TourCard';
import SocialFeed from './components/SocialFeed';
import BlogSection from './components/BlogSection';
import Testimonials from './components/Testimonials';
import AdminPanel from './components/AdminPanel';
import { MOCK_TOURS, MOCK_SOCIAL_POSTS, SUNNY_CONTACTS } from './constants';
import { Tour, SocialPost } from './types';
import { fetchLatestSocialFeed } from './services/geminiService';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);

  const heroRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  const [featuredTourId, setFeaturedTourId] = useState<string>('');

  useEffect(() => {
    // Load tours from localStorage or fallback to MOCK_TOURS
    const savedTours = localStorage.getItem('sunny_tours');
    if (savedTours) {
      setTours(JSON.parse(savedTours));
    } else {
      setTours(MOCK_TOURS);
      localStorage.setItem('sunny_tours', JSON.stringify(MOCK_TOURS));
    }

    const savedFeaturedId = localStorage.getItem('sunny_featured_tour_id');
    if (savedFeaturedId) {
      setFeaturedTourId(savedFeaturedId);
    }

    const loadFeed = async () => {
      const dynamicPosts = await fetchLatestSocialFeed() as SocialPost[];
      setPosts([...dynamicPosts, ...MOCK_SOCIAL_POSTS]);
    };
    loadFeed();
  }, []);

  const handleNavClick = (section: string) => {
    if (isAdmin) {
      setIsAdmin(false);
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      hero: heroRef,
      tours: toursRef,
      feed: feedRef,
      blog: blogRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateTours = (newTours: Tour[]) => {
    setTours(newTours);
    localStorage.setItem('sunny_tours', JSON.stringify(newTours));
  };

  const handleSetFeaturedTour = (id: string) => {
    setFeaturedTourId(id);
    localStorage.setItem('sunny_featured_tour_id', id);
  };

  if (isAdmin) {
    return (
      <AdminPanel
        tours={tours}
        onUpdateTours={updateTours}
        onExit={() => setIsAdmin(false)}
        featuredTourId={featuredTourId}
        onSetFeaturedTour={handleSetFeaturedTour}
      />
    );
  }

  const featuredTour = tours.find(t => t.id === featuredTourId) || (tours.length > 0 ? tours[0] : MOCK_TOURS[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        onNavClick={handleNavClick}
        onAdminClick={() => setIsAdmin(true)}
      />

      <main className="flex-grow">
        <section ref={heroRef}>
          <Hero upcomingTour={featuredTour} />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <section ref={toursRef} className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">近期帶隊行程</h2>
                <p className="text-gray-500 font-medium text-lg">Sunny 親自踩點、嚴選高品質路線。</p>
              </div>
              <div className="flex items-center gap-4">
                <a href={SUNNY_CONTACTS.line} className="text-amber-600 font-bold hover:underline flex items-center gap-1">
                  諮詢完整檔期表 →
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {tours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
              {tours.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                  <p className="text-gray-400 font-medium">目前沒有行程，請到後台新增。</p>
                </div>
              )}
            </div>
          </section>

          <section ref={feedRef} className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">社群動態</h2>
            <p className="text-gray-500 font-medium mb-10">同步 YouTube 與 Facebook 最新貼文。</p>
            <SocialFeed posts={posts} />
          </section>

          <section ref={blogRef} className="mt-32">
            <BlogSection />
          </section>

          <section className="mt-32 py-16 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
            <div className="relative z-10 px-8">
              <h2 className="text-3xl font-bold text-center mb-12">為什麼選我們？</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div>
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <h4 className="font-bold text-xl mb-3">百威旅行社雙重保障</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">老牌資深旅行社與網紅領隊強力聯手。</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h4 className="font-bold text-xl mb-3">Sunny 親自帶隊</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">打造最溫馨的旅遊互動體驗。</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h4 className="font-bold text-xl mb-3">一站式全方位服務</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">從證照代辦到機票訂位，一鍵諮詢經紀人。</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">旅客真實評價</h2>
            <Testimonials />
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Sunny Visit Korea</h3>
              <button
                onClick={() => setIsAdmin(true)}
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors uppercase tracking-widest mt-4 flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                行程管理後台
              </button>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs text-amber-500">快速連結</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavClick('tours')}>最新行程</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavClick('blog')}>旅遊秘笈</li>
                <li><a href="https://brevet.com.tw/" target="_blank" className="hover:text-white transition-colors">百威旅行社官網</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs text-amber-500">聯絡資訊</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href={SUNNY_CONTACTS.managerContact} target="_blank" className="hover:text-white transition-colors">經紀人聯繫</a></li>
                <li>Line 客服：@sunny_korea</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs text-amber-500">訂閱早鳥優惠</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="您的 Email" className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-amber-500" />
                <button className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors">訂閱</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2024 Sunny Visit Korea x 百威旅行社. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

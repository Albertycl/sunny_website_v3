
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TourCard from './components/TourCard';
import WeatherOutfit from './components/WeatherOutfit';



import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { MOCK_TOURS, SUNNY_CONTACTS } from './constants';
import { Tour } from './types';


const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [tours, setTours] = useState<Tour[]>([]);


  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const toursRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);


  const [featuredTourId, setFeaturedTourId] = useState<string>('');

  useEffect(() => {
    // Check if we are on the admin route
    const checkRoute = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setIsAdminRoute(true);
        // Check session storage for persistence if desired, or just rely on state
        const sessionAuth = sessionStorage.getItem('sunny_admin_auth');
        if (sessionAuth === 'true') {
          setIsAuthenticated(true);
        }
      } else {
        setIsAdminRoute(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);

    // Load tours from localStorage or fallback to MOCK_TOURS
    const savedTours = localStorage.getItem('sunny_tours_v4');
    if (savedTours) {
      setTours(JSON.parse(savedTours));
    } else {
      setTours(MOCK_TOURS);
      localStorage.setItem('sunny_tours_v4', JSON.stringify(MOCK_TOURS));
    }

    const savedFeaturedId = localStorage.getItem('sunny_featured_tour_id');
    if (savedFeaturedId) {
      setFeaturedTourId(savedFeaturedId);
    }



    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const handleNavClick = (section: string) => {
    // If we are in admin mode/route and click nav, we should probably go back to home?
    // But since this is a single page app logic for the main site:
    if (isAdminRoute) {
      // Go to root
      window.history.pushState(null, '', '/');
      setIsAdminRoute(false);
      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      hero: heroRef,
      services: servicesRef,
      tours: toursRef,
      feed: feedRef,

    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateTours = (newTours: Tour[]) => {
    setTours(newTours);
    localStorage.setItem('sunny_tours_v4', JSON.stringify(newTours));
  };

  const handleSetFeaturedTour = (id: string) => {
    setFeaturedTourId(id);
    localStorage.setItem('sunny_featured_tour_id', id);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('sunny_admin_auth', 'true');
  };

  const handleAdminExit = () => {
    setIsAdminRoute(false);
    setIsAuthenticated(false);
    sessionStorage.removeItem('sunny_admin_auth');
    window.history.pushState(null, '', '/');
  };

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />;
    }
    return (
      <AdminPanel
        tours={tours}
        onUpdateTours={updateTours}
        onExit={handleAdminExit}
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
      />

      <main className="flex-grow">
        <section ref={heroRef}>
          <Hero upcomingTour={featuredTour} />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <section className="mt-8 mb-24">
            <WeatherOutfit />
          </section>
          <section ref={servicesRef} className="mb-24 mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">服務內容與流程</h2>
              <p className="mt-4 text-xl text-gray-500">Sunny 團隊提供全方位的韓國旅遊服務</p>
            </div>

            {/* Row 1: Vertical Images Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <img src="/images/services/team.jpg" alt="專業團隊介紹" className="w-full h-auto object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <img src="/images/services/overview.jpg" alt="旅遊方案全攻略" className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Row 2 & 3: Horizontal Images Stacked */}
            <div className="flex flex-col gap-8">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <img src="/images/services/custom.jpg" alt="客製化包團說明" className="w-full h-auto object-cover" />
              </div>

              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <img src="/images/services/inquiry.jpg" alt="機加酒詢價流程" className="w-full h-auto object-cover" />
              </div>
            </div>
          </section>

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
                  <p className="text-gray-400 font-medium">目前沒有行程。</p>
                </div>
              )}
            </div>
          </section>



          <section ref={feedRef} className="mt-32">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">如何找到Sunny</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a
                href={SUNNY_CONTACTS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                <div className="relative w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Facebook 粉絲專頁</h3>
                  <p className="text-gray-500 text-sm mb-3">追蹤桑尼的最新帶團動態與旅遊分享</p>
                  <span className="inline-flex items-center text-blue-600 font-bold text-sm">
                    立即追蹤 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </a>

              <a
                href={SUNNY_CONTACTS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                <div className="relative w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                    <path d="m10 15 5-3-5-3z"></path>
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">YouTube 頻道</h3>
                  <p className="text-gray-500 text-sm mb-3">觀看桑尼的旅遊 Vlog 與實用攻略</p>
                  <span className="inline-flex items-center text-red-600 font-bold text-sm">
                    立即訂閱 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </a>
            </div>
          </section>






        </div>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">韓國導遊領隊桑尼Sunny</h3>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs text-amber-500">快速連結</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavClick('services')}>服務介紹</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => handleNavClick('tours')}>最新行程</li>


              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wider text-xs text-amber-500">聯絡資訊</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><a href={SUNNY_CONTACTS.managerContact} target="_blank" className="hover:text-white transition-colors">經紀人聯繫</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2024 韓國導遊領隊桑尼Sunny. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

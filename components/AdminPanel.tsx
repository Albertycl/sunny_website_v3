import React, { useState } from 'react';
import { Tour, BlogPost, Testimonial, WhyChooseUsItem } from '../types';
import { searchUnsplashImages } from '../services/geminiService';

type UnsplashImage = {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
};

interface AdminPanelProps {
  tours: Tour[];
  onUpdateTours: (tours: Tour[]) => void;
  blogPosts: BlogPost[];
  onUpdateBlogPosts: (posts: BlogPost[]) => void;
  testimonials: Testimonial[];
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  whyChooseUs: WhyChooseUsItem[];
  onUpdateWhyChooseUs: (items: WhyChooseUsItem[]) => void;
  onExit: () => void;
  featuredTourId: string;
  onSetFeaturedTour: (id: string) => void;
}

type TabType = 'tours' | 'blog' | 'testimonials' | 'whyChooseUs';

const AdminPanel: React.FC<AdminPanelProps> = ({
  tours, onUpdateTours,
  blogPosts, onUpdateBlogPosts,
  testimonials, onUpdateTestimonials,
  whyChooseUs, onUpdateWhyChooseUs,
  onExit, featuredTourId, onSetFeaturedTour
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('tours');

  // Tour form state
  const [tourEditingId, setTourEditingId] = useState<string | null>(null);
  const [tourForm, setTourForm] = useState<Partial<Tour>>({
    title: '', destination: '', departureCity: '桃園', departureDate: '', description: '', image: '', itineraryLink: '', status: 'upcoming'
  });

  // Unsplash image search state
  const [searchingImages, setSearchingImages] = useState(false);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Blog form state
  const [blogEditingId, setBlogEditingId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '', content: '', category: '行李攻略', image: '', publishDate: new Date().toISOString().split('T')[0]
  });

  // Testimonial form state
  const [testimonialEditingId, setTestimonialEditingId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Testimonial>>({
    name: '', tourName: '', quote: '', image: '', rating: 5
  });

  // Why Choose Us form state
  const [whyEditingId, setWhyEditingId] = useState<string | null>(null);
  const [whyForm, setWhyForm] = useState<Partial<WhyChooseUsItem>>({
    title: '', description: '', icon: 'leader'
  });

  // Tour handlers
  const handleSaveTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourForm.title || !tourForm.destination) return alert("請填寫完整資訊 (標題與目的地為必填)");
    const tourToSave = { ...tourForm, id: tourEditingId || `tour-${Date.now()}`, isFull: false, status: 'upcoming' } as Tour;
    if (tourEditingId) {
      onUpdateTours(tours.map(t => t.id === tourEditingId ? tourToSave : t));
    } else {
      onUpdateTours([tourToSave, ...tours]);
    }
    resetTourForm();
  };

  const resetTourForm = () => {
    setTourEditingId(null);
    setTourForm({ title: '', destination: '', departureCity: '桃園', departureDate: '', description: '', image: '', itineraryLink: '', status: 'upcoming' });
    setShowImagePicker(false);
    setUnsplashImages([]);
  };

  // Unsplash search handlers
  const handleSearchImages = async (query?: string) => {
    const searchQuery = query || tourForm.destination;
    if (!searchQuery) return;

    setSearchingImages(true);
    setShowImagePicker(true);
    try {
      const images = await searchUnsplashImages(searchQuery);
      setUnsplashImages(images);
    } catch (error) {
      console.error("Failed to search images:", error);
    } finally {
      setSearchingImages(false);
    }
  };

  const selectImage = (url: string) => {
    setTourForm({ ...tourForm, image: url });
    setShowImagePicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setTourForm({ ...tourForm, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Blog handlers
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return alert("請填寫標題和內容");
    const postToSave = { ...blogForm, id: blogEditingId || `blog-${Date.now()}` } as BlogPost;
    if (blogEditingId) {
      onUpdateBlogPosts(blogPosts.map(p => p.id === blogEditingId ? postToSave : p));
    } else {
      onUpdateBlogPosts([postToSave, ...blogPosts]);
    }
    resetBlogForm();
  };

  const resetBlogForm = () => {
    setBlogEditingId(null);
    setBlogForm({ title: '', content: '', category: '行李攻略', image: '', publishDate: new Date().toISOString().split('T')[0] });
  };

  // Testimonial handlers
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.quote) return alert("請填寫姓名和評價內容");
    const testimonialToSave = { ...testimonialForm, id: testimonialEditingId || `testimonial-${Date.now()}` } as Testimonial;
    if (testimonialEditingId) {
      onUpdateTestimonials(testimonials.map(t => t.id === testimonialEditingId ? testimonialToSave : t));
    } else {
      onUpdateTestimonials([testimonialToSave, ...testimonials]);
    }
    resetTestimonialForm();
  };

  const resetTestimonialForm = () => {
    setTestimonialEditingId(null);
    setTestimonialForm({ name: '', tourName: '', quote: '', image: '', rating: 5 });
  };

  // Why Choose Us handlers
  const handleSaveWhy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whyForm.title || !whyForm.description) return alert("請填寫標題和說明");
    const itemToSave = { ...whyForm, id: whyEditingId || `why-${Date.now()}` } as WhyChooseUsItem;
    if (whyEditingId) {
      onUpdateWhyChooseUs(whyChooseUs.map(w => w.id === whyEditingId ? itemToSave : w));
    } else {
      onUpdateWhyChooseUs([itemToSave, ...whyChooseUs]);
    }
    resetWhyForm();
  };

  const resetWhyForm = () => {
    setWhyEditingId(null);
    setWhyForm({ title: '', description: '', icon: 'leader' });
  };

  const tabs = [
    { id: 'tours' as TabType, label: '行程管理', icon: '✈️' },
    { id: 'blog' as TabType, label: '部落格文章', icon: '📝' },
    { id: 'testimonials' as TabType, label: '旅客評價', icon: '⭐' },
    { id: 'whyChooseUs' as TabType, label: '關於我們', icon: '💎' },
  ];

  const inputClass = "w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-amber-400";
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900">
      {/* 側邊欄 */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white p-8 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg">S</div>
          <h1 className="text-xl font-black tracking-tight">Sunny Admin</h1>
        </div>
        <nav className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-amber-500 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <hr className="border-slate-700 my-4" />
          <button onClick={onExit} className="w-full text-left px-5 py-4 text-slate-400 hover:text-white rounded-2xl transition-all font-bold">
            ← 返回首頁
          </button>
        </nav>
      </aside>

      <main className="flex-grow p-4 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Tours Tab */}
          {activeTab === 'tours' && (
            <>
              <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">行程管理</h2>
                <p className="text-slate-500 mt-2 font-bold">手動新增與管理您的旅遊行程。</p>
              </header>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-5">
                  <form onSubmit={handleSaveTour} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-6">
                    <div>
                      <label className={labelClass}>行程標題</label>
                      <input type="text" placeholder="例如：2026 韓國賞櫻五日遊" className={inputClass} value={tourForm.title} onChange={e => setTourForm({ ...tourForm, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>目的地</label>
                        <input type="text" placeholder="例如：韓國濟州島" className={inputClass} value={tourForm.destination} onChange={e => setTourForm({ ...tourForm, destination: e.target.value })} />
                      </div>
                      <div>
                        <label className={labelClass}>預計出發日</label>
                        <input type="date" className={inputClass} value={tourForm.departureDate} onChange={e => setTourForm({ ...tourForm, departureDate: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>圖片</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="url"
                          placeholder="輸入圖片網址..."
                          className={`${inputClass} flex-1`}
                          value={tourForm.image?.startsWith('data:') ? '' : tourForm.image}
                          onChange={e => setTourForm({ ...tourForm, image: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => handleSearchImages()}
                          disabled={!tourForm.destination || searchingImages}
                          className="px-4 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                        >
                          {searchingImages ? '...' : '搜尋'}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl p-4 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-bold text-sm">上傳圖片</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {tourForm.image && (
                          <button
                            type="button"
                            onClick={() => setTourForm({ ...tourForm, image: '' })}
                            className="px-4 py-4 text-slate-400 hover:text-red-500 rounded-2xl font-bold text-sm transition-all"
                          >
                            清除
                          </button>
                        )}
                      </div>
                      {tourForm.image && (
                        <div className="mt-4 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 relative">
                          <img src={tourForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                          {tourForm.image.startsWith('data:') && (
                            <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg font-bold">已上傳</span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Unsplash Image Picker */}
                    {showImagePicker && (
                      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-slate-700">選擇圖片 (Unsplash)</h4>
                          <button
                            type="button"
                            onClick={() => setShowImagePicker(false)}
                            className="text-slate-400 hover:text-slate-600 text-sm"
                          >
                            關閉
                          </button>
                        </div>
                        {searchingImages ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                            <span className="ml-3 text-slate-500 font-medium">搜尋圖片中...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {unsplashImages.map((img) => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => selectImage(img.url)}
                                className="aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-500 transition-all focus:outline-none focus:border-amber-500"
                              >
                                <img
                                  src={img.thumbUrl}
                                  alt={img.alt}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                        {unsplashImages.length > 0 && !searchingImages && (
                          <p className="text-[10px] text-slate-400 text-center">
                            Photos from Unsplash
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <label className={labelClass}>行程 PDF/文件連結</label>
                      <input type="url" placeholder="請輸入 Google Drive 或其他連結..." className={inputClass} value={tourForm.itineraryLink} onChange={e => setTourForm({ ...tourForm, itineraryLink: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all">
                      {tourEditingId ? '儲存變更' : '確認發佈此行程'}
                    </button>
                    {tourEditingId && <button type="button" onClick={resetTourForm} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600">取消編輯</button>}
                  </form>
                </div>
                <div className="xl:col-span-7">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">當前線上行程 ({tours.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                      {tours.map(tour => (
                        <div key={tour.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                              <img src={tour.image} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.opacity = "0.3"} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{tour.title}</h4>
                              <span className="text-xs text-slate-400">{tour.departureDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setTourEditingId(tour.id); setTourForm(tour); }} className="px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-bold">編輯</button>
                            <button onClick={() => { if (confirm("確定刪除？")) onUpdateTours(tours.filter(t => t.id !== tour.id)) }} className="px-3 py-2 text-slate-300 hover:text-red-500 rounded-xl text-xs font-bold">刪除</button>
                            <button onClick={() => onSetFeaturedTour(tour.id)} className={`px-3 py-2 rounded-xl text-xs font-bold ${featuredTourId === tour.id ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-amber-500'}`}>
                              {featuredTourId === tour.id ? '★' : '☆'}
                            </button>
                          </div>
                        </div>
                      ))}
                      {tours.length === 0 && <div className="p-20 text-center text-slate-300 italic">尚未新增任何行程</div>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <>
              <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">部落格文章</h2>
                <p className="text-slate-500 mt-2 font-bold">管理 Sunny 的私房推薦文章。</p>
              </header>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-5">
                  <form onSubmit={handleSaveBlog} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-6">
                    <div>
                      <label className={labelClass}>文章標題</label>
                      <input type="text" placeholder="例如：韓國行李怎麼帶？" className={inputClass} value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>分類</label>
                      <select className={inputClass} value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}>
                        <option value="行李攻略">行李攻略</option>
                        <option value="必買清單">必買清單</option>
                        <option value="美食推薦">美食推薦</option>
                        <option value="景點介紹">景點介紹</option>
                        <option value="交通攻略">交通攻略</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>內容 (300字內)</label>
                      <textarea placeholder="分享您的旅遊小撇步..." className={`${inputClass} h-32 resize-none`} maxLength={300} value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} />
                      <p className="text-xs text-slate-400 mt-1 text-right">{blogForm.content?.length || 0}/300</p>
                    </div>
                    <div>
                      <label className={labelClass}>封面圖片 (URL, 選填)</label>
                      <input type="url" placeholder="請輸入圖片網址..." className={inputClass} value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all">
                      {blogEditingId ? '儲存變更' : '發佈文章'}
                    </button>
                    {blogEditingId && <button type="button" onClick={resetBlogForm} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600">取消編輯</button>}
                  </form>
                </div>
                <div className="xl:col-span-7">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">已發佈文章 ({blogPosts.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                      {blogPosts.map(post => (
                        <div key={post.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                          <div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold">{post.category}</span>
                            <h4 className="font-bold text-slate-800 text-sm mt-2">{post.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{post.content}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setBlogEditingId(post.id); setBlogForm(post); }} className="px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-bold">編輯</button>
                            <button onClick={() => { if (confirm("確定刪除？")) onUpdateBlogPosts(blogPosts.filter(p => p.id !== post.id)) }} className="px-3 py-2 text-slate-300 hover:text-red-500 rounded-xl text-xs font-bold">刪除</button>
                          </div>
                        </div>
                      ))}
                      {blogPosts.length === 0 && <div className="p-20 text-center text-slate-300 italic">尚未新增任何文章</div>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <>
              <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">旅客評價</h2>
                <p className="text-slate-500 mt-2 font-bold">管理旅客的真實評價與心得。</p>
              </header>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-5">
                  <form onSubmit={handleSaveTestimonial} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-6">
                    <div>
                      <label className={labelClass}>旅客姓名</label>
                      <input type="text" placeholder="例如：王小姐" className={inputClass} value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>參加行程</label>
                      <input type="text" placeholder="例如：濟州島海女遊艇美食團" className={inputClass} value={testimonialForm.tourName} onChange={e => setTestimonialForm({ ...testimonialForm, tourName: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>一句話心得</label>
                      <textarea placeholder="旅客的真實感受..." className={`${inputClass} h-24 resize-none`} value={testimonialForm.quote} onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>評分</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })} className={`text-2xl ${(testimonialForm.rating || 0) >= star ? 'text-amber-400' : 'text-slate-200'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>旅客照片 (URL, 選填)</label>
                      <input type="url" placeholder="請輸入照片網址..." className={inputClass} value={testimonialForm.image} onChange={e => setTestimonialForm({ ...testimonialForm, image: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all">
                      {testimonialEditingId ? '儲存變更' : '新增評價'}
                    </button>
                    {testimonialEditingId && <button type="button" onClick={resetTestimonialForm} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600">取消編輯</button>}
                  </form>
                </div>
                <div className="xl:col-span-7">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">旅客評價 ({testimonials.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                      {testimonials.map(t => (
                        <div key={t.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                              {t.image ? <img src={t.image} className="w-full h-full rounded-full object-cover" /> : t.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                                <span className="text-amber-400 text-sm">{'★'.repeat(t.rating)}</span>
                              </div>
                              <p className="text-xs text-slate-400">{t.tourName}</p>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">「{t.quote}」</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setTestimonialEditingId(t.id); setTestimonialForm(t); }} className="px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-bold">編輯</button>
                            <button onClick={() => { if (confirm("確定刪除？")) onUpdateTestimonials(testimonials.filter(x => x.id !== t.id)) }} className="px-3 py-2 text-slate-300 hover:text-red-500 rounded-xl text-xs font-bold">刪除</button>
                          </div>
                        </div>
                      ))}
                      {testimonials.length === 0 && <div className="p-20 text-center text-slate-300 italic">尚未新增任何評價</div>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Why Choose Us Tab */}
          {activeTab === 'whyChooseUs' && (
            <>
              <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">關於我們</h2>
                <p className="text-slate-500 mt-2 font-bold">管理「為什麼選擇我們」專區的內容。</p>
              </header>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-5">
                  <form onSubmit={handleSaveWhy} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-6">
                    <div>
                      <label className={labelClass}>標題</label>
                      <input type="text" placeholder="例如：Sunny 親自帶領" className={inputClass} value={whyForm.title} onChange={e => setWhyForm({ ...whyForm, title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>說明</label>
                      <textarea placeholder="詳細說明這項優勢..." className={`${inputClass} h-32 resize-none`} value={whyForm.description} onChange={e => setWhyForm({ ...whyForm, description: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>圖示類型</label>
                      <select className={inputClass} value={whyForm.icon} onChange={e => setWhyForm({ ...whyForm, icon: e.target.value })}>
                        <option value="leader">👤 領隊/人物</option>
                        <option value="company">🏠 公司/機構</option>
                        <option value="custom">🔧 客製化/工具</option>
                        <option value="safety">🛡️ 安全/保障</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all">
                      {whyEditingId ? '儲存變更' : '新增項目'}
                    </button>
                    {whyEditingId && <button type="button" onClick={resetWhyForm} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600">取消編輯</button>}
                  </form>
                </div>
                <div className="xl:col-span-7">
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">優勢項目 ({whyChooseUs.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                      {whyChooseUs.map(item => (
                        <div key={item.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setWhyEditingId(item.id); setWhyForm(item); }} className="px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-bold">編輯</button>
                            <button onClick={() => { if (confirm("確定刪除？")) onUpdateWhyChooseUs(whyChooseUs.filter(w => w.id !== item.id)) }} className="px-3 py-2 text-slate-300 hover:text-red-500 rounded-xl text-xs font-bold">刪除</button>
                          </div>
                        </div>
                      ))}
                      {whyChooseUs.length === 0 && <div className="p-20 text-center text-slate-300 italic">尚未新增任何項目</div>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;

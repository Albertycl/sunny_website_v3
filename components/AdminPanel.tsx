
import React, { useState } from 'react';
import { Tour } from '../types';

interface AdminPanelProps {
  tours: Tour[];
  onUpdateTours: (tours: Tour[]) => void;
  onExit: () => void;
  featuredTourId: string;
  onSetFeaturedTour: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tours, onUpdateTours, onExit, featuredTourId, onSetFeaturedTour }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Tour>>({
    title: '',
    destination: '',
    departureCity: '桃園',
    departureDate: '',
    description: '',
    image: '',
    itineraryLink: '',
    status: 'upcoming'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.destination) return alert("請填寫完整資訊 (標題與目的地為必填)");

    const tourToSave = {
      ...formData,
      id: editingId || `tour-${Date.now()}`,
      isFull: false,
      status: 'upcoming'
    } as Tour;

    if (editingId) {
      onUpdateTours(tours.map(t => t.id === editingId ? tourToSave : t));
    } else {
      onUpdateTours([tourToSave, ...tours]);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', destination: '', departureCity: '桃園', departureDate: '', description: '', image: '', itineraryLink: '', status: 'upcoming' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900">
      {/* 側邊欄 */}
      <aside className="w-full lg:w-72 bg-slate-900 text-white p-8 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg">S</div>
          <h1 className="text-xl font-black tracking-tight">Sunny Admin</h1>
        </div>
        <nav className="space-y-4">
          <button className="w-full text-left px-5 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-xl transition-all">行程管理</button>
          <button onClick={onExit} className="w-full text-left px-5 py-4 text-slate-400 hover:text-white rounded-2xl transition-all font-bold">返回首頁</button>
        </nav>
      </aside>

      <main className="flex-grow p-4 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">行程管理</h2>
              <p className="text-slate-500 mt-2 font-bold">手動新增與管理您的旅遊行程。</p>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* 左側：編輯表單 */}
            <div className="xl:col-span-5">
              <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-8 transition-all">

                <div className="space-y-6">
                  {/* 行程標題 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">行程標題</label>
                    <input
                      type="text"
                      placeholder="例如：2026 韓國賞櫻五日遊"
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-700 transition-all focus:ring-2 focus:ring-amber-400"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* 目的地與日期 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">目的地</label>
                      <input
                        type="text"
                        placeholder="例如：韓國"
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600"
                        value={formData.destination}
                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">預計出發日</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600"
                        value={formData.departureDate}
                        onChange={e => setFormData({ ...formData, departureDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 圖片連結 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">圖片連結 (URL)</label>
                    <input
                      type="url"
                      placeholder="請輸入圖片網址..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                    {formData.image && (
                      <div className="mt-4 aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                    )}
                  </div>

                  {/* 行程連結 */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">行程 PDF/文件連結</label>
                    <input
                      type="url"
                      placeholder="請輸入 Google Drive 或其他連結..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600"
                      value={formData.itineraryLink}
                      onChange={e => setFormData({ ...formData, itineraryLink: e.target.value })}
                    />
                  </div>

                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]">
                    {editingId ? '儲存變更' : '確認發佈此行程'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="w-full mt-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all">
                      取消編輯
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* 右側：行程列表 */}
            <div className="xl:col-span-7 space-y-6">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">當前線上行程 ({tours.length})</h3>
                </div>
                <div className="divide-y divide-slate-50 max-h-[700px] overflow-y-auto">
                  {tours.map(tour => (
                    <div key={tour.id} className="p-8 hover:bg-slate-50 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-16 rounded-2xl overflow-hidden shadow-md bg-slate-100 shrink-0 border border-slate-200">
                          <img src={tour.image} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.opacity = "0.3"} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-base line-clamp-1">{tour.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-black uppercase tracking-tighter">{tour.destination}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{tour.departureDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 transition-all">
                        <button onClick={() => { setEditingId(tour.id); setFormData(tour); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-3 text-amber-600 hover:bg-amber-50 rounded-xl font-black text-xs">編輯</button>
                        <button onClick={() => { if (confirm("確定刪除？")) onUpdateTours(tours.filter(t => t.id !== tour.id)) }} className="p-3 text-slate-300 hover:text-red-500 rounded-xl font-black text-xs">刪除</button>
                        <button
                          onClick={() => onSetFeaturedTour(tour.id)}
                          className={`p-3 rounded-xl font-black text-xs transition-all ${featuredTourId === tour.id ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-300 hover:text-amber-500'}`}
                          title="設為首頁倒數行程"
                        >
                          {featuredTourId === tour.id ? '★ 精選中' : '☆ 設為精選'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {tours.length === 0 && (
                    <div className="p-32 text-center text-slate-300 italic font-bold">
                      尚未匯入任何行程
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;

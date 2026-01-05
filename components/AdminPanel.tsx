
import React, { useState, useRef } from 'react';
import { Tour } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminPanelProps {
  tours: Tour[];
  onUpdateTours: (tours: Tour[]) => void;
  onExit: () => void;
  featuredTourId: string;
  onSetFeaturedTour: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tours, onUpdateTours, onExit, featuredTourId, onSetFeaturedTour }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);



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

  // 工具：轉換 Google Drive 連結為可顯示的縮圖網址
  const getDriveThumbnail = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return null;
    const match = url.match(/\/d\/([^/]+)/);
    return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200` : null;
  };



  // Unsplash Image Search
  const fetchUnsplashImage = async (keyword: string): Promise<string | null> => {
    try {
      const accessKey = process.env.UNSPLASH_ACCESS_KEY;
      if (!accessKey) return null;

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`
          }
        }
      );
      const data = await response.json();
      return data.results?.[0]?.urls?.regular || null;
    } catch (error) {
      console.error("Unsplash API error:", error);
      return null;
    }
  };

  // 全自動辨識邏輯
  const handleMagicImport = async (file?: File, driveUrl?: string) => {
    const urlToUse = driveUrl || formData.itineraryLink;
    if (!file && !urlToUse) return alert("請貼上連結或上傳檔案。");

    setIsLoading(true);
    setStatusMsg('Gemini AI 正在解析行程...');
    setPreviewError(false);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        alert("未偵測到 API Key。請確認 Zeabur 環境變數已設定，並重新部署網站。");
        setIsLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      let extractedData: any = {};

      const promptText = `
        你是專業領隊助理。請分析提供的旅遊行程文件或連結。
        請盡可能提取以下資訊，並以 JSON 格式回傳：
        - title: 行程完整標題
        - destination: 目的地城市或國家 (例如: "韓國釜山", "日本東京")
        - description: 一句吸引人的行程摘要 (20-50字)
        - departureDate: 出發日期 (格式: YYYY-MM-DD)。如果找不到確切年份，請假設為 2025 年。如果找不到確切日期，請留空。
        
        重要：如果你無法讀取連結內容（例如 Google Drive 權限問題），請不要回傳錯誤訊息。
        請嘗試從連結文字本身推測（例如檔名）。
        如果完全無法推測，請回傳一個 "通用" 的旅遊行程範本（例如：title: "未知旅遊行程", destination: "未知", description: "請手動輸入行程細節", departureDate: ""），讓使用者可以手動編輯。
        絕對不要回傳 "無法辨識" 或類似的錯誤文字，必須回傳有效的 JSON。
      `;

      if (file) {
        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp", // Use a better model if available, or stick to flash
          contents: [
            { inlineData: { data: fileContent, mimeType: file.type } },
            { text: promptText }
          ],
          config: { responseMimeType: "application/json" }
        });
        const text = response.text;
        if (!text) throw new Error("No response text");
        extractedData = JSON.parse(text);
      } else if (urlToUse) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-exp",
          contents: `分析此連結: ${urlToUse}。${promptText}`,
          config: { responseMimeType: "application/json" }
        });
        const text = response.text;
        if (!text) throw new Error("No response text");
        extractedData = JSON.parse(text);
      }

      // 自動尋找真實配圖
      setStatusMsg(`正在尋找 ${extractedData.destination || '目的地'} 的美照...`);

      let finalImage = null;

      // 1. 優先嘗試 Unsplash 尋找風景照
      if (extractedData.destination) {
        const unsplashImage = await fetchUnsplashImage(extractedData.destination);
        if (unsplashImage) {
          finalImage = unsplashImage;
        }
      }

      // 2. (已移除) 不再使用 Google Drive 縮圖作為備案，確保版面不出現文件截圖

      // 3. 最後使用預設風景圖
      if (!finalImage) {
        finalImage = '/images/default_scenery.png';
      }

      setFormData(prev => ({
        ...prev,
        ...extractedData,
        image: finalImage,
        itineraryLink: urlToUse || prev.itineraryLink
      }));

      setStatusMsg('AI 已自動完成所有欄位！');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (error) {
      console.error(error);
      alert("辨識失敗，請確認檔案內容或連結正確。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("請先進行自動辨識以填寫標題。");

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
    setPreviewError(false);
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
        <div className="mt-20 p-6 bg-slate-800/40 rounded-[2rem] border border-slate-700/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest">AI 自動化助手</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            現在您只需貼上 Google Drive 連結，我會自動幫您填好標題、日期，並找好高品質的實景照片。
          </p>
        </div>
      </aside>

      <main className="flex-grow p-4 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">行程管理</h2>
              <p className="text-slate-500 mt-2 font-bold">使用 Gemini AI 實現零手動輸入的匯入體驗。</p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              {isLoading ? '辨識中...' : '自動辨識行程檔案 (PDF/圖片)'}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" onChange={(e) => handleMagicImport(e.target.files?.[0])} />
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* 左側：AI 表單 */}
            <div className="xl:col-span-5">
              <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 sticky top-8 space-y-8 transition-all">

                {/* 圖片預覽區 */}
                <div className="space-y-4">
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-50 border-2 border-slate-100 relative group transition-all">
                    {formData.image && !previewError ? (
                      <img
                        src={formData.image}
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center font-bold italic text-sm">
                        <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {previewError ? "圖片載入失敗 (可能被公司網路封鎖)" : "AI 將自動匹配美照"}
                      </div>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 shadow-xl"></div>
                        <p className="text-sm font-black text-amber-600 animate-pulse">{statusMsg}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">1. 貼上 Google Drive 連結</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="請貼上行程 PDF 連結..."
                        className="flex-grow bg-white border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.itineraryLink}
                        onChange={e => setFormData({ ...formData, itineraryLink: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => handleMagicImport()}
                        className="bg-slate-900 text-white px-5 rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg active:scale-95"
                      >
                        自動填寫
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI 填寫結果 */}
                <div className="space-y-6">
                  <div className="transition-all">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">2. 行程標題 (AI 自動提取)</label>
                    <input
                      type="text"
                      placeholder="等待匯入..."
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-slate-700 transition-all focus:ring-2 focus:ring-amber-400"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">目的地</label>
                      <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600" value={formData.destination} readOnly />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">預計出發日</label>
                      <input type="date" className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-600" value={formData.departureDate} onChange={e => setFormData({ ...formData, departureDate: e.target.value })} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]">
                  {editingId ? '儲存變更' : '確認發佈此行程'}
                </button>
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

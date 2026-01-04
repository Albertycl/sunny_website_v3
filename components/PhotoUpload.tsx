
import React, { useState } from 'react';

const PhotoUpload: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [reader.result as string, ...prev].slice(0, 4));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 text-center">
      <h3 className="text-lg font-bold mb-2">上傳你的旅遊精彩瞬間</h3>
      <p className="text-sm text-gray-500 mb-6">歡迎參加過 Sunny 團的朋友分享照片，讓更多人感受旅行的喜悅！</p>
      
      <label className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-bold cursor-pointer hover:bg-gray-50 transition-all inline-block mb-8 active:scale-95 shadow-sm">
        選擇照片
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {photos.map((p, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white shadow-md relative group">
              <img src={p} className="w-full h-full object-cover" alt="Uploaded" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">待審核</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

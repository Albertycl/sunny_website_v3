import React, { useState, useEffect } from 'react';

type City = {
    name: string;
    nameZh: string;
    lat: number;
    lon: number;
};

const CITIES: City[] = [
    { name: 'Seoul', nameZh: '首爾', lat: 37.5665, lon: 126.9780 },
    { name: 'Busan', nameZh: '釜山', lat: 35.1796, lon: 129.0756 },
    { name: 'Jeju', nameZh: '濟州', lat: 33.4996, lon: 126.5312 },
    { name: 'Daegu', nameZh: '大邱', lat: 35.8714, lon: 128.6014 },
    { name: 'Incheon', nameZh: '仁川', lat: 37.4563, lon: 126.7052 },
];

type WeatherData = {
    temperature: number;
    weatherCode: number;
};

const WeatherOutfit: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchWeather(selectedCity);
    }, [selectedCity]);

    const fetchWeather = async (city: City) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
            );
            if (!response.ok) throw new Error('Failed to fetch weather data');
            const data = await response.json();
            setWeather({
                temperature: data.current_weather.temperature,
                weatherCode: data.current_weather.weathercode,
            });
        } catch (err) {
            setError('無法取得天氣資訊，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    const getOutfitAdvice = (temp: number) => {
        if (temp < 0) return {
            title: '極寒保暖',
            desc: '氣溫極低，請務必穿著厚羽絨外套、發熱衣、圍巾、手套及毛帽。建議洋蔥式穿搭。',
            icon: '❄️'
        };
        if (temp < 10) return {
            title: '冬季禦寒',
            desc: '天氣寒冷，建議穿著大衣、毛衣、長褲。早晚溫差大，可準備暖暖包。',
            icon: '🧣'
        };
        if (temp < 20) return {
            title: '涼爽舒適',
            desc: '氣溫舒適偏涼，適合穿著薄長袖、風衣或針織衫。建議攜帶薄外套備用。',
            icon: '🧥'
        };
        if (temp < 25) return {
            title: '溫暖宜人',
            desc: '天氣溫暖，可穿著短袖搭配薄襯衫或是輕薄長袖。適合戶外活動。',
            icon: '👕'
        };
        return {
            title: '炎熱夏季',
            desc: '天氣炎熱，建議穿著透氣短袖、短褲、裙子。請注意防曬並多補充水分。',
            icon: '☀️'
        };
    };

    const getWeatherDescription = (code: number) => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return '晴朗';
        if (code >= 1 && code <= 3) return '多雲';
        if (code >= 45 && code <= 48) return '有霧';
        if (code >= 51 && code <= 55) return '毛毛雨';
        if (code >= 61 && code <= 65) return '下雨';
        if (code >= 71 && code <= 77) return '下雪';
        if (code >= 80 && code <= 82) return '陣雨';
        if (code >= 95) return '雷雨';
        return '多雲時晴';
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">☁️ 韓國天氣穿搭小幫手</h2>
                <p className="text-blue-100">出發前先看看該怎麼穿！</p>
            </div>

            <div className="p-6 md:p-8">
                {/* City Selection */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1 flex-wrap justify-center">
                        {CITIES.map(city => (
                            <button
                                key={city.name}
                                onClick={() => setSelectedCity(city)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCity.name === city.name
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {city.nameZh}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">正在取得最新天氣...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        {error}
                        <button
                            onClick={() => fetchWeather(selectedCity)}
                            className="block mx-auto mt-4 text-blue-600 underline text-sm"
                        >
                            重試
                        </button>
                    </div>
                ) : weather && (
                    <div className="animate-fade-in md:flex items-center justify-between gap-8 md:px-8">
                        {/* Weather Info */}
                        <div className="text-center md:text-left mb-6 md:mb-0 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                            <p className="text-gray-500 font-medium mb-1">{selectedCity.nameZh} 目前天氣</p>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="text-5xl font-bold text-gray-900">{weather.temperature}°C</span>
                                <span className="text-lg bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    {getWeatherDescription(weather.weatherCode)}
                                </span>
                            </div>
                        </div>

                        {/* Outfit Advice */}
                        <div className="md:w-2/3">
                            <div className="flex items-start gap-4">
                                <div className="text-4xl p-3 bg-amber-50 rounded-2xl">
                                    {getOutfitAdvice(weather.temperature).icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {getOutfitAdvice(weather.temperature).title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {getOutfitAdvice(weather.temperature).desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherOutfit;

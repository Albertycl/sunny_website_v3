
import { Tour, BlogPost, Testimonial, WhyChooseUsItem } from './types';

export const SUNNY_CONTACTS = {
  facebook: 'https://www.facebook.com/sunnyvisitkorea/',
  instagram: 'https://www.instagram.com/sunnyvisitkorea/',
  youtube: 'https://www.youtube.com/@sunnyvisitkorea',
  line: 'https://line.me/ti/p/~@lqa7424m',
  managerContact: 'https://line.me/ti/p/~@lqa7424m'
};

export const MOCK_TOURS: Tour[] = [
  {
    id: 'busan-429',
    title: '4/29 釜山+浦項+蔚山：美食美景團 5 天',
    destination: '韓國釜山、浦項',
    departureCity: '桃園',
    departureDate: '2026-04-29',
    image: '/images/busan_city_coast.png',
    isFull: false,
    status: 'upcoming',
    description: '全新景點浦項 Space Walk，坐擁 360 度全景視野；走訪相生之手，感受虎尾岬的震撼自然之美。',
    itineraryLink: 'https://drive.google.com/file/d/1OO4G_78YQ1H7rxPD7Z_VSivz3--ZJp4E/view'
  },
  {
    id: 'jeju-304',
    title: '3/4 濟州島海女遊艇美食團',
    destination: '韓國濟州島',
    departureCity: '桃園',
    departureDate: '2026-03-04',
    image: '/images/jeju_ocean_yacht.png',
    isFull: false,
    status: 'upcoming',
    description: '深入濟州文化，體驗海女精神，盡享豪華遊艇與道地海鮮美食。',
    itineraryLink: 'https://drive.google.com/file/d/1V9qyg61CJen2mQ-kYPDc7aVgwIHQA5ht/view'
  },
  {
    id: 'jeju-402',
    title: '4/2 濟州島賞櫻滿滿 5 天行程',
    destination: '韓國濟州島',
    departureCity: '桃園',
    departureDate: '2026-04-02',
    image: '/images/default_scenery.png',
    isFull: false,
    status: 'upcoming',
    description: '沈浸在粉紅花海中！濟州最美櫻花季，精心安排五天極致賞櫻行程。',
    itineraryLink: 'https://drive.google.com/file/d/1IU5YkRjwfGO2fh4pIajGzOSv4gLmASR0/view'
  }
];

export const MOCK_WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    id: 'why-1',
    title: 'Sunny 親自帶領',
    description: '專業導遊經驗豐富，全程中文服務，帶您深入體驗韓國文化與美食。',
    icon: 'leader'
  },
  {
    id: 'why-2',
    title: '專業旅行社保障',
    description: '與合法旅行社合作，行程安全有保障，讓您安心出遊無後顧之憂。',
    icon: 'company'
  },
  {
    id: 'why-3',
    title: '客製化行程規劃',
    description: '依據您的需求與預算，量身打造專屬行程，彈性調整最適合您。',
    icon: 'custom'
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '韓國行李怎麼帶？',
    content: '韓國四季分明，行李準備大不同！春秋建議帶薄外套，夏天防曬必備，冬天保暖衣物不可少。記得預留購物空間，韓國好買程度超乎想像！',
    category: '行李攻略',
    image: '',
    publishDate: '2024-01-15'
  },
  {
    id: 'blog-2',
    title: '首爾必買伴手禮清單',
    content: '韓國零食、美妝、文創小物都是送禮首選！推薦蜂蜜奶油杏仁果、韓國面膜、Line Friends 周邊，還有傳統工藝品也很有紀念價值。',
    category: '必買清單',
    image: '',
    publishDate: '2024-01-20'
  },
  {
    id: 'blog-3',
    title: '濟州島隱藏美食推薦',
    content: '除了黑豬肉和海鮮，濟州島還有很多在地人才知道的美食！像是花生冰淇淋、橘子巧克力、鮑魚粥，都是必嚐的道地風味。',
    category: '美食推薦',
    image: '',
    publishDate: '2024-02-01'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: '王小姐',
    tourName: '濟州島海女遊艇美食團',
    quote: 'Sunny 超用心！行程安排得很棒，吃得好玩得開心，下次還要再跟團！',
    image: '',
    rating: 5
  },
  {
    id: 'testimonial-2',
    name: '林先生',
    tourName: '釜山美食美景團',
    quote: '第一次跟團去韓國，完全不用擔心語言問題，Sunny 全程照顧得很好。',
    image: '',
    rating: 5
  },
  {
    id: 'testimonial-3',
    name: '陳太太',
    tourName: '濟州島賞櫻團',
    quote: '櫻花真的美翻了！感謝 Sunny 帶我們去私房景點，照片拍到手軟！',
    image: '',
    rating: 5
  }
];

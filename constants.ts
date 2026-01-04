
import { Tour, SocialPost, Testimonial } from './types';

export const SUNNY_CONTACTS = {
  facebook: 'https://www.facebook.com/sunnyvisitkorea/',
  instagram: 'https://www.instagram.com/sunnyvisitkorea/',
  youtube: 'https://www.youtube.com/@sunnyvisitkorea',
  line: 'https://line.me/ti/p/~@lqa7424m',
  managerContact: 'https://brevet.com.tw/staff/manager_name'
};

export const MOCK_TOURS: Tour[] = [
  {
    id: 'busan-429',
    title: '4/29 釜山+浦項+蔚山：美食美景團 5 天',
    destination: '韓國釜山、浦項',
    departureCity: '桃園',
    departureDate: '2025-04-29',
    image: 'https://placehold.co/600x400',
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
    departureDate: '2025-03-04',
    image: 'https://placehold.co/600x400',
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
    departureDate: '2025-04-02',
    image: 'https://placehold.co/600x400',
    isFull: false,
    status: 'upcoming',
    description: '沈浸在粉紅花海中！濟州最美櫻花季，精心安排五天極致賞櫻行程。',
    itineraryLink: 'https://drive.google.com/file/d/1IU5YkRjwfGO2fh4pIajGzOSv4gLmASR0/view'
  }
];

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'yt1',
    platform: 'youtube',
    title: '韓國旅遊必買清單 2024！',
    content: '這次幫大家整理了最新、最火紅的 Olive Young 必買清單...',
    date: '2024-05-20',
    thumbnail: 'https://placehold.co/600x400',
    link: 'https://www.youtube.com/@sunnyvisitkorea'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: '林小姐',
    content: '跟著 Sunny 團真的超放心！行程安排得很順，百威的住宿跟導遊也很優質。',
    tourName: '釜山美景團',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?u=lin'
  }
];

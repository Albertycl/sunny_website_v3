
import { Tour } from './types';

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





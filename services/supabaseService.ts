import { supabase } from './supabaseClient';
import { Tour, BlogPost, Testimonial, WhyChooseUsItem } from '../types';

// Tours
export const getTours = async (): Promise<Tour[]> => {
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tours:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    title: row.title,
    destination: row.destination,
    departureCity: row.departure_city,
    departureDate: row.departure_date,
    description: row.description,
    image: row.image,
    itineraryLink: row.itinerary_link,
    status: row.status,
    isFull: row.is_full
  }));
};

export const saveTours = async (tours: Tour[]): Promise<void> => {
  // Get existing tour IDs
  const { data: existing } = await supabase.from('tours').select('id');
  const existingIds = existing?.map(t => t.id) || [];

  // Delete tours that are no longer in the list
  const newIds = tours.map(t => t.id);
  const toDelete = existingIds.filter(id => !newIds.includes(id));

  if (toDelete.length > 0) {
    await supabase.from('tours').delete().in('id', toDelete);
  }

  // Upsert all tours
  for (const tour of tours) {
    await supabase.from('tours').upsert({
      id: tour.id,
      title: tour.title,
      destination: tour.destination,
      departure_city: tour.departureCity,
      departure_date: tour.departureDate,
      description: tour.description,
      image: tour.image,
      itinerary_link: tour.itineraryLink,
      status: tour.status,
      is_full: tour.isFull
    });
  }
};

// Blog Posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    image: row.image,
    publishDate: row.publish_date
  }));
};

export const saveBlogPosts = async (posts: BlogPost[]): Promise<void> => {
  const { data: existing } = await supabase.from('blog_posts').select('id');
  const existingIds = existing?.map(p => p.id) || [];

  const newIds = posts.map(p => p.id);
  const toDelete = existingIds.filter(id => !newIds.includes(id));

  if (toDelete.length > 0) {
    await supabase.from('blog_posts').delete().in('id', toDelete);
  }

  for (const post of posts) {
    await supabase.from('blog_posts').upsert({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image,
      publish_date: post.publishDate
    });
  }
};

// Testimonials
export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    name: row.name,
    tourName: row.tour_name,
    quote: row.quote,
    image: row.image,
    rating: row.rating
  }));
};

export const saveTestimonials = async (testimonials: Testimonial[]): Promise<void> => {
  const { data: existing } = await supabase.from('testimonials').select('id');
  const existingIds = existing?.map(t => t.id) || [];

  const newIds = testimonials.map(t => t.id);
  const toDelete = existingIds.filter(id => !newIds.includes(id));

  if (toDelete.length > 0) {
    await supabase.from('testimonials').delete().in('id', toDelete);
  }

  for (const testimonial of testimonials) {
    await supabase.from('testimonials').upsert({
      id: testimonial.id,
      name: testimonial.name,
      tour_name: testimonial.tourName,
      quote: testimonial.quote,
      image: testimonial.image,
      rating: testimonial.rating
    });
  }
};

// Why Choose Us
export const getWhyChooseUs = async (): Promise<WhyChooseUsItem[]> => {
  const { data, error } = await supabase
    .from('why_choose_us')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching why choose us:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon
  }));
};

export const saveWhyChooseUs = async (items: WhyChooseUsItem[]): Promise<void> => {
  const { data: existing } = await supabase.from('why_choose_us').select('id');
  const existingIds = existing?.map(w => w.id) || [];

  const newIds = items.map(w => w.id);
  const toDelete = existingIds.filter(id => !newIds.includes(id));

  if (toDelete.length > 0) {
    await supabase.from('why_choose_us').delete().in('id', toDelete);
  }

  for (const item of items) {
    await supabase.from('why_choose_us').upsert({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon
    });
  }
};

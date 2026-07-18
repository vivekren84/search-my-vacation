export interface TravelExperience {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  featured: boolean;
}

export const travelExperiences: TravelExperience[] = [
  {
    id: "nature",
    title: "Nature Escapes",
    description: "Reconnect with nature through forests, waterfalls and scenic landscapes.",
    icon: "🌿",
    slug: "nature-escapes",
    featured: true,
  },
  {
    id: "beach",
    title: "Beach Holidays",
    description: "Relax by pristine shores and soak in breathtaking coastal views.",
    icon: "🏖️",
    slug: "beach-holidays",
    featured: true,
  },
  {
    id: "romantic",
    title: "Romantic Getaways",
    description: "Celebrate special moments with unforgettable journeys for two.",
    icon: "❤️",
    slug: "romantic-getaways",
    featured: true,
  },
  {
    id: "mountain",
    title: "Mountain Retreats",
    description: "Escape to cool climates, panoramic peaks and peaceful valleys.",
    icon: "🏔️",
    slug: "mountain-retreats",
    featured: true,
  },
  {
    id: "family",
    title: "Family Adventures",
    description: "Create lifelong memories with experiences everyone can enjoy.",
    icon: "👨‍👩‍👧‍👦",
    slug: "family-adventures",
    featured: true,
  },
  {
    id: "adventure",
    title: "Adventure Trails",
    description: "Discover thrilling experiences for explorers and adrenaline seekers.",
    icon: "🧭",
    slug: "adventure-trails",
    featured: true,
  },
  {
    id: "culture",
    title: "Cultural Journeys",
    description: "Immerse yourself in history, traditions and local stories.",
    icon: "🏛️",
    slug: "cultural-journeys",
    featured: true,
  },
  {
    id: "luxury",
    title: "Luxury Escapes",
    description: "Indulge in exceptional stays and premium travel experiences.",
    icon: "✨",
    slug: "luxury-escapes",
    featured: true,
  },
];
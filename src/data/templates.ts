import { CanvasItem, TemplateDef } from '../types/builder';
import type { Lang } from '../i18n/translations';
import { TEMPLATES_FR } from './templates.fr';

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Large header with background image and text overlay',
    icon: '🌟',
    category: 'layout',
    fields: [
      { id: 'title', label: 'Title', type: 'text', defaultValue: 'Welcome', placeholder: 'Enter main title' },
      { id: 'subtitle', label: 'Subtitle', type: 'textarea', defaultValue: 'A beautiful message for you', placeholder: 'Enter subtitle text' },
      { id: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Explore', placeholder: 'Button label' },
      { id: 'backgroundImage', label: 'Background Image', type: 'image', defaultValue: '' },
    ],
  },
  {
    id: 'photo-gallery',
    name: 'Photo Gallery',
    description: 'Beautiful grid gallery with captions',
    icon: '🖼️',
    category: 'media',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Memories', placeholder: 'Gallery title' },
      { id: 'photo1', label: 'Photo 1', type: 'image', defaultValue: '' },
      { id: 'caption1', label: 'Caption 1', type: 'text', defaultValue: '', placeholder: 'Photo caption' },
      { id: 'photo2', label: 'Photo 2', type: 'image', defaultValue: '' },
      { id: 'caption2', label: 'Caption 2', type: 'text', defaultValue: '', placeholder: 'Photo caption' },
      { id: 'photo3', label: 'Photo 3', type: 'image', defaultValue: '' },
      { id: 'caption3', label: 'Caption 3', type: 'text', defaultValue: '', placeholder: 'Photo caption' },
    ],
  },
  {
    id: 'love-letter',
    name: 'Love Letter',
    description: 'Elegant styled message with decorative borders',
    icon: '💌',
    category: 'content',
    fields: [
      { id: 'greeting', label: 'Greeting', type: 'text', defaultValue: 'My Dearest,', placeholder: 'Opening greeting' },
      { id: 'body', label: 'Letter Body', type: 'textarea', defaultValue: 'Every moment with you is a treasure that I hold close to my heart...', placeholder: 'Write your message here' },
      { id: 'closing', label: 'Closing', type: 'text', defaultValue: 'Yours forever,', placeholder: 'Closing phrase' },
      { id: 'signature', label: 'Signature', type: 'text', defaultValue: 'Your Name', placeholder: 'Your name' },
    ],
  },
  {
    id: 'flip-cards',
    name: 'Flip Cards',
    description: 'Interactive cards that reveal content on hover',
    icon: '🃏',
    category: 'interactive',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Why I Love You', placeholder: 'Section heading' },
      { id: 'card1Front', label: 'Card 1 Front', type: 'text', defaultValue: '✨ Reason 1', placeholder: 'Front text' },
      { id: 'card1Back', label: 'Card 1 Back', type: 'textarea', defaultValue: 'Your smile lights up the room', placeholder: 'Back text' },
      { id: 'card2Front', label: 'Card 2 Front', type: 'text', defaultValue: '💫 Reason 2', placeholder: 'Front text' },
      { id: 'card2Back', label: 'Card 2 Back', type: 'textarea', defaultValue: 'Your kindness knows no bounds', placeholder: 'Back text' },
      { id: 'card3Front', label: 'Card 3 Front', type: 'text', defaultValue: '🌟 Reason 3', placeholder: 'Front text' },
      { id: 'card3Back', label: 'Card 3 Back', type: 'textarea', defaultValue: 'You make every day brighter', placeholder: 'Back text' },
    ],
  },
  {
    id: 'carousel',
    name: 'Memories Carousel',
    description: 'Auto-sliding carousel with images and captions',
    icon: '🎠',
    category: 'media',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Journey', placeholder: 'Section heading' },
      { id: 'slide1Image', label: 'Slide 1 Image', type: 'image', defaultValue: '' },
      { id: 'slide1Caption', label: 'Slide 1 Caption', type: 'text', defaultValue: 'Our first memory', placeholder: 'Slide caption' },
      { id: 'slide2Image', label: 'Slide 2 Image', type: 'image', defaultValue: '' },
      { id: 'slide2Caption', label: 'Slide 2 Caption', type: 'text', defaultValue: 'A cherished moment', placeholder: 'Slide caption' },
      { id: 'slide3Image', label: 'Slide 3 Image', type: 'image', defaultValue: '' },
      { id: 'slide3Caption', label: 'Slide 3 Caption', type: 'text', defaultValue: 'Together always', placeholder: 'Slide caption' },
    ],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Vertical timeline of important events',
    icon: '📅',
    category: 'content',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Story', placeholder: 'Section heading' },
      { id: 'event1Date', label: 'Event 1 Date', type: 'text', defaultValue: 'January 2024', placeholder: 'Date' },
      { id: 'event1Title', label: 'Event 1 Title', type: 'text', defaultValue: 'Where it all began', placeholder: 'Event title' },
      { id: 'event1Desc', label: 'Event 1 Description', type: 'textarea', defaultValue: 'The day everything changed...', placeholder: 'Event description' },
      { id: 'event2Date', label: 'Event 2 Date', type: 'text', defaultValue: 'March 2024', placeholder: 'Date' },
      { id: 'event2Title', label: 'Event 2 Title', type: 'text', defaultValue: 'A special moment', placeholder: 'Event title' },
      { id: 'event2Desc', label: 'Event 2 Description', type: 'textarea', defaultValue: 'A memory we will never forget...', placeholder: 'Event description' },
      { id: 'event3Date', label: 'Event 3 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event3Title', label: 'Event 3 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event3Desc', label: 'Event 3 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
      { id: 'event4Date', label: 'Event 4 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event4Title', label: 'Event 4 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event4Desc', label: 'Event 4 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
      { id: 'event5Date', label: 'Event 5 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event5Title', label: 'Event 5 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event5Desc', label: 'Event 5 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
      { id: 'event6Date', label: 'Event 6 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event6Title', label: 'Event 6 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event6Desc', label: 'Event 6 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
      { id: 'event7Date', label: 'Event 7 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event7Title', label: 'Event 7 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event7Desc', label: 'Event 7 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
      { id: 'event8Date', label: 'Event 8 Date', type: 'text', defaultValue: '', placeholder: 'Date' },
      { id: 'event8Title', label: 'Event 8 Title', type: 'text', defaultValue: '', placeholder: 'Event title' },
      { id: 'event8Desc', label: 'Event 8 Description', type: 'textarea', defaultValue: '', placeholder: 'Event description' },
    ],
  },
  {
    id: 'make-a-wish',
    name: 'Make A Wish',
    description: 'Interactive wish submission form',
    icon: '🌠',
    category: 'interactive',
    fields: [
      { id: 'title', label: 'Title', type: 'text', defaultValue: 'Make A Wish', placeholder: 'Section title' },
      { id: 'prompt', label: 'Wish Prompt', type: 'text', defaultValue: 'Close your eyes and make a wish...', placeholder: 'Prompt text' },
      { id: 'placeholder', label: 'Input Placeholder', type: 'text', defaultValue: 'Write your wish here...', placeholder: 'Input placeholder' },
      { id: 'buttonText', label: 'Submit Button', type: 'text', defaultValue: 'Send My Wish ✨', placeholder: 'Button text' },
    ],
  },
  {
    id: 'final-message',
    name: 'Closing Message',
    description: 'Elegant closing section with animated heart',
    icon: '💝',
    category: 'content',
    fields: [
      { id: 'line1', label: 'First Line', type: 'text', defaultValue: 'Thank you for being the best part of my every day.', placeholder: 'First message line' },
      { id: 'line2', label: 'Second Line', type: 'text', defaultValue: 'I love you more than words can ever express.', placeholder: 'Second message line' },
      { id: 'headline', label: 'Main Headline', type: 'text', defaultValue: 'Happy Birthday, my everything.', placeholder: 'Main headline' },
      { id: 'closing', label: 'Closing', type: 'text', defaultValue: 'Forever yours,', placeholder: 'Closing phrase' },
      { id: 'signature', label: 'Signature', type: 'text', defaultValue: 'Your Name', placeholder: 'Your name' },
    ],
  },
  {
    id: 'name-display',
    name: 'Name Display',
    description: 'Beautiful large animated name with meanings',
    icon: '✨',
    category: 'content',
    fields: [
      { id: 'name', label: 'Name', type: 'text', defaultValue: 'Maryem', placeholder: 'Name to display' },
      { id: 'meaning1', label: 'Word 1', type: 'text', defaultValue: 'Beloved', placeholder: 'First word' },
      { id: 'meaning1Desc', label: 'Word 1 Description', type: 'textarea', defaultValue: '', placeholder: 'Describe this word...' },
      { id: 'meaning2', label: 'Word 2', type: 'text', defaultValue: 'Pure', placeholder: 'Second word' },
      { id: 'meaning2Desc', label: 'Word 2 Description', type: 'textarea', defaultValue: '', placeholder: 'Describe this word...' },
      { id: 'meaning3', label: 'Word 3', type: 'text', defaultValue: 'Gracious', placeholder: 'Third word' },
      { id: 'meaning3Desc', label: 'Word 3 Description', type: 'textarea', defaultValue: '', placeholder: 'Describe this word...' },
      { id: 'meaning4', label: 'Word 4', type: 'text', defaultValue: 'Exalted', placeholder: 'Fourth word' },
      { id: 'meaning4Desc', label: 'Word 4 Description', type: 'textarea', defaultValue: '', placeholder: 'Describe this word...' },
    ],
  },
  {
    id: 'floating-decoration',
    name: 'Floating Hearts',
    description: 'Animated floating hearts decoration overlay',
    icon: '💕',
    category: 'decoration',
    fields: [
      { id: 'color', label: 'Heart Color', type: 'color', defaultValue: '#e11d48' },
      { id: 'count', label: 'Number of Hearts', type: 'number', defaultValue: '15', placeholder: 'e.g. 15', min: 5, max: 30 },
    ],
  },
  {
    id: 'surprises',
    name: 'Surprise Boxes',
    description: 'Clickable boxes that reveal surprises with confetti',
    icon: '🎁',
    category: 'interactive',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Your Surprises', placeholder: 'Section heading' },
      { id: 'box1Label', label: 'Box 1 Label', type: 'text', defaultValue: 'Surprise #1', placeholder: 'Box label' },
      { id: 'box1Reveal', label: 'Box 1 Reveal Text', type: 'textarea', defaultValue: '🎉 A special adventure awaits you!', placeholder: 'What is revealed' },
      { id: 'box2Label', label: 'Box 2 Label', type: 'text', defaultValue: 'Surprise #2', placeholder: 'Box label' },
      { id: 'box2Reveal', label: 'Box 2 Reveal Text', type: 'textarea', defaultValue: '💝 A romantic dinner for two!', placeholder: 'What is revealed' },
      { id: 'box3Label', label: 'Box 3 Label', type: 'text', defaultValue: 'Surprise #3', placeholder: 'Box label' },
      { id: 'box3Reveal', label: 'Box 3 Reveal Text', type: 'textarea', defaultValue: '✨ A day full of magic just for you!', placeholder: 'What is revealed' },
    ],
  },
  {
    id: 'love-playlist',
    name: 'Love Playlist',
    description: 'A curated list of songs that tell your love story',
    icon: '🎵',
    category: 'content',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'Our Playlist', placeholder: 'e.g. Songs That Are Us' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', defaultValue: 'Every song reminds me of you', placeholder: 'A short tagline' },
      { id: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#e11d48' },
      { id: 'song1Title', label: 'Song 1 Title', type: 'text', defaultValue: 'Perfect', placeholder: 'Song name' },
      { id: 'song1Artist', label: 'Song 1 Artist', type: 'text', defaultValue: 'Ed Sheeran', placeholder: 'Artist name' },
      { id: 'song1Youtube', label: 'Song 1 YouTube link', type: 'youtube', defaultValue: '', placeholder: 'Paste a YouTube link', searchFrom: ['song1Title', 'song1Artist'] },
      { id: 'song1Memory', label: 'Song 1 Memory', type: 'textarea', defaultValue: 'This was playing the night I realized I was falling for you.', placeholder: 'Why this song means something...' },
      { id: 'song2Title', label: 'Song 2 Title', type: 'text', defaultValue: 'All of Me', placeholder: 'Song name' },
      { id: 'song2Artist', label: 'Song 2 Artist', type: 'text', defaultValue: 'John Legend', placeholder: 'Artist name' },
      { id: 'song2Youtube', label: 'Song 2 YouTube link', type: 'youtube', defaultValue: '', placeholder: 'Paste a YouTube link', searchFrom: ['song2Title', 'song2Artist'] },
      { id: 'song2Memory', label: 'Song 2 Memory', type: 'textarea', defaultValue: 'Every word feels like it was written just for us.', placeholder: 'Why this song means something...' },
      { id: 'song3Title', label: 'Song 3 Title', type: 'text', defaultValue: 'Can\'t Help Falling in Love', placeholder: 'Song name' },
      { id: 'song3Artist', label: 'Song 3 Artist', type: 'text', defaultValue: 'Elvis Presley', placeholder: 'Artist name' },
      { id: 'song3Youtube', label: 'Song 3 YouTube link', type: 'youtube', defaultValue: '', placeholder: 'Paste a YouTube link', searchFrom: ['song3Title', 'song3Artist'] },
      { id: 'song3Memory', label: 'Song 3 Memory', type: 'textarea', defaultValue: 'Because I really couldn\'t help it.', placeholder: 'Why this song means something...' },
      { id: 'song4Title', label: 'Song 4 Title', type: 'text', defaultValue: '', placeholder: 'Song name (optional)' },
      { id: 'song4Artist', label: 'Song 4 Artist', type: 'text', defaultValue: '', placeholder: 'Artist name' },
      { id: 'song4Youtube', label: 'Song 4 YouTube link', type: 'youtube', defaultValue: '', placeholder: 'Paste a YouTube link', searchFrom: ['song4Title', 'song4Artist'] },
      { id: 'song4Memory', label: 'Song 4 Memory', type: 'textarea', defaultValue: '', placeholder: 'Why this song means something...' },
      { id: 'footerNote', label: 'Footer Note', type: 'text', defaultValue: 'made with love, just for you', placeholder: 'e.g. made with love, just for you' },
    ],
  },
  {
    id: 'promise-jar',
    name: 'Promise Jar',
    description: 'Folded paper notes inside a jar, each revealing a promise',
    icon: '🫙',
    category: 'interactive',
    fields: [
      { id: 'title', label: 'Section Title', type: 'text', defaultValue: 'My Promises To You', placeholder: 'e.g. From My Heart' },
      { id: 'subtitle', label: 'Subtitle', type: 'text', defaultValue: 'Tap a note to unfold a promise', placeholder: 'Instruction line' },
      { id: 'jarColor', label: 'Jar Accent Color', type: 'color', defaultValue: '#f59e0b' },
      { id: 'promise1', label: 'Promise 1', type: 'textarea', defaultValue: 'I promise to always make you laugh, even on your hardest days.', placeholder: 'Write a promise...' },
      { id: 'promise2', label: 'Promise 2', type: 'textarea', defaultValue: 'I promise to hold your hand through every storm.', placeholder: 'Write a promise...' },
      { id: 'promise3', label: 'Promise 3', type: 'textarea', defaultValue: 'I promise to never stop surprising you with small acts of love.', placeholder: 'Write a promise...' },
      { id: 'promise4', label: 'Promise 4', type: 'textarea', defaultValue: 'I promise to be your safe place, always.', placeholder: 'Write a promise...' },
      { id: 'promise5', label: 'Promise 5', type: 'textarea', defaultValue: 'I promise to love you more with every passing day.', placeholder: 'Write a promise...' },
    ],
  },
];

const TEMPLATES_BY_LANG: Record<Lang, TemplateDef[]> = {
  en: TEMPLATES,
  fr: TEMPLATES.map((tpl) => {
    const text = TEMPLATES_FR[tpl.id];
    if (!text) return tpl;
    return {
      ...tpl,
      name: text.name,
      description: text.description,
      fields: tpl.fields.map((field) => ({ ...field, ...text.fields[field.id] })),
    };
  }),
};

export const getTemplates = (lang: Lang): TemplateDef[] => TEMPLATES_BY_LANG[lang];

export const getTemplate = (id: string, lang: Lang = 'en'): TemplateDef | undefined =>
  TEMPLATES_BY_LANG[lang].find((t) => t.id === id);

// Labels live in the i18n dictionary under `categories`
export const CATEGORIES = [
  { id: 'layout', color: 'bg-blue-100 text-blue-700' },
  { id: 'content', color: 'bg-green-100 text-green-700' },
  { id: 'media', color: 'bg-purple-100 text-purple-700' },
  { id: 'interactive', color: 'bg-orange-100 text-orange-700' },
  { id: 'decoration', color: 'bg-pink-100 text-pink-700' },
] as const;

export const MAX_IMAGES = 8;

// Number of image fields that currently hold a picture, across the whole canvas.
export const countImages = (items: CanvasItem[]): number =>
  items.reduce((total, item) => {
    const imageFields = getTemplate(item.templateId)?.fields.filter((f) => f.type === 'image') ?? [];
    return total + imageFields.filter((f) => item.values[f.id]).length;
  }, 0);

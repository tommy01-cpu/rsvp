export type EventDetailCard = {
  icon: 'calendar' | 'clock' | 'map-pin';
  title: string;
  line1: string;
  line2: string;
};

export type ProgramItem = {
  time: string;
  label: string;
  icon: 'heart' | 'clock' | 'camera' | 'music' | 'utensils';
};

export type EntourageContent = {
  groomParents: string[];
  brideParents: string[];
  officiatingMinister: string;
  principalSponsorsMale: string[];
  principalSponsorsFemale: string[];
  bestMan: string;
  groomsmen: string[];
  maidOfHonor: string;
  bridesmaid: string[];
  coinBearer: string[];
  bibleBearer: string[];
  ringBearer: string[];
  flower: string[];
  verse: string;
};

export type WeddingContent = {
  blessingText: string;
  brideName: string;
  groomName: string;
  heroSubtitle: string;
  weddingDateLabel: string;
  heroImageUrl: string;

  invitationEyebrow: string;
  invitationTitle: string;
  invitationText: string;

  eventTitle: string;
  eventDetails: EventDetailCard[];

  programmeTitle: string;
  programmeItems: ProgramItem[];

  galleryImages: string[];

  entourageTitle: string;
  entourage: EntourageContent;

  venueTitle: string;
  venueDescription: string;
  venueAddressLine1: string;
  venueAddressLine2: string;
  venueMapUrl: string;
  venueImageUrl: string;

  rsvpTitle: string;
  rsvpDeadlineLabel: string;

  footerMessage: string;
};

export type SectionConfig = {
  key: string;
  label: string;
  is_enabled: boolean;
  sort_order: number;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  is_enabled: boolean;
  sort_order: number;
};

export type GalleryImageItem = {
  id: string;
  image_url: string;
  title: string;
  is_enabled: boolean;
  sort_order: number;
};

export const defaultWeddingContent: WeddingContent = {
  blessingText: 'By the grace of God and with the blessings of our families',
  brideName: 'Claire',
  groomName: 'James',
  heroSubtitle: 'cordially invited you to join us as we celebrate the sacrament of matrimony',
  weddingDateLabel: 'May 09, 2026',
  heroImageUrl:
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600',

  invitationEyebrow: 'You are invited',
  invitationTitle: 'A Celebration of Love',
  invitationText:
    'We joyfully invite you to share in the celebration of our wedding day, as we exchange vows and begin our journey together as husband and wife. Your presence will make this day truly unforgettable.',

  eventTitle: 'Mark Your Calendar',
  eventDetails: [
    { icon: 'calendar', title: 'Date', line1: 'Saturday', line2: 'May 09, 2026' },
    { icon: 'clock', title: 'Time', line1: 'Ceremony at 9:30 AM', line2: 'Reception to follow' },
    {
      icon: 'map-pin',
      title: 'Venue',
      line1: "The Potter's House Christian Center",
      line2: 'Las Pinas City, Philippines',
    },
  ],

  programmeTitle: 'Wedding Programme',
  programmeItems: [
    { time: '9:30 AM', label: 'Entourage', icon: 'heart' },
    { time: '9:45 AM', label: 'Preaching', icon: 'clock' },
    { time: '10:05 AM', label: 'Wedding Ceremony', icon: 'heart' },
    { time: '10:35 AM', label: 'Photos & Preparations', icon: 'camera' },
    { time: '10:50 AM', label: 'Wedding Toast', icon: 'music' },
    { time: '11:00 AM', label: 'Lunch & Activities', icon: 'utensils' },
    { time: '11:50 AM', label: 'Tossing of Bouquet', icon: 'heart' },
    { time: '11:55 AM', label: 'Slicing & Eating of Cake', icon: 'utensils' },
    { time: '12:00 PM', label: 'Messages', icon: 'heart' },
  ],

  galleryImages: [
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],

  entourageTitle: 'Entourage',
  entourage: {
    groomParents: ['Mr. Sande T. Malinao', 'Mrs. Susana G. Malinao'],
    brideParents: ['Mr. Arnel Dungcayan', 'Mrs. Emily Dungcayan'],
    officiatingMinister: 'Pastor Ronilo Garcia',
    principalSponsorsMale: [
      'Mr. Jayrold Visitacion',
      'Mr. Cris Santos',
      'Mr. Willy Saturno',
      'Mr. Jayson Oracion',
      'Mr. Jijian Arzadon',
      'Mr. Neil Teraza',
      'Mr. Henry Saligan',
      'Mr. Jayson Coloma',
      'Mr. Rocky Patalinghug',
      'Mr. Alan Tablada',
    ],
    principalSponsorsFemale: [
      'Mrs. Anna Marie Visitacion',
      'Mrs. Imelda Amores',
      'Mrs. Josh Querubin',
      'Mrs. Amalia Solis',
      'Mrs. Zeny Arzadon',
      'Mrs. Nhing Guda',
      'Mrs. Robee Saligan',
      'Mrs. Mhean Coloma',
      'Mrs. Joanna Patalinghug',
      'Mrs. Sonia Tablada',
    ],
    bestMan: 'Macky Nulla',
    groomsmen: ['Emmanuel Navarez Jr.', 'John Arwin Dungcayan', 'Darwin Dungcayan', 'Jaryll Dungcayan'],
    maidOfHonor: 'Jessalyn R. Cruz',
    bridesmaid: ['Emelyn Yap Jandoc', 'Sharon Tabisaura', 'Abegail Apolinar', 'Alexa Granadil'],
    coinBearer: ['Getulio Celis III', 'Sean Malinao'],
    bibleBearer: ['Rohan Zev', 'Gian Macaraig'],
    ringBearer: ['Renz lucas Hilot'],
    flower: ['Zoey Del Rosario', 'Princess Romero', 'Jeann Faith Dela Cruz'],
    verse: '"And above all these things put on love which is the bond of perfectness." - Colossians 3:14',
  },

  venueTitle: "The Potter's House Christian Center Las Pinas Church",
  venueDescription:
    'God has placed everything necessary to accomplish His will in the setting of the local church. Ephesians 1:22-23 ...the church. Which is his body, the fullness of him who fills everything in every way. God\'s will is accomplished in us and through us as connect and commit ourselves to a local church.',
  venueAddressLine1: '347 Diego Cera Avenue, Pulang Lupa',
  venueAddressLine2: 'Las Pinas City, Philippines',
  venueMapUrl:
    "https://www.google.com/maps/place/The+Potter's+House+Christian+Center/@14.4727999,120.9712606,17z/data=!3m1!4b1!4m6!3m5!1s0x3397cdc4b4b6d82b:0xb297dcb11ec66ae9!8m2!3d14.4728!4d120.9761315!16s%2Fg%2F11bx1z3sjf?hl=en&entry=ttu",
  venueImageUrl:
    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=900',

  rsvpTitle: 'Kindly Reply',
  rsvpDeadlineLabel: 'May 03, 2026',

  footerMessage: 'With love & gratitude for celebrating with us.',
};

export const defaultSectionConfigs: SectionConfig[] = [
  { key: 'invitation', label: 'Invitation', is_enabled: true, sort_order: 10 },
  { key: 'event_details', label: 'Event Details', is_enabled: true, sort_order: 20 },
  { key: 'gallery', label: 'Gallery', is_enabled: true, sort_order: 30 },
  { key: 'programme', label: 'Programme', is_enabled: true, sort_order: 40 },
  { key: 'entourage', label: 'Entourage', is_enabled: true, sort_order: 50 },
  { key: 'venue', label: 'Venue', is_enabled: true, sort_order: 60 },
  { key: 'faq', label: 'FAQ', is_enabled: false, sort_order: 70 },
  { key: 'rsvp', label: 'RSVP Form', is_enabled: true, sort_order: 80 },
];


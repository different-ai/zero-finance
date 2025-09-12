export interface Founder {
  id: string;
  name: string;
  twitter: string;
  avatar?: string;
  role: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  website?: string;
  twitter?: string;
  founders: Founder[];
  funding: {
    amount: number;
    round: string;
    date: string;
    investors?: string[];
  };
  category: string;
  featured?: boolean;
}

export const startups: Startup[] = [
  {
    id: 'mediar',
    name: 'Mediar',
    description:
      '🤖 AI data entry that makes RPA obsolete. Transform manual workflows into automated processes with AI agents that learn from your team and execute with enterprise-grade reliability.',
    website: 'https://mediar.ai',
    twitter: 'https://x.com/MediarAI',
    founders: [
      {
        id: 'louis030195',
        name: 'Louis Beaumont',
        twitter: 'https://x.com/louis030195',
        role: 'Co-founder & CEO',
        avatar:
          'https://pbs.twimg.com/profile_images/1749288192958935040/dPXHmIy__400x400.jpg',
      },
      {
        id: 'm13v_',
        name: 'Mathis Vella',
        twitter: 'https://x.com/m13v_',
        role: 'Co-founder',
        avatar:
          'https://pbs.twimg.com/profile_images/1835321574267629568/VObqkxsW_400x400.jpg',
      },
    ],
    funding: {
      amount: 2800000, // $2.8M funding
      round: 'Seed',
      date: '2024',
      investors: [],
    },
    category: 'AI',
    featured: true,
  },
];

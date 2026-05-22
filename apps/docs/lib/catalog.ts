import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type PlaygroundIcon = ComponentProps<typeof Ionicons>['name'];

export type PlaygroundItem = {
  slug: string;
  title: string;
  description: string;
  href: `/button` | `/input` | `/icons`;
  category: string;
  icon: PlaygroundIcon;
  /** Accent for icon well + border highlight */
  accent: 'primary' | 'violet' | 'teal';
  featured?: boolean;
};

export const playgroundCatalog: PlaygroundItem[] = [
  {
    slug: 'button',
    title: 'Button',
    description: 'Tones, appearances, FAB, and social auth — press and feel the states.',
    href: '/button',
    category: 'Controls',
    icon: 'hand-left-outline',
    accent: 'primary',
    featured: true,
  },
  {
    slug: 'input',
    title: 'Input',
    description: 'Labels, validation, icons, and password patterns on a real keyboard.',
    href: '/input',
    category: 'Controls',
    icon: 'text-outline',
    accent: 'violet',
  },
  {
    slug: 'icons',
    title: 'Icons',
    description: 'Full Arlo icon set — outline and solid, sized for native UI.',
    href: '/icons',
    category: 'Foundations',
    icon: 'grid-outline',
    accent: 'teal',
  },
];

export const playgroundCategories = [...new Set(playgroundCatalog.map((c) => c.category))];

export const featuredPlaygroundItem = playgroundCatalog.find((c) => c.featured);

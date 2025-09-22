
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: '🏠',
    description: 'Main dashboard and predictions'
  },
  {
    name: 'Predictions',
    href: '/predictions',
    icon: '🔮',
    description: 'AI-powered sports predictions'
  },
  {
    name: 'Live Scores',
    href: '/live',
    icon: '📺',
    description: 'Real-time match updates'
  },
  {
    name: 'Formations',
    href: '/formations',
    icon: '⚽',
    description: 'Football tactical formations'
  },
  {
    name: 'Quiz',
    href: '/quiz',
    icon: '🧠',
    description: 'Test your sports knowledge'
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: '💰',
    description: 'Pi coin balance and rewards'
  },
  {
    name: 'Community',
    href: '/community',
    icon: '👥',
    description: 'Sports community discussions'
  },
  {
    name: 'News',
    href: '/news',
    icon: '📰',
    description: 'Latest sports news'
  }
];
export const navItems = [
  { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { id: "predictions", label: "🔮 Predictions", icon: "🔮" },
  { id: "scores", label: "📊 Live Scores", icon: "📊" },
  { id: "news", label: "📰 News", icon: "📰" },
  { id: "quiz", label: "🎯 Quiz", icon: "🎯" },
  { id: "tools", label: "🛠️ Tools", icon: "🛠️" },
  { id: "search", label: "🔍 Search", icon: "🔍" },
];

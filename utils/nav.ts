import { ArrowLeftRight, LayoutDashboard, Settings, TrendingUp, Wallet } from 'lucide-vue-next'

export const navItems = [
  { to: '/', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/transactions', key: 'nav.transactions', icon: ArrowLeftRight },
  { to: '/wallets', key: 'nav.wallets', icon: Wallet },
  { to: '/analytics', key: 'nav.analytics', icon: TrendingUp },
  { to: '/settings', key: 'nav.settings', icon: Settings }
]

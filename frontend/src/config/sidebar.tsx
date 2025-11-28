import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconUsers,
} from '@tabler/icons-react'

export const sidebar = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconDashboard,
  },
  {
    title: 'Lifecycle',
    url: '*',
    icon: IconListDetails,
  },
  {
    title: 'Analytics',
    url: '#',
    icon: IconChartBar,
  },
  {
    title: 'Projects',
    url: '#',
    icon: IconFolder,
  },
  {
    title: 'Team',
    url: '#',
    icon: IconUsers,
  },
]

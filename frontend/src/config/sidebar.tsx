import {
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
    title: 'Snapshots',
    url: '/snapshots',
    icon: IconFolder,
  },
  {
    title: 'Users',
    url: '/users',
    icon: IconUsers,
    // icon: IconListDetails,
  },
  {
    title: 'Pokemon',
    url: '/pokemon',
    icon: IconListDetails,
    // icon: IconListDetails,
  },
  //   {
  //     title: 'Analytics',
  //     url: '#',
  //     icon: IconChartBar,
  //   },
  //   {
  //     title: 'Team',
  //     url: '#',
  //     icon: IconUsers,
  //   },
]

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilList,
  cilPeople,
  cilFile,
  cilLayers,
  cilWallet,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Category',
    to: '/category',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vendors',
    to: '/vendors',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bills',
    to: '/bills',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Bill Types',
  //   to: '/bill-types',
  //   icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'User Wallet',
    to: '/user-wallet',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
  },

]

export default _nav

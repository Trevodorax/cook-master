import React from 'react'
import Link from 'next/link'

type Props = {
  containerClassname: string,
  itemsClassname: string
}

export default function Navigation ({ containerClassname, itemsClassname }: Props) {
  const navigationItems = [
    {
      address: '/',
      displayedName: 'Home'
    },
    {
      address: '/login',
      displayedName: 'Login'
    }
  ]

  return (
    <div className={containerClassname}>
      {navigationItems.map((route, index) => {
        return (
          <div className={itemsClassname} key={index}>
            <Link
              href={route.address}
            >
              {route.displayedName}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

import Link from 'next/link'

export default function Navigation ({ containerClassname, itemsClassname }) {
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

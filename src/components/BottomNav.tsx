import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, BarChart2, Settings } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: <Home size={24} />, label: 'Home' },
    { to: '/add', icon: <PlusSquare size={24} />, label: 'Add' },
    { to: '/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
    { to: '/settings', icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full text-sm font-medium ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;

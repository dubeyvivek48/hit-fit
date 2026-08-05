import { NavLink } from "react-router-dom";
import { Home, PlusSquare, BarChart2, Settings } from "lucide-react";

const BottomNav = () => {
  const activeLinkStyle = {
    color: "#2563EB", // blue-600
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <NavLink
          to="/"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink
          to="/add-entry"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
        >
          <PlusSquare size={24} />
          <span className="text-xs">Add Log</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
        >
          <BarChart2 size={24} />
          <span className="text-xs">Analytics</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
        >
          <Settings size={24} />
          <span className="text-xs">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
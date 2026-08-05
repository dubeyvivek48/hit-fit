import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;

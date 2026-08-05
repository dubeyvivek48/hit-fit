import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/main/Home';
import AddEntry from './pages/main/AddEntry';
import Analytics from './pages/main/Analytics';
import Settings from './pages/main/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="add" element={<AddEntry />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;

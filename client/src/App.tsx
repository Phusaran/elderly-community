import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivityDetail from './pages/ActivityDetail'; // <--- 1. Import มา
import MyBookings from './pages/MyBookings';
import AdminRoute from './components/AdminRoute'; // Import ยาม
import AdminDashboard from './pages/admin/Dashboard';
import ActivityForm from './pages/admin/ActivityForm';
import Marketplace from './pages/Marketplace';
import MarketForm from './pages/MarketForm';
import UserForm from './pages/admin/UserForm';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200 font-sans pb-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/admin/dashboard" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/activity/new" element={
          <AdminRoute><ActivityForm /></AdminRoute>
          } />
          <Route path="/admin/activity/edit/:id" element={
          <AdminRoute><ActivityForm /></AdminRoute>
          } />
          <Route path="/admin/user/edit/:id" element={
          <AdminRoute><UserForm /></AdminRoute>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/market/new" element={<MarketForm />} />
          <Route path="/market/edit/:id" element={<MarketForm />} />
          </Routes>
          
      </div>
    </Router>
  );
}

export default App;
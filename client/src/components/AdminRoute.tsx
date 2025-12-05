import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const role = localStorage.getItem('role'); // ดึง Role ที่เราเก็บตอน Login

  if (role !== 'admin') {
    alert('⛔ สำหรับผู้ดูแลระบบเท่านั้นครับ');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <--- เพิ่มตัวแปรเช็คสถานะ
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      alert('เข้าสู่ระบบสำเร็จ! 🎉');
      window.location.href = '/'; 
    } catch (error) {
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ❌');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4 font-bold text-primary">เข้าสู่ระบบ 🔐</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ช่อง Username */}
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">ชื่อผู้ใช้</span></label>
              <input 
                type="text" 
                placeholder="username" 
                className="input input-bordered w-full focus:input-primary" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* ช่อง Password (มีลูกกะตา) */}
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">รหัสผ่าน</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} // <--- เปลี่ยน Type ตามสถานะ
                  placeholder="password" 
                  className="input input-bordered w-full focus:input-primary pr-10" // pr-10 เว้นที่ขวาไว้ให้ไอคอน
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {/* ปุ่มลูกกะตา */}
                <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-gray-400 hover:text-primary cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    // ไอคอนตาเปิด (Show)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    // ไอคอนตาปิด (Hide)
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6 shadow-lg">เข้าสู่ระบบ</button>
          </form>
          
          <div className="divider text-sm text-gray-500">หรือ</div>
          
          <p className="text-center text-sm">
            ยังไม่มีบัญชี? <Link to="/register" className="link link-primary font-bold">สมัครสมาชิกที่นี่</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
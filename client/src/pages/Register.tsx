import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', formData);
      alert('สมัครสมาชิกเรียบร้อย! กรุณาเข้าสู่ระบบ ✅');
      navigate('/login');
    } catch (error: any) { // eslint-disable-line
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">สมัครสมาชิกใหม่ ✨</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label"><span className="label-text">ชื่อผู้ใช้ (Username)</span></label>
              <input type="text" name="username" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <div>
              <label className="label"><span className="label-text">รหัสผ่าน (Password)</span></label>
              <input type="password" name="password" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <div>
              <label className="label"><span className="label-text">เบอร์โทรศัพท์ (Phone)</span></label>
              <input type="tel" name="phone" className="input input-bordered w-full" onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">Register</button>
          </form>
          <p className="text-center text-sm mt-4">
            มีบัญชีแล้ว? <Link to="/login" className="link link-primary">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
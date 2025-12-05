import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    role: 'user',
    profile_img: '' // <--- 1. เพิ่ม field นี้
  });

  useEffect(() => {
    api.get(`/users/${id}`).then((res) => {
      setFormData({
        username: res.data.username,
        phone: res.data.phone || '',
        role: res.data.role,
        profile_img: res.data.profile_img || '' // <--- 2. ดึงรูปมาใส่ state
      });
    }).catch(() => alert('โหลดข้อมูลไม่สำเร็จ'));
  }, [id]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/users/${id}`, formData);
      alert('✅ อัปเดตข้อมูลผู้ใช้สำเร็จ!');
      navigate('/admin/dashboard');
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#38a89d] p-6 text-center text-white">
          <h1 className="text-2xl font-bold">👤 แก้ไขข้อมูลสมาชิก</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          
          {/* --- 3. ส่วนโชว์รูป Preview --- */}
          <div className="flex flex-col items-center mb-4">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-[#38a89d] ring-offset-base-100 ring-offset-2">
                <img 
                  src={formData.profile_img || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                  alt="profile" 
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=USER"; }}
                />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label font-bold">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="input input-bordered" required />
          </div>

          <div className="form-control">
            <label className="label font-bold">เบอร์โทรศัพท์</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered" />
          </div>

          {/* --- 4. เพิ่มช่องกรอก URL รูป --- */}
          <div className="form-control">
            <label className="label font-bold">ลิงก์รูปโปรไฟล์ (URL)</label>
            <input 
              type="url" 
              name="profile_img" 
              value={formData.profile_img} 
              onChange={handleChange} 
              placeholder="https://..." 
              className="input input-bordered" 
            />
          </div>

          <div className="form-control">
            <label className="label font-bold text-[#f77a45]">สิทธิ์การใช้งาน (Role)</label>
            <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered select-warning w-full font-bold">
              <option value="user">User (สมาชิกทั่วไป)</option>
              <option value="admin">Admin (ผู้ดูแลระบบ)</option>
            </select>
            <label className="label"><span className="label-text-alt text-error">*ระวัง: Admin สามารถลบข้อมูลได้ทุกอย่าง</span></label>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost flex-1">ยกเลิก</button>
            <button type="submit" disabled={loading} className="btn flex-1 bg-[#38a89d] hover:bg-[#2b857c] text-white border-none">
              {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
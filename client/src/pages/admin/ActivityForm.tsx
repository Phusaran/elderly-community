import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const ActivityForm = () => {
  const { id } = useParams(); // ถ้ามี id = แก้ไข, ไม่มี = สร้างใหม่
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'สุขภาพ',
    date: '',
    location: '',
    maxParticipants: 20
  });

  // ดึงข้อมูลเดิมมาใส่ (กรณีแก้ไข)
  useEffect(() => {
    if (isEditMode) {
      api.get(`/activities/${id}`).then((res) => {
        const data = res.data;
        // แปลงวันที่ให้เป็น YYYY-MM-DD เพื่อใส่ใน input type="date"
        const dateStr = new Date(data.date).toISOString().split('T')[0];
        setFormData({ ...data, date: dateStr });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/activities/${id}`, formData);
        alert('✅ อัปเดตข้อมูลสำเร็จ!');
      } else {
        await api.post('/activities', formData);
        alert('🎉 สร้างกิจกรรมใหม่สำเร็จ!');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด โปรดตรวจสอบข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header แถบสีด้านบน */}
        <div className="bg-[#38a89d] p-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-3 transform origin-bottom-left"></div>
          <h1 className="text-3xl font-bold relative z-10">
            {isEditMode ? '✏️ แก้ไขกิจกรรม' : '✨ สร้างกิจกรรมใหม่'}
          </h1>
          <p className="text-white/80 text-sm mt-1 relative z-10">
            กรอกรายละเอียดกิจกรรมเพื่อประชาสัมพันธ์ให้ชุมชนทราบ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* ชื่อกิจกรรม */}
          <div className="form-control">
            <label className="label font-bold text-gray-700">
              <span className="label-text flex items-center gap-2">📝 ชื่อกิจกรรม</span>
            </label>
            <input 
              type="text" 
              name="title" 
              placeholder="เช่น รำไทเก๊กยามเช้า, สอนถักไหมพรม"
              className="input input-bordered w-full focus:border-[#38a89d] focus:ring-1 focus:ring-[#38a89d] text-lg" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* รายละเอียด (Textarea ใหญ่ๆ) */}
          <div className="form-control">
            <label className="label font-bold text-gray-700">
              <span className="label-text flex items-center gap-2">📄 รายละเอียด</span>
            </label>
            <textarea 
              name="description" 
              className="textarea textarea-bordered h-40 text-base focus:border-[#38a89d] focus:ring-1 focus:ring-[#38a89d]" 
              placeholder="อธิบายรายละเอียดของกิจกรรม..."
              value={formData.description} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>

          {/* Grid 2 คอลัมน์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* หมวดหมู่ */}
            <div className="form-control">
              <label className="label font-bold text-gray-700">
                <span className="label-text">🏷️ หมวดหมู่</span>
              </label>
              <select 
                name="category" 
                className="select select-bordered w-full focus:border-[#38a89d]" 
                value={formData.category} 
                onChange={handleChange}
              >
                <option value="สุขภาพ">สุขภาพ (Fitness)</option>
                <option value="นันทนาการ">นันทนาการ (Recreation)</option>
                <option value="ธรรมะ">ธรรมะ (Religious)</option>
                <option value="งานฝีมือ">งานฝีมือ (Crafts)</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            {/* จำนวนคน */}
            <div className="form-control">
              <label className="label font-bold text-gray-700">
                <span className="label-text">👥 จำนวนรับสูงสุด (คน)</span>
              </label>
              <input 
                type="number" 
                name="maxParticipants" 
                className="input input-bordered w-full focus:border-[#38a89d]" 
                value={formData.maxParticipants} 
                onChange={handleChange} 
                required 
                min="1"
              />
            </div>

            {/* วันที่ */}
            <div className="form-control">
              <label className="label font-bold text-gray-700">
                <span className="label-text">📅 วันที่จัดกิจกรรม</span>
              </label>
              <input 
                type="date" 
                name="date" 
                className="input input-bordered w-full focus:border-[#38a89d]" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>

            {/* สถานที่ */}
            <div className="form-control">
              <label className="label font-bold text-gray-700">
                <span className="label-text">📍 สถานที่</span>
              </label>
              <input 
                type="text" 
                name="location" 
                placeholder="เช่น ศาลากลางหมู่บ้าน"
                className="input input-bordered w-full focus:border-[#38a89d]" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="divider"></div>

          {/* ปุ่มกด Action */}
          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="btn btn-ghost flex-1 hover:bg-red-600 text-white bg-red-500"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="btn flex-1 bg-[#38a89d] hover:bg-[#2b857c] text-white border-none shadow-md text-lg"
              disabled={loading}
            >
              {loading ? 'กำลังบันทึก...' : (isEditMode ? 'บันทึกการแก้ไข 💾' : 'สร้างกิจกรรม ✅')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
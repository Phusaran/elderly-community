import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const MarketForm = () => {
  const { id } = useParams(); // เช็คว่ามี ID ส่งมาไหม (ถ้ามี = แก้ไข)
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'อาหาร', contact_info: '', image_url: ''
  });

  // ถ้าเป็นโหมดแก้ไข ให้ดึงข้อมูลเก่ามาโชว์ก่อน
  useEffect(() => {
    if (isEditMode) {
      api.get(`/market/${id}`).then(res => {
        setFormData(res.data);
      }).catch(() => alert('โหลดข้อมูลไม่สำเร็จ'));
    }
  }, [id, isEditMode]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/market/${id}`, formData); // แก้ไข (PUT)
        alert('✅ แก้ไขข้อมูลสินค้าเรียบร้อย!');
      } else {
        await api.post('/market', formData); // สร้างใหม่ (POST)
        alert('🎉 ลงขายสินค้าสำเร็จ!');
      }
      navigate('/marketplace');
    } catch (error) {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center items-center">
      <div className="card w-full max-w-lg bg-white shadow-xl border border-gray-100">
        <div className="bg-[#f77a45] p-6 text-white text-center">
           <h2 className="text-2xl font-bold">
             {isEditMode ? '✏️ แก้ไขข้อมูลสินค้า' : '🏪 ลงประกาศขายสินค้า'}
           </h2>
        </div>
        
        <div className="card-body p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label font-bold">ชื่อสินค้า</label>
              <input type="text" name="title" value={formData.title} className="input input-bordered w-full" required onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label font-bold">ราคา (บาท)</label>
                    <input type="number" name="price" value={formData.price} className="input input-bordered w-full" required onChange={handleChange} />
                </div>
                <div className="form-control">
                    <label className="label font-bold">หมวดหมู่</label>
                    <select name="category" value={formData.category} className="select select-bordered w-full" onChange={handleChange}>
                        <option value="อาหาร">อาหาร 🍲</option>
                        <option value="งานฝีมือ">งานฝีมือ 🧶</option>
                        <option value="ของมือสอง">ของมือสอง 📦</option>
                        <option value="บริการ">บริการ 🛠️</option>
                        <option value="อื่นๆ">อื่นๆ 🏷️</option>
                    </select>
                </div>
            </div>

            <div className="form-control">
              <label className="label font-bold">รายละเอียดสินค้า</label>
              <textarea name="description" value={formData.description} className="textarea textarea-bordered h-24" required onChange={handleChange}></textarea>
            </div>

            <div className="form-control">
              <label className="label font-bold text-[#f77a45]">ช่องทางติดต่อ</label>
              <input type="text" name="contact_info" value={formData.contact_info} className="input input-bordered input-warning w-full" required onChange={handleChange} />
            </div>

            <div className="form-control">
              <label className="label font-bold">ลิงก์รูปภาพ (URL)</label>
              <input type="url" name="image_url" value={formData.image_url} placeholder="https://..." className="input input-bordered w-full" onChange={handleChange} />
            </div>

            <div className="divider"></div>

            <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost flex-1">ยกเลิก</button>
                <button type="submit" disabled={loading} className="btn bg-gradient-to-r from-[#FF6F61] via-[#FF9F20] to-[#FFEA00] border-none text-white flex-1 text-lg shadow-md">
                    {loading ? 'กำลังบันทึก...' : (isEditMode ? 'บันทึกการแก้ไข' : 'ลงขายทันที')}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarketForm;
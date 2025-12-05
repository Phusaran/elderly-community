import { useEffect, useState } from 'react';
import api from '../api/axios';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    bio: '',
    profile_img: ''
  });

  // ดึงข้อมูลตัวเอง (ไม่เปลี่ยนแปลง)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me');
        setFormData({
          username: res.data.username,
          phone: res.data.phone || '',
          bio: res.data.bio || '',
          profile_img: res.data.profile_img || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/api/auth/updatedetails', formData);
      alert('✅ บันทึกข้อมูลเรียบร้อย!');
      window.location.reload();
    } catch (error) {
      alert('เกิดข้อผิดพลาด');
    } finally {
      setIsSaving(false);
    }
  };

  // 🟠 เปลี่ยนสี Spinner เป็นสีส้ม
  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-[#f77a45]"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="card max-w-4xl mx-auto bg-white shadow-xl overflow-hidden border border-gray-100 rounded-3xl">

        {/* --- 1. Header Banner (แถบสีด้านบน) --- */}
        {/* 🟠 เปลี่ยน Gradient จากเขียวเป็นส้ม-เหลือง */}
        <div className="h-48 bg-gradient-to-r from-[#f77a45] to-[#ffb861] relative">
          {/* ลวดลายตกแต่ง (Optional) */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="px-8 pb-8">

          {/* --- 2. Profile Avatar (รูปโปรไฟล์ลอยทับ Banner) --- */}
          <div className="relative -mt-20 mb-6 flex flex-col items-center">
            <div className="avatar indicator">
              <div className="w-40 h-40 rounded-full ring-4 ring-white shadow-2xl bg-base-100">
                <img
                  src={formData.profile_img || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  alt="profile"
                  className="object-cover"
                  onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=USER"; }}
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mt-4">{formData.username}</h1>
            <p className="text-gray-500">สมาชิกชุมชนผู้สูงอายุ</p>
          </div>

          {/* --- 3. Form Section --- */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-600 flex items-center gap-2">
                    👤 ชื่อผู้ใช้ (Username)
                  </span>
                </label>
                {/* 🟠 เปลี่ยน Focus Color */}
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input input-bordered w-full focus:border-[#f77a45] bg-gray-50"
                />
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-600 flex items-center gap-2">
                    📞 เบอร์โทรศัพท์
                  </span>
                </label>
                {/* 🟠 เปลี่ยน Focus Color */}
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08x-xxx-xxxx"
                  className="input input-bordered w-full focus:border-[#f77a45] bg-gray-50"
                />
              </div>
            </div>

            {/* Profile Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-gray-600 flex items-center gap-2">
                  🖼️ ลิงก์รูปโปรไฟล์ (URL)
                </span>
              </label>
              <div className="flex gap-4">

                <input
                  type="url"
                  name="profile_img"
                  value={formData.profile_img}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="input input-bordered w-full **flex-1** focus:border-[#f77a45] bg-gray-50"
                />

                <span
                  className="btn bg-gray-200 border-gray-300 hover:bg-gray-300 whitespace-nowrap"
                >
                  วางลิงก์
                </span>
              </div>
              <label className="label">
                <span className="label-text-alt text-gray-400"> คัดลอกที่อยู่รูปภาพจากอินเทอร์เน็ตมาวางที่นี่</span>
              </label>
            </div>

            {/* Bio */}
            <div className="form-control">
              {/* 📝 แนะนำตัวสั้นๆ (Bio) */}
              <div className="form-control **text-center**">
                <label className="label">
                  <span className="label-text font-bold text-gray-600 flex items-center gap-2">
                    📝 แนะนำตัวสั้นๆ (Bio)
                  </span>
                </label>

                {/* 🛠️ NEW: Div ห่อหุ้มเพื่อจัดตรงกลาง */}
                <div className="**max-w-xl mx-auto w-full**">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    // 🛠️ เพิ่ม: คลาส 'resize-none' และ 'w-full'
                    className="textarea textarea-bordered h-32 resize-none focus:border-[#f77a45] bg-gray-50 text-base **w-full**"
                    placeholder="เขียนแนะนำตัวเอง สั้นๆ ให้เพื่อนๆ รู้จัก..."
                  ></textarea>
                </div>
              </div>

              <div className="divider"></div>

              {/* ปุ่มบันทึก */}
              <div className="flex justify-center">
                {/* 🟠 เปลี่ยนสีปุ่มบันทึกเป็นส้ม และ Hover Color เป็นส้มที่เข้มขึ้น */}
                <button
                  type="submit"
                  className="btn border-none text-white font-bold px-10 text-lg shadow-lg rounded-full"
                  style={{ backgroundImage: "linear-gradient(to right, #FF6F61, #FF9F20, #FFEA00)" }}
                  disabled={isSaving}
                >

                {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง 💾'}
              </button>
            </div>
        </div>
      </form>
    </div>
      </div >
    </div >
  );
}

export default Profile;
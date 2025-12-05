import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-8 sticky top-0 z-50">
      {/* ฝั่งซ้าย */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl text-[#f77a45] gap-2 hover:bg-transparent active:bg-transparent focus:bg-transparent"
        >
          <img
            src="/Logo.png"
            alt="Elderly Community Logo"
            className="h-8 w-auto"
          />

          <span className="hidden sm:inline font-hightower text-[#f77a45]">Elderly Community</span>
          <Link to="/marketplace" className="
    btn rounded-full border-2 border-orange-500 text-orange-600 font-semibold bg-transparent btn-sm
    hover:bg-orange-50">
            🛍️ ตลาด
          </Link>
        </Link>
      </div>

      {/* ฝั่งขวา: เพิ่ม gap-8 ให้ห่างกันและใช้ items-center จัดระนาบในแนวตั้ง */}
      <div className="flex-none flex gap-8 items-center">
        {role === 'admin' && (
          <Link to="/admin/dashboard"
            className="btn btn-sm shadow-sm 
            bg-[#FFF5EE] border border-[#f77a45] text-[#f77a45] 
            hover:bg-[#FFDAB9] hover:border-[#d66538] rounded-full"
          >
            🛠️ จัดการระบบ
          </Link>
        )}

        {token ? (
          <>
            <Link to="/my-bookings"
              className="btn border-none text-white btn-sm shadow-md px-5 rounded-full
            bg-gradient-to-r from-[#FF6F61] via-[#FF9F20] to-[#FFEA00]
            hover:opacity-90 transition duration-300">
              การจองของฉัน
            </Link>
            {/* ... ปุ่มอื่น ๆ ที่เกี่ยวข้อง ... */}
            <Link to="/profile" className="btn btn-ghost btn-circle avatar border border-gray-200 hover:border-[#38a89d] hover:shadow-md transition-all">
              <div className="w-20 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="profile" />
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-sm px-4 rounded-full
               border border-[#f77a45] text-[#f77a45] bg-transparent 
               hover:bg-[#f77a45] hover:text-white"
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="btn btn-sm font-normal rounded-full 
                           bg-transparent border border-[#F08000] text-[#F08000]
                           hover:bg-[#FFF5EE] hover:border-[#F08000]">
              เข้าสู่ระบบ
            </Link>
            <Link to="/register"
              className="btn border-none text-white btn-sm shadow-md px-5 rounded-full 
                           bg-gradient-to-r from-[#FF6F61] via-[#FF9F20] to-[#FFEA00]
                           hover:opacity-90 transition duration-300">
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
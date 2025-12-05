import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Activity, User } from '../../types';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'users'>('activities');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันโหลดข้อมูล (โหลดตาม Tab ที่เลือก)
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'activities') {
        const res = await api.get('/activities');
        setActivities(res.data);
      } else {
        const res = await api.get('/users');
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ลบกิจกรรม
  const handleDeleteActivity = async (id: string) => {
    if (!confirm('⚠️ ยืนยันการลบกิจกรรมนี้?')) return;
    try {
      await api.delete(`/activities/${id}`);
      fetchData();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
  };

  // ลบ User
  const handleDeleteUser = async (id: string) => {
    if (!confirm('⛔ ยืนยันการ "แบน" สมาชิกนี้? (ข้อมูลทุกอย่างของเขาจะหายไป)')) return;
    try {
      await api.delete(`/users/${id}`);
      alert('ลบสมาชิกเรียบร้อย');
      fetchData();
    } catch (error: any) { alert(error.response?.data?.message || 'ลบไม่สำเร็จ'); }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🛠️ แผงควบคุมผู้ดูแลระบบ</h1>
      </div>

      {/* Tabs (Segmented Control Style) */}
      <div className="flex bg-gray-200 rounded-lg shadow-sm mb-6 border border-gray-300 inline-flex">

        <a
          className={`px-4 py-2 font-semibold transition duration-200 
            ${activeTab === 'activities'
              ? 'bg-[#f77a45] text-white shadow-md rounded-l-lg'
              : 'bg-gray-300 text-gray-800 rounded-l-lg'
            }`}
          onClick={() => setActiveTab('activities')}
        >
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h1m4 0h1M7 5v4h10V5h3a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h3z"></path></svg>
            จัดการกิจกรรม
          </span>
        </a>

        <a
          className={`px-4 py-2 font-semibold transition duration-200 
            ${activeTab === 'users'
              ? 'bg-[#f77a45] text-white shadow-md rounded-r-lg'
              : 'bg-gray-300 text-gray-800 rounded-r-lg'
            }`}
          onClick={() => setActiveTab('users')}
        >
          <span className="inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M7 13a6.002 6.002 0 006-6V5h-2a2 2 0 00-2 2v2a2 2 0 00-2 2zM4 12v6m0 0H2a2 2 0 01-2-2v-4a2 2 0 012-2h2z"></path></svg>
            จัดการสมาชิก
          </span>
        </a>

      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">

          {/* --- TAB 1: กิจกรรม --- */}
          {activeTab === 'activities' && (
            <>
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-500">รายการกิจกรรมทั้งหมด ({activities.length})</h3>

                {/* 1. ปุ่ม "เพิ่มกิจกรรม" (เปลี่ยนจาก btn-primary เป็นสีส้ม) */}
                <Link
                  to="/admin/activity/new"
                  className="btn btn-sm text-white shadow-md rounded-full
                           bg-[#f77a45] hover:bg-[#d66538]"
                >
                  + เพิ่มกิจกรรม
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>ชื่อกิจกรรม</th>
                      <th>วันที่</th>
                      <th>ผู้ลงทะเบียน</th>
                      <th className="text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((item) => (
                      <tr key={item._id} className="hover">
                        <td>
                          <div className="font-bold">{item.title}</div>
                          <div className="text-xs text-gray-400">{item.location}</div>
                        </td>
                        <td>{new Date(item.date).toLocaleDateString('th-TH')}</td>
                        <td>{item.currentParticipants}/{item.maxParticipants}</td>
                        <td className="flex gap-2 justify-center">
                          {/* 2. ปุ่ม "แก้ไข" (เปลี่ยนจาก btn-warning เป็นสีส้ม) */}
                          <Link
                            to={`/admin/activity/edit/${item._id}`}
                            className="btn btn-xs text-white rounded-full 
                                               bg-[#f77a45] hover:bg-[#d66538]"
                          >
                            แก้ไข
                          </Link>

                          {/* 3. ปุ่ม "ลบ" (ใช้สีแดงมาตรฐาน แต่เพิ่ม ml-2) */}
                          <button
                            onClick={() => handleDeleteActivity(item._id)}
                            className="btn btn-sm btn-ghost rounded-full ml-2 text-[#94928f]"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {/* --- TAB 2: สมาชิก --- */}
          {activeTab === 'users' && (
            <>
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-bold text-gray-500">รายชื่อสมาชิกทั้งหมด ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>Username</th>
                      <th>เบอร์โทร</th>
                      <th>สถานะ (Role)</th>
                      <th>วันที่สมัคร</th>
                      <th className="text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="hover">
                        <td className="font-bold flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                              <span className="text-xs">{u.username[0].toUpperCase()}</span>
                            </div>
                          </div>
                          {u.username}
                        </td>
                        <td>{u.phone || '-'}</td>
                        <td>
                          {u.role === 'admin' ? (
                            <span
                              className="badge font-bold rounded-full 
                       bg-[#FFF5EE] border border-[#f77a45] text-[#f77a45] shadow-sm"
                              style={{
                                // สามารถเพิ่ม Padding เล็กน้อยเพื่อเน้นให้ป้ายดูใหญ่ขึ้น
                                padding: '0.5em 1em'
                              }}
                            >
                              Admin
                            </span>
                          ) : (
                            <span
                              className="badge font-semibold rounded-full 
               border border-gray-700 text-gray-700 bg-gray-200"
                            >
                              User
                            </span>
                          )}
                        </td>
                        <td>{new Date(u.joinedAt).toLocaleDateString('th-TH')}</td>
                        <td className="flex gap-2 justify-center">
                          <Link
                            to={`/admin/user/edit/${u._id}`}
                            className="btn btn-xs border-none rounded-full 
               bg-[#f77a45] hover:bg-[#d66538] text-white shadow-sm"
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="btn btn-sm btn-ghost rounded-full ml-2 text-[#94928f]"
                            disabled={u.role === 'admin'} // ห้ามลบ Admin (ป้องกันตัวเอง)
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
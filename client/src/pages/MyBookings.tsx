import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axios';

// ---------------------------------------------------------
// 🛠️ 1. ข้อมูลวันหยุด (เอา Logic กลับมาใส่ให้)
// ---------------------------------------------------------
const FIXED_HOLIDAYS = [
  { month: '01', day: '01', localName: 'วันขึ้นปีใหม่ 🎉' },
  { month: '02', day: '14', localName: 'วันวาเลนไทน์ 🌹' },
  { month: '04', day: '06', localName: 'วันจักรี' },
  { month: '04', day: '13', localName: 'วันสงกรานต์ 💦' },
  { month: '04', day: '14', localName: 'วันสงกรานต์ 💦' },
  { month: '04', day: '15', localName: 'วันสงกรานต์ 💦' },
  { month: '05', day: '01', localName: 'วันแรงงานแห่งชาติ' },
  { month: '05', day: '04', localName: 'วันฉัตรมงคล' },
  { month: '06', day: '03', localName: 'วันเฉลิมฯ พระราชินี' },
  { month: '07', day: '28', localName: 'วันเฉลิมฯ ร.10' },
  { month: '08', day: '12', localName: 'วันแม่แห่งชาติ 💙' },
  { month: '10', day: '13', localName: 'วันนวมินทรมหาราช' },
  { month: '10', day: '23', localName: 'วันปิยมหาราช' },
  { month: '10', day: '31', localName: 'วันฮาโลวีน 🎃' },
  { month: '12', day: '05', localName: 'วันพ่อแห่งชาติ 💛' },
  { month: '12', day: '10', localName: 'วันรัฐธรรมนูญ' },
  { month: '12', day: '25', localName: 'วันคริสต์มาส 🎄' },
  { month: '12', day: '31', localName: 'วันสิ้นปี 🎉' },
];

const LUNAR_HOLIDAYS_2025 = [
  { date: '2025-02-12', localName: 'วันมาฆบูชา 🙏' },
  { date: '2025-05-11', localName: 'วันวิสาขบูชา 🙏' },
  { date: '2025-07-10', localName: 'วันอาสาฬหบูชา 🙏' },
  { date: '2025-07-11', localName: 'วันเข้าพรรษา 🙏' },
  { date: '2025-11-06', localName: 'วันลอยกระทง 🕯️' },
];

// --- 🎨 Custom Styles (CSS ของเพื่อน) ---
const customCalendarStyles = `
  .react-calendar {
    width: 100% !important;
    border-radius: 1.5rem;
    font-family: 'Prompt', sans-serif;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  .react-calendar__tile {
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 8px !important;
  }
  .react-calendar__tile--now {
    background: #fff7ed !important;
    border: 2px solid #f77a45 !important;
    color: #c2410c !important;
    font-weight: bold;
    border-radius: 12px;
  }
  .react-calendar__tile--active {
    background: #38a89d !important;
    color: white !important;
    border-radius: 12px;
  }
  .event-dot {
    width: 6px;
    height: 6px;
    background-color: #f77a45;
    border-radius: 50%;
    margin-top: auto;
    margin-bottom: 4px;
  }
`;

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State ปฏิทิน
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [allHolidays, setAllHolidays] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/my-bookings');
      // กรองข้อมูลที่ activity ไม่เป็น null
      const validBookings = res.data.filter((b: any) => b && b.activity);
      setBookings(validBookings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // รวมวันหยุด
  const generateHolidays = (year: number) => {
    const fixed = FIXED_HOLIDAYS.map(h => ({
      date: `${year}-${h.month}-${h.day}`,
      localName: h.localName
    }));
    
    let lunar: any[] = [];
    if (year === 2025) lunar = LUNAR_HOLIDAYS_2025;

    setAllHolidays([...fixed, ...lunar]);
  };

  useEffect(() => {
    fetchBookings();
    generateHolidays(new Date().getFullYear());
  }, []);

  const handleCancel = async (activityId: string) => {
    if (!confirm('ต้องการยกเลิกการจองรายการนี้ใช่ไหมครับ? 🗑️')) return;
    try {
      await api.delete(`/activities/${activityId}/join`);
      alert('ยกเลิกเรียบร้อยครับ');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const jumpToToday = () => {
    const today = new Date();
    setDate(today);
    setActiveStartDate(today);
    generateHolidays(today.getFullYear());
  };

  // 🎨 ปรับแต่งช่องวันที่ (Logic เดิมที่ใช้งานได้)
  const getTileContent = ({ date, view }: any) => {
    if (view === 'month') {
      const content = [];
      const dateString = date.toLocaleDateString('en-CA');

      // 1. วันหยุด
      const holiday = allHolidays.find(h => h.date === dateString);
      if (holiday) {
        content.push(
          <div key="holiday" className="text-[10px] text-red-500 font-bold truncate mt-1 w-full text-center">
            {holiday.localName}
          </div>
        );
      }

      // 2. กิจกรรมที่จอง (จุดสีส้ม)
      const hasEvent = bookings.some(b => {
        if (!b?.activity?.date) return false;
        const d = new Date(b.activity.date);
        return d.toDateString() === date.toDateString();
      });
      if (hasEvent) content.push(<div key="event" className="event-dot"></div>);

      return <div className="w-full h-full flex flex-col items-center">{content}</div>;
    }
    return null;
  };

  // กรองกิจกรรมรายวัน
  const selectedDateActivities = bookings.filter(b => {
    if (!b?.activity?.date) return false;
    return new Date(b.activity.date).toDateString() === date.toDateString();
  });

  const selectedDateHoliday = allHolidays.find(h => 
    h.date === date.toLocaleDateString('en-CA')
  );

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-[#f77a45]"></span></div>;

  return (
    <>
      <style>{customCalendarStyles}</style>

      <div className="min-h-screen bg-[#fff7ed] py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          
          <h1 className="text-3xl font-bold text-center mb-8 text-[#333]">
            🎫 ตารางกิจกรรมของฉัน
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            
            {/* --- ปฏิทิน (ซ้าย) --- */}
            <div className="lg:w-2/3">
              <div className="relative">
                <div className="flex justify-end mb-2 absolute right-4 top-4 z-10">
                  <button 
                    onClick={jumpToToday} 
                    className="btn btn-xs btn-outline border-[#f77a45] text-[#f77a45] hover:bg-[#FFDAB9] rounded-full bg-white"
                  >
                    📅 วันนี้
                  </button>
                </div>

                <Calendar 
                  onChange={(value) => setDate(value as Date)} 
                  value={date}
                  activeStartDate={activeStartDate}
                  onActiveStartDateChange={({ activeStartDate }) => {
                    if(activeStartDate) {
                      setActiveStartDate(activeStartDate);
                      generateHolidays(activeStartDate.getFullYear());
                    }
                  }}
                  tileContent={getTileContent}
                  locale="th-TH"
                />
              </div>
              
              <div className="flex gap-4 mt-4 text-sm justify-center text-gray-500 font-medium">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#f77a45] rounded-full"></div> กิจกรรมที่จอง</div>
                 <div className="flex items-center gap-1"><span className="text-red-500 font-bold">ตัวแดง</span> วันหยุด</div>
              </div>
            </div>

            {/* --- รายละเอียดรายวัน (ขวา) --- */}
            <div className="lg:w-1/3">
              <div className="card bg-white shadow-lg p-6 rounded-3xl h-full border border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">
                   📅 วันที่ <span className="text-[#f77a45]">{date.toLocaleDateString('th-TH', {dateStyle: 'long'})}</span>
                </h3>

                {selectedDateHoliday ? (
                  <div className="alert bg-red-50 text-red-700 border-red-200 border mb-4 py-2 text-sm rounded-xl">
                    <span>🎉 วันนี้คือ: <b>{selectedDateHoliday.localName}</b></span>
                  </div>
                ) : (
                  <div className="alert bg-gray-50 border-gray-200 border mb-4 py-2 text-sm text-gray-500 rounded-xl">
                    <span>วันนี้ไม่มีวันหยุดราชการ</span>
                  </div>
                )}

                <h4 className="font-bold text-gray-700 mb-3 border-b border-orange-100 pb-2">
                  กิจกรรมในวันนี้:
                </h4>
                
                {selectedDateActivities.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {selectedDateActivities.map((booking) => (
                      <Link 
                        key={booking._id}
                        to={`/activities/${booking.activity._id}`} 
                        className="group block relative pl-4 bg-white hover:bg-[#FFF5EE] transition-all duration-300 rounded-xl shadow-sm border border-gray-100 p-3"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#f77a45] to-[#ffb74d] rounded-l-xl"></div>
                        <div className="flex justify-between items-center">
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-gray-800 truncate group-hover:text-[#f77a45]">{booking.activity.title}</h4>
                            <p className="text-xs text-[#38a89d] font-semibold mt-1">⏰ 10:00 - 11:30 น.</p>
                          </div>
                          <div className="btn btn-circle btn-xs bg-gray-50 border-none text-[#38a89d]">➝</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <div className="text-2xl mb-2">😴</div>
                    <p className="text-sm">ไม่มีกิจกรรมวันนี้</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="divider text-gray-400 mt-10">ประวัติการจองทั้งหมด</div>

          {/* 🎨 Style 1: Ticket Style List (แบบสวยที่เพื่อนทำมา) */}
          <div className="flex flex-col gap-4 mb-20">
              {bookings.length === 0 ? (
                 <div className="text-center py-10">
                   <h2 className="text-xl font-bold text-gray-600">คุณยังไม่มีการจองกิจกรรมครับ</h2>
                   <Link to="/" className="btn bg-[#f77a45] text-white mt-4 rounded-full px-6 shadow-md border-none hover:bg-[#d66538]">
                     ดูกิจกรรมทั้งหมด
                   </Link>
                 </div>
              ) : (
                 bookings.map((item) => {
                  const activity = item.activity;
                  if (!activity) return null;
                  const activityDate = new Date(activity.date);

                  return (
                    <div key={item._id} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden rounded-2xl group">
                      <div className="flex flex-col md:flex-row">
                        
                        {/* วันที่ (สีส้มอิฐ) */}
                        <div className="bg-[#f77a45] text-white p-4 md:w-32 flex flex-col justify-center items-center text-center">
                          <span className="text-4xl font-extrabold">{activityDate.getDate()}</span>
                          <span className="text-sm uppercase tracking-wider">
                            {activityDate.toLocaleDateString('th-TH', { month: 'short' })}
                          </span>
                          <span className="text-xs opacity-90">{activityDate.getFullYear() + 543}</span>
                        </div>

                        {/* เนื้อหา */}
                        <div className="p-5 flex-grow flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="badge badge-sm border-[#f77a45] text-[#f77a45] bg-[#FFF5EE]">
                               {activity.category || 'กิจกรรม'}
                             </span>
                             <span className="text-xs text-gray-400">
                               จองเมื่อ: {new Date(item.bookedAt).toLocaleDateString('th-TH')}
                             </span>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#d66538] transition-colors mb-2">
                            {activity.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="text-[#f77a45]">⏰</span> <span>10:00 - 11:30 น.</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[#f77a45]">📍</span> <span>{activity.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* ปุ่มกด */}
                        <div className="p-4 md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-orange-100 bg-[#FFF5EE]">
                          <Link 
                            to={`/activities/${activity._id}`} 
                            className="btn btn-sm btn-outline border-[#f77a45] text-[#f77a45] bg-white hover:bg-[#FFDAB9] w-full rounded-full"
                          >
                            ดูรายละเอียด
                          </Link>
                          <button 
                            onClick={() => handleCancel(activity._id)} 
                            className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none w-full rounded-full"
                          >
                            ยกเลิกการจอง
                          </button>
                        </div>

                      </div>
                    </div>
                  );
              }))}
          </div>

        </div>
      </div>
    </>
  );
};

export default MyBookings;
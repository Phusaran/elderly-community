import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface CommentSectionProps {
  activityId: string;
}

const CommentSection = ({ activityId }: CommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const token = localStorage.getItem('token');
  let currentUserId = '';
  let currentUserRole = '';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId = payload.id;
      currentUserRole = localStorage.getItem('role') || '';
    } catch (e) { }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/activities/${activityId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [activityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.post(`/activities/${activityId}/comments`, { text });
      setText('');
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment: any) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = async (id: string) => {
    try {
      await api.put(`/comments/${id}`, { text: editText });
      setEditingId(null);
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'แก้ไม่ได้');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันลบความคิดเห็นนี้?')) return;
    try {
      await api.delete(`/comments/${id}`);
      fetchComments();
    } catch (error) {
      alert('ลบไม่สำเร็จ');
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-gray-200 mt-8 p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        💬 ความคิดเห็น <span className="badge badge-neutral">{comments.length}</span>
      </h3>

      {token ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="แสดงความคิดเห็น..."
            className="input input-bordered w-full focus:input-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button type="submit"
            className="btn px-8 rounded-full font-semibold shadow-sm
               bg-[#FFF5EE] border border-[#f77a45] text-[#f77a45] 
               hover:bg-[#FFDAB9] hover:border-[#d66538]"
            disabled={loading}
          >
            ส่ง 🚀
          </button>
        </form>
      ) : (
        <div className="alert bg-gray-50 mb-6 text-sm">
          <span>🔒 <Link to="/login" className="link link-primary font-bold">เข้าสู่ระบบ</Link> เพื่อแสดงความคิดเห็น</span>
        </div>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {comments.map((c) => {
          const isOwner = c.user?._id === currentUserId;
          const isAdmin = currentUserRole === 'admin';

          return (
            <div key={c._id} className={`chat ${isOwner ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-header text-xs text-gray-500 mb-1 flex items-center gap-2">
                <span className="font-bold text-gray-700">{c.user?.username || 'สมาชิก'}</span>
                <time className="opacity-50">{new Date(c.createdAt).toLocaleDateString('th-TH')}</time>
              </div>

              {c.isDeleted ? (
                <div className="chat-bubble bg-gray-100 text-gray-400 italic border border-gray-200">
                  ข้อความนี้ถูกลบแล้ว
                </div>
              ) : (
                <div className="chat-bubble bg-gray-100 text-gray-800 shadow-sm relative group min-w-[120px]">

                  {editingId === c._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="input input-sm input-bordered text-black"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => setEditingId(null)} className="btn btn-xs btn-ghost text-black">ยกเลิก</button>
                        <button onClick={() => saveEdit(c._id)} className="btn btn-xs btn-success text-white">บันทึก</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      {/* เนื้อหาคอมเมนต์ */}
                      <span className="text-left w-full">{c.text}</span>

                      {/* ✅ โชว์ว่าแก้ไขแล้ว */}
                      {c.isEdited && (
                        <span className="text-[10px] text-gray-400 mt-1 italic self-end">
                          (แก้ไขแล้ว)
                        </span>
                      )}

                      {/* ปุ่มจัดการ */}
                      {(isOwner || isAdmin) && (
                        <div className="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-full shadow-md p-1 z-10">
                          {isOwner && (
                            <button onClick={() => startEdit(c)} className="btn btn-circle btn-xs btn-ghost text-warning" title="แก้ไข">
                              ✏️
                            </button>
                          )}
                          <button onClick={() => handleDelete(c._id)} className="btn btn-circle btn-xs btn-ghost text-error" title="ลบ">
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
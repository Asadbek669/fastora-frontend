import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetAllComments,
  adminDeleteComment,
  adminReplyComment,
} from "../services/movieService";

export default function AdminComments() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await adminGetAllComments();
      setComments(data);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Kommentlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;

    try {
      await adminDeleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      setError("O'chirishda xatolik");
    }
  }

  function openReply(comment) {
    setActiveId(comment.id);
    setReplyText(comment.admin_reply || "");
  }

  async function handleSaveReply() {
    if (!replyText.trim()) return;

    try {
      const updated = await adminReplyComment(activeId, replyText.trim());
      setComments((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setActiveId(null);
      setReplyText("");
    } catch (e) {
      console.error(e);
      setError("Javobni saqlashda xatolik");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Admin • Kommentlar</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded-lg bg-slate-800 text-sm hover:bg-slate-700"
          >
            Ortga
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-600/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-slate-400 mt-10">Yuklanmoqda...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-slate-400 mt-10">
            Hozircha kommentlar yo‘q
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3"
              >
                {/* User + actions */}
                <div className="flex justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{c.user}</div>
                    <div className="text-xs text-slate-400">
                      #{c.id} • Movie ID: {c.movie_id} •{" "}
                      {c.created_at &&
                        new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openReply(c)}
                      className="px-2 py-1 text-xs rounded-lg bg-emerald-700 hover:bg-emerald-600"
                    >
                      Javob berish
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-2 py-1 text-xs rounded-lg bg-red-700 hover:bg-red-600"
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>

                {/* original comment */}
                <p className="mt-2 text-sm">{c.text}</p>

                {/* ADMINNING AVVALGI JAVOBI */}
                {c.admin_reply && (
                  <div className="mt-3 flex gap-2 items-start border-t border-slate-800 pt-2">
                    {/* ✅ Avatar: public/icon.svg */}
                    <img
                      src="/icon.svg"
                      alt="Admin"
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs font-semibold text-emerald-400">
                        Admin javobi
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.admin_replied_at &&
                          new Date(c.admin_replied_at).toLocaleString()}
                      </div>
                      <p className="mt-1 text-sm">{c.admin_reply}</p>
                    </div>
                  </div>
                )}

                {/* Reply editor */}
                {activeId === c.id && (
                  <div className="mt-3 border-t border-slate-800 pt-2">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Admin javobi..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg text-sm px-2 py-1 outline-none focus:border-emerald-500"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setActiveId(null);
                          setReplyText("");
                        }}
                        className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={handleSaveReply}
                        className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500"
                      >
                        Saqlash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

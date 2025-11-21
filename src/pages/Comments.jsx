import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComments, sendComment } from "../services/movieService";

export default function Comments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scrollRef = useRef(null);

  // 🔥 MOBILE KEYBOARD DETECT
  useEffect(() => {
    const handleFocus = () => setKeyboardOpen(true);
    const handleBlur = () => setKeyboardOpen(false);

    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleBlur);

    return () => {
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleBlur);
    };
  }, []);

  // 🔥 LOAD COMMENTS (1 MARTA)
  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    const data = await getComments(id);

    // NEWEST FIRST
    const sorted = [...data].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setComments(sorted);

    // Scroll top
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  }

  // 🔥 SEND COMMENT (ORTIQCHA API YO‘Q!!!)
  async function handleSend() {
    if (!text.trim() || sending) return;

    setSending(true);

    // Only 1 API so‘rov: 100% optimal
    const newComment = await sendComment(id, "Foydalanuvchi", text);
    setText("");

    // ❗ BU YER — MUHIM
    // API-ni qayta chaqirmaymiz, yangi commentni o‘zimiz qo‘shamiz
    setComments(prev => [newComment, ...prev]);

    setSending(false);

    // Scroll to top
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 bg-[#151515] flex items-center gap-4 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl hover:scale-110 transition"
        >
          ←
        </button>
        <h2 className="text-xl font-bold">Izohlar</h2>
      </div>

      {/* COMMENTS LIST */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 pb-24 space-y-3"
      >
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-2 rounded-lg bg-[#1a1a1a] border border-white/10 shadow-md"
          >
            <div className="flex items-center gap-2 mb-1">

              <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center font-bold">
                {c.user[0].toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold">{c.user}</div>
                <div className="text-[10px] text-gray-400">
                  {new Date(c.created_at).toLocaleString("uz-UZ")}
                </div>
              </div>
            </div>

            <p className="text-gray-200 text-sm">{c.text}</p>
          </div>
        ))}
      </div>

      {/* FIXED INPUT */}
      <div
        className="
          fixed left-0 w-full
          p-3 bg-[#141414]/90 backdrop-blur-lg 
          border-t border-white/10 flex gap-2
          transition-all duration-300
        "
        style={{
          bottom: keyboardOpen ? "300px" : "56px"
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="
            flex-1 px-3 py-2 rounded-lg bg-[#222] text-white outline-none
            border border-white/10 focus:border-red-600 transition text-sm
          "
          placeholder="Izoh yozing..."
        />

        <button
          disabled={sending}
          onClick={handleSend}
          className="
            px-4 rounded-lg bg-red-600 hover:bg-red-700 
            active:scale-95 transition font-semibold text-sm
            disabled:bg-gray-600
          "
        >
          {sending ? "..." : "Yuborish"}
        </button>
      </div>
    </div>
  );
}

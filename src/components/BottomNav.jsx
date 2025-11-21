import { Link } from "react-router-dom";
import HomeIcon from "../assets/house.svg";
import DonateIcon from "../assets/hand-heart.svg";
import SearchIcon from "../assets/search.svg";

export default function BottomNav() {
  return (
    <div
      className="
        fixed bottom-0 left-0 w-full 
        text-white 
        py-2 flex justify-around
        backdrop-blur-xl
        bg-gradient-to-r from-[#ffffff0a] via-[#ffffff15] to-[#ffffff0a]
        border-t border-white/10
      "
    >
      {/* HOME */}
      <Link to="/" className="flex flex-col items-center active:scale-95">
        <img src={HomeIcon} className="w-6 h-6" alt="home" />
        <div className="text-xs">Asosiy</div>
      </Link>

      {/* DONATE */}
      <a
        href="https://tirikchilik.uz/kino_olami"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center active:scale-95"
      >
        <img src={DonateIcon} className="w-6 h-6" alt="donate" />
        <div className="text-xs">Donate</div>
      </a>

      {/* SEARCH */}
      <Link to="/search" className="flex flex-col items-center active:scale-95">
        <img src={SearchIcon} className="w-6 h-6" alt="search" />
        <div className="text-xs">Qidiruv</div>
      </Link>
    </div>
  );
}

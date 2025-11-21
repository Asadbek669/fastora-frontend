import Logo from "../assets/fastora-logo.png";

export default function TopBar() {
  return (
    <div
      className="
        w-full 
        h-[60px] 
        flex justify-center items-center 
        shadow-md 
        overflow-hidden
        bg-gradient-to-b from-[#2a2a2a] to-[#000000]
      "
    >
      <img
        src={Logo}
        alt="FASTORA Logo"
        className="h-[120px] object-contain"
      />
    </div>
  );
}

import logo from "../assets/logo.png";

export default function AppLogo({
  className = "",
  iconClass = "h-9 w-auto",
  textClass = "text-xl font-bold text-white",
  showText = true,
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="WareHub" className={`${iconClass} object-contain`} />
      {showText && <span className={textClass}>WareHub</span>}
    </div>
  );
}

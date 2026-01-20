import logo from "../assets/logo.png";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
      {/* Background Decor (Optional - adds depth) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* LOGO CONTAINER */}
        <div className="relative group">
          {/* Multi-layered Rings */}
          <div className="absolute -inset-6 rounded-full border-[3px] border-blue-100/50 scale-110" />
          <div className="absolute -inset-6 rounded-full border-t-[3px] border-blue-600 animate-spin [animation-duration:1.5s]" />
          <div className="absolute -inset-10 rounded-full border-b-[2px] border-indigo-400 opacity-30 animate-spin [animation-direction:reverse] [animation-duration:3s]" />

          {/* Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-blue-400 blur-2xl opacity-20 animate-pulse" />

          {/* Logo with Shimmer Effect */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center p-3 overflow-hidden">
            <img
              src={logo}
              alt="Smart Campus"
              className="w-full h-full object-contain"
            />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>

        {/* TEXT SECTION */}
        <div className="mt-12 text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center justify-center gap-1">
            Smart
            <span className="text-blue-600">Campus</span>
          </h2>
       
        </div>
      </div>
    </div>
  );
}
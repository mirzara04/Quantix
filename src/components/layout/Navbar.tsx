import { Target, User } from 'lucide-react';

interface NavbarProps {
  onOpenProfile?: () => void;
}

export default function Navbar({ onOpenProfile }: NavbarProps) {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#000000]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-600" />
        <h1 className="font-semibold tracking-tight text-white">Opportunity Radar</h1>
      </div>
      
      {onOpenProfile && (
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-xs font-medium text-white/80 pr-1">Profile</span>
        </button>
      )}
    </header>
  );
}

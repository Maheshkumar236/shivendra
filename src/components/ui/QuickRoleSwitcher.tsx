import React, { useState } from 'react';
import { User, Shield, Sparkles, ChevronDown, Check } from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '../../services/storage';
import { SEED_USERS } from '../../data/seedData';
import { useToast } from './Toast';

interface QuickRoleSwitcherProps {
  onNavigate?: (path: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = getCurrentUser();
  const { toast } = useToast();

  const handleSelect = (user: typeof SEED_USERS[0] | null) => {
    setCurrentUser(user);
    setIsOpen(false);
    if (!user) {
      toast({
        title: 'Switched to Guest Mode',
        message: 'Viewing Lumière Events as a public visitor',
      });
      if (onNavigate) onNavigate('home');
    } else if (user.role === 'ADMIN') {
      toast({
        title: 'Logged in as Admin (Éléonore Vance)',
        message: 'Full access to Admin Panel, inquiries, and booking approvals',
      });
      if (onNavigate) onNavigate('admin');
    } else {
      toast({
        title: `Logged in as Client (${user.name})`,
        message: 'Full access to your Client Portal, milestones, and documents',
      });
      if (onNavigate) onNavigate('portal');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[#C9A227]/40 bg-[#1C1B1A]/80 hover:bg-[#1C1B1A] text-[#FAF7F2] backdrop-blur-md transition-all shadow-sm"
        aria-label="Switch demo persona"
      >
        <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse"></span>
        <span className="font-serif tracking-wider text-neutral-300">ROLE:</span>
        <span className="text-[#C9A227] font-semibold">
          {currentUser ? (currentUser.role === 'ADMIN' ? 'Admin (Éléonore)' : currentUser.name.split(' ')[0]) : 'Guest'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-neutral-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#1C1B1A] border border-[#C9A227]/30 shadow-2xl p-2 z-50 text-[#FAF7F2] text-xs">
            <div className="px-3 py-2 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Quick Persona Switcher (Demo)
            </div>

            <div className="py-1 flex flex-col gap-1">
              {/* Client 1: Clara */}
              <button
                onClick={() => handleSelect(SEED_USERS[1])}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                  currentUser?.email === SEED_USERS[1].email
                    ? 'bg-[#C9A227]/15 text-[#C9A227] font-semibold'
                    : 'hover:bg-neutral-800 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-700 shrink-0">
                    <img src={SEED_USERS[1].avatar} alt={SEED_USERS[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs">{SEED_USERS[1].name}</div>
                    <div className="text-[10px] text-neutral-400">Client • French Riviera Nuptials</div>
                  </div>
                </div>
                {currentUser?.email === SEED_USERS[1].email && <Check className="w-4 h-4 text-[#C9A227]" />}
              </button>

              {/* Admin: Éléonore */}
              <button
                onClick={() => handleSelect(SEED_USERS[0])}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-[#C9A227]/15 text-[#C9A227] font-semibold'
                    : 'hover:bg-neutral-800 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
                  </div>
                  <div>
                    <div className="text-xs">{SEED_USERS[0].name}</div>
                    <div className="text-[10px] text-neutral-400">Director & Master Producer (Admin)</div>
                  </div>
                </div>
                {currentUser?.role === 'ADMIN' && <Check className="w-4 h-4 text-[#C9A227]" />}
              </button>

              {/* Guest */}
              <button
                onClick={() => handleSelect(null)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                  !currentUser
                    ? 'bg-[#C9A227]/15 text-[#C9A227] font-semibold'
                    : 'hover:bg-neutral-800 text-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-xs">Visitor / Guest</div>
                    <div className="text-[10px] text-neutral-400">Unauthenticated Public View</div>
                  </div>
                </div>
                {!currentUser && <Check className="w-4 h-4 text-[#C9A227]" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

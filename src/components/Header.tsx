import React from 'react';
import { Cpu, Shield, Cog } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-display">
                Конструктор заготовки
              </h1>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                Листове штампування
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Захисний ковпак мотора квадрокоптера · Холодне витягування стакана без фланця
            </p>
          </div>
        </div>

        {/* Tech Badges */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end text-xs font-mono">
          <div className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Алюміній листовий</span>
          </div>
          <div className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-lg border border-sky-200 flex items-center gap-1.5">
            <Cog className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>3D САПР / Розрахунок</span>
          </div>
        </div>
      </div>
    </header>
  );
};

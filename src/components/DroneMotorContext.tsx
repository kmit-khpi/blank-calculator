import React from 'react';
import { ShieldCheck, Wind, Zap, Layers } from 'lucide-react';

export const DroneMotorContext: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
          Інженерний контекст: Захисний ковпак мотора квадрокоптера
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Захист від бруду й пилу</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Захищає неодимові магніти ротора та прецизійні підшипники від потрапляння абразивного піску, трави й вологи при польотах і посадках на ґрунт.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Wind className="w-4 h-4 text-sky-600" />
            <span>Тепловідвід та маса</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Алюміній (густина 2,7 г/см³) забезпечує мінімальну вагу ковпака (всього 1–5 г) та високу теплопровідність для розсіювання тепла від обмоток статора.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Холодне витягування</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Виготовлення штампуванням з круглого диска забезпечує високу міцність за рахунок наклепу металу, точну геометрію та мінімальні відходи матеріалу.
          </p>
        </div>
      </div>
    </div>
  );
};

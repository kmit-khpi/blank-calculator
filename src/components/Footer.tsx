import React from 'react';
import { Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 bg-white border-t border-slate-200/90 text-slate-600">
      {/* Required Engineering Note Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 shadow-xs">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block sm:inline mr-1">
              Примітка:
            </span>
            Спрощений навчальний розрахунок. Для реального виробництва враховують радіуси заокруглення, припуск на обрізку та зміну товщини стінки; точніше процес моделюють, наприклад, у QForm.
          </div>
        </div>

        {/* Required Footer Line */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="text-center sm:text-left">
            Згенеровано в Google AI Studio · приклад ШІ-напряму спільноти кафедри КМІТ НТУ «ХПІ»
          </div>
          <div className="text-slate-400 text-[11px]">
            Інженерний навчальний тренажер · Безпечний клієнтський розрахунок
          </div>
        </div>
      </div>
    </footer>
  );
};

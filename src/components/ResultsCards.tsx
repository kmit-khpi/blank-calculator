import React from 'react';
import { CalculationResults } from '../types';
import { CircleDot, Disc, Scale, Gauge, Info, AlertTriangle } from 'lucide-react';

interface ResultsCardsProps {
  results: CalculationResults;
}

export const ResultsCards: React.FC<ResultsCardsProps> = ({ results }) => {
  const { formatted, isMultiStageRecommended, m } = results;

  return (
    <div className="flex flex-col gap-4">
      {/* 4 Key Output Engineering KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: D0 (Діаметр плоскої заготовки) */}
        <div className="p-4 rounded-2xl bg-white border border-sky-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-sky-400 transition-colors">
          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-50 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Діаметр заготовки
            </span>
            <Disc className="w-4 h-4 text-sky-600" />
          </div>

          <div className="my-2 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 font-mono tracking-tight">
                {formatted.D0}
              </span>
              <span className="text-sm font-semibold text-sky-600/70 font-mono">мм</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              D₀ = √(d² + 4·d·h)
            </div>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Площа А:</span>
            <span className="font-mono font-bold text-slate-800">{formatted.A} мм²</span>
          </div>
        </div>

        {/* Card 2: m (Коефіцієнт витягування) */}
        <div
          className={`p-4 rounded-2xl bg-white border shadow-xs flex flex-col justify-between relative overflow-hidden group transition-colors ${
            isMultiStageRecommended
              ? 'border-amber-300 hover:border-amber-400 ring-1 ring-amber-200'
              : 'border-emerald-200/80 hover:border-emerald-400'
          }`}
        >
          <div
            className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110 ${
              isMultiStageRecommended ? 'bg-amber-50' : 'bg-emerald-50'
            }`}
          />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Коефіцієнт витяжки
            </span>
            <Gauge
              className={`w-4 h-4 ${
                isMultiStageRecommended ? 'text-amber-600' : 'text-emerald-600'
              }`}
            />
          </div>

          <div className="my-2 relative z-10">
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                  isMultiStageRecommended ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {formatted.m}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              m = d / D₀
            </div>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Поріг m ≥ 0,55:</span>
            <span
              className={`font-mono font-bold ${
                isMultiStageRecommended ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {isMultiStageRecommended ? '< 0,55' : 'm ≥ 0,55'}
            </span>
          </div>
        </div>

        {/* Card 3: d (Середній діаметр стакана) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-slate-400 transition-colors">
          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Середній діаметр
            </span>
            <CircleDot className="w-4 h-4 text-slate-600" />
          </div>

          <div className="my-2 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono tracking-tight">
                {formatted.d}
              </span>
              <span className="text-sm font-semibold text-slate-400 font-mono">мм</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              d = dз − s
            </div>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Нейтральний шар:</span>
            <span className="font-mono font-semibold text-slate-700">{formatted.dz} - {formatted.s}</span>
          </div>
        </div>

        {/* Card 4: Маса заготовки */}
        <div className="p-4 rounded-2xl bg-white border border-orange-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-orange-400 transition-colors">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Маса заготовки
            </span>
            <Scale className="w-4 h-4 text-orange-600" />
          </div>

          <div className="my-2 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-700 font-mono tracking-tight">
                {formatted.mass}
              </span>
              <span className="text-sm font-semibold text-orange-600/70 font-mono">г</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              M = A · s · 0.0027
            </div>
          </div>

          <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Алюміній (ρ):</span>
            <span className="font-mono font-bold text-slate-800">2.7 г/см³</span>
          </div>
        </div>
      </div>

      {/* Нейтральна підказка, якщо m < 0.55 */}
      {isMultiStageRecommended && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 shadow-xs flex items-start gap-3 transition-all animate-fadeIn">
          <div className="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <span className="font-bold text-amber-950 font-mono">
              Увага до технологічного процесу (m = {formatted.m} &lt; 0.55):
            </span>
            <p className="leading-relaxed text-amber-900">
              Коефіцієнт витягування малий — може знадобитися кілька переходів витягування. Граничні значення залежать від матеріалу та відносної товщини — перевірте за довідником.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

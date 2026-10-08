import React from 'react';
import { CupParameters } from '../types';
import { Sliders, RotateCcw } from 'lucide-react';

interface InputPanelProps {
  params: CupParameters;
  onChange: (newParams: CupParameters) => void;
  onReset: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  params,
  onChange,
  onReset,
}) => {
  const { dz, h, s } = params;

  const handleDzChange = (val: number) => {
    const clamped = Math.max(20, Math.min(60, val));
    onChange({ ...params, dz: Number(clamped.toFixed(1)) });
  };

  const handleHChange = (val: number) => {
    const clamped = Math.max(5, Math.min(40, val));
    onChange({ ...params, h: Number(clamped.toFixed(1)) });
  };

  const handleSChange = (val: number) => {
    const clamped = Math.max(0.3, Math.min(1.5, val));
    onChange({ ...params, s: Number(clamped.toFixed(2)) });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col gap-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">
              Параметри ковпака (Вхідні дані)
            </h2>
            <p className="text-xs text-slate-500">
              Повзунки та числові поля введення з миттєвою синхронізацією
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Скинути параметри до стандартних (28 / 12 / 0.5)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Скинути</span>
        </button>
      </div>

      {/* Input 1: dz (Зовнішній діаметр стакана) */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 transition-all hover:border-rose-200">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-rose-600 text-sm">dз</span>
            <label htmlFor="input-dz" className="text-xs font-semibold text-slate-700">
              Зовнішній діаметр стакана
            </label>
            <span className="text-[11px] text-slate-400 font-mono">(20 – 60 мм)</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              id="input-dz"
              type="number"
              min={20}
              max={60}
              step={0.5}
              value={dz}
              onChange={(e) => handleDzChange(parseFloat(e.target.value) || 20)}
              className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
            <span className="text-xs text-slate-500 font-mono">мм</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">20</span>
          <input
            type="range"
            min={20}
            max={60}
            step={0.5}
            value={dz}
            onChange={(e) => handleDzChange(parseFloat(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <span className="text-[10px] font-mono text-slate-400">60</span>
        </div>
      </div>

      {/* Input 2: h (Висота стакана) */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 transition-all hover:border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-amber-600 text-sm">h</span>
            <label htmlFor="input-h" className="text-xs font-semibold text-slate-700">
              Висота стакана
            </label>
            <span className="text-[11px] text-slate-400 font-mono">(5 – 40 мм)</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              id="input-h"
              type="number"
              min={5}
              max={40}
              step={0.5}
              value={h}
              onChange={(e) => handleHChange(parseFloat(e.target.value) || 5)}
              className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
            <span className="text-xs text-slate-500 font-mono">мм</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">5</span>
          <input
            type="range"
            min={5}
            max={40}
            step={0.5}
            value={h}
            onChange={(e) => handleHChange(parseFloat(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <span className="text-[10px] font-mono text-slate-400">40</span>
        </div>
      </div>

      {/* Input 3: s (Товщина листа) */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 transition-all hover:border-sky-200">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-sky-600 text-sm">s</span>
            <label htmlFor="input-s" className="text-xs font-semibold text-slate-700">
              Товщина листа
            </label>
            <span className="text-[11px] text-slate-400 font-mono">(0.3 – 1.5 мм)</span>
          </div>

          <div className="flex items-center gap-1">
            <input
              id="input-s"
              type="number"
              min={0.3}
              max={1.5}
              step={0.05}
              value={s}
              onChange={(e) => handleSChange(parseFloat(e.target.value) || 0.3)}
              className="w-20 px-2 py-1 text-right font-mono font-bold text-slate-900 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            />
            <span className="text-xs text-slate-500 font-mono">мм</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400">0.3</span>
          <input
            type="range"
            min={0.3}
            max={1.5}
            step={0.05}
            value={s}
            onChange={(e) => handleSChange(parseFloat(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
          />
          <span className="text-[10px] font-mono text-slate-400">1.5</span>
        </div>
      </div>
    </div>
  );
};

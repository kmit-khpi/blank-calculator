import React, { useState } from 'react';
import { CupParameters, CalculationResults } from '../types';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';

interface HowItCalculatesProps {
  params: CupParameters;
  results: CalculationResults;
}

export const HowItCalculates: React.FC<HowItCalculatesProps> = ({ params, results }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { dz, h, s } = params;
  const { d, D0, m, A, mass, formatted } = results;

  // Intermediate values for clear display
  const dSquared = (d * d).toFixed(2);
  const fourDH = (4 * d * h).toFixed(2);
  const sumInsideSqrt = (d * d + 4 * d * h).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header with toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-left border-b border-slate-200/80"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-display">
              Як це рахується (Теорія та підстановка чисел)
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Покроковий інженерний вивід за законом рівності поверхонь
            </p>
          </div>
        </div>

        <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Educational Content */}
      {isOpen && (
        <div className="p-5 sm:p-6 flex flex-col gap-6">
          {/* Step 1: d = dz - s */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-200/70">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-mono font-bold text-xs shrink-0">
              1
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-800">
                  Середній діаметр стакана (нейтральний шар)
                </h4>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  d = dз − s
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                При згинанні та витягуванні зовнішні волокна металу розтягуються, а внутрішні стискаються. Розрахункові розміри визначаються по середньому (нейтральному) шару матеріалу.
              </p>
              <div className="mt-2 p-2.5 rounded-lg bg-white border border-slate-200/90 font-mono text-xs text-slate-800 flex items-center justify-between overflow-x-auto">
                <span className="text-slate-500">Підстановка:</span>
                <span className="font-bold text-slate-900">
                  d = {formatted.dz} − {formatted.s} = <span className="text-rose-600">{formatted.d} мм</span>
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: D0 = sqrt(d² + 4·d·h) */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-sky-50/40 border border-sky-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-600 text-white font-mono font-bold text-xs shrink-0">
              2
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-800">
                  Діаметр плоскої заготовки (з рівності площ поверхонь)
                </h4>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-sky-200 text-sky-800">
                  D₀ = √(d² + 4·d·h)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Оскільки пластична деформація відбувається без істотної зміни об’єму і товщини листа, площа поверхні готового ковпака (дно + стінка) дорівнює площі плоскої заготовки:
              </p>
              <div className="text-[11px] font-mono text-slate-500 bg-white/70 p-2 rounded border border-sky-100">
                A = A<sub>дна</sub> + A<sub>стінки</sub> = (π·d²/4) + (π·d·h) = (π/4)·(d² + 4·d·h) = π·D₀²/4
              </div>
              <div className="mt-2 p-2.5 rounded-lg bg-white border border-sky-200 font-mono text-xs text-slate-800 flex flex-col gap-1 overflow-x-auto">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Підстановка:</span>
                  <span>
                    D₀ = √({formatted.d}² + 4 · {formatted.d} · {formatted.h})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 border-t border-slate-100 pt-1">
                  <span className="text-slate-400">Підкореневий вираз:</span>
                  <span>
                    √({dSquared} + {fourDH}) = √{sumInsideSqrt} ≈ <span className="font-bold text-sky-700">{formatted.D0} мм</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: m = d / D0 */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-amber-50/40 border border-amber-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-mono font-bold text-xs shrink-0">
              3
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-800">
                  Коефіцієнт витягування
                </h4>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800">
                  m = d / D₀
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Характеризує ступінь пластичної деформації при переході від плоскої круглої пластини до циліндричної форми. Чим менше число, тим глибша витяжка і вища ймовірність розриву металу.
              </p>
              <div className="mt-2 p-2.5 rounded-lg bg-white border border-amber-200 font-mono text-xs text-slate-800 flex items-center justify-between overflow-x-auto">
                <span className="text-slate-500">Підстановка:</span>
                <span className="font-bold text-slate-900">
                  m = {formatted.d} / {formatted.D0} = <span className="text-amber-700">{formatted.m}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Step 4: A = pi * D0^2 / 4 and mass = A * s * 0.0027 */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-orange-50/40 border border-orange-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white font-mono font-bold text-xs shrink-0">
              4
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-800">
                  Площа та маса алюмінієвої заготовки
                </h4>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-orange-200 text-orange-800">
                  A = π·D₀²/4 · Маса = A·s·0.0027
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Густина технічного алюмінію становить 2,7 г/см³ (0,0027 г/мм³). Об’єм листа дорівнює добутку площі на товщину (V = A · s мм³).
              </p>
              <div className="mt-2 p-2.5 rounded-lg bg-white border border-orange-200 font-mono text-xs text-slate-800 flex flex-col gap-1.5 overflow-x-auto">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Площа заготовки:</span>
                  <span>
                    A = (π · {formatted.D0}²) / 4 = <span className="font-bold text-slate-900">{formatted.A} мм²</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="text-slate-500">Маса в грамах:</span>
                  <span>
                    M = {formatted.A} · {formatted.s} · 0.0027 = <span className="font-bold text-orange-700">{formatted.mass} г</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

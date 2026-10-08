import { CupParameters, CalculationResults } from '../types';

/**
 * Розрахунок заготовки за строгими формулами користувача:
 * d = dz - s
 * D0 = sqrt(d^2 + 4 * d * h)
 * m = d / D0
 * A = (pi * D0^2) / 4
 * маса = A * s * 0.0027 (алюміній, 2.7 г/см³)
 */
export function calculateBlank(params: CupParameters): CalculationResults {
  const { dz, h, s } = params;

  // 1. Середній діаметр стакана
  const d = dz - s;

  // 2. Діаметр плоскої заготовки з рівності площ поверхонь
  const dSquared = d * d;
  const fourDH = 4 * d * h;
  const D0 = Math.sqrt(dSquared + fourDH);

  // 3. Коефіцієнт витягування
  const m = d / D0;

  // 4. Площа заготовки (мм²)
  const A = (Math.PI * (D0 * D0)) / 4;

  // 5. Маса заготовки в грамах (алюміній, 2.7 г/см³ = 0.0027 г/мм³)
  const mass = A * s * 0.0027;

  // Перевірка умови: якщо m < 0.55
  const isMultiStageRecommended = m < 0.55;

  return {
    d,
    D0,
    m,
    A,
    mass,
    formatted: {
      dz: dz.toFixed(1),
      h: h.toFixed(1),
      s: s.toFixed(2),
      d: d.toFixed(1),
      D0: D0.toFixed(1),
      m: m.toFixed(2),
      A: A.toFixed(1),
      mass: mass.toFixed(2),
    },
    isMultiStageRecommended,
  };
}


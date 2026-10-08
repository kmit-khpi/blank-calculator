export interface CupParameters {
  /** Зовнішній діаметр стакана dз, мм (20 - 60) */
  dz: number;
  /** Висота стакана h, мм (5 - 40) */
  h: number;
  /** Товщина листа s, мм (0.3 - 1.5) */
  s: number;
}

export interface CalculationResults {
  /** Середній діаметр d = dз - s, мм */
  d: number;
  /** Діаметр плоскої заготовки D0 = sqrt(d² + 4·d·h), мм */
  D0: number;
  /** Коефіцієнт витягування m = d / D0 */
  m: number;
  /** Площа заготовки A = π·D0² / 4, мм² */
  A: number;
  /** Маса заготовки в грамах = A · s · 0.0027 */
  mass: number;
  /** Форматовані значення */
  formatted: {
    dz: string;
    h: string;
    s: string;
    d: string;
    D0: string;
    m: string;
    A: string;
    mass: string;
  };
  /** Чи потрібна нейтральна підказка про малий коефіцієнт (m < 0.55) */
  isMultiStageRecommended: boolean;
}

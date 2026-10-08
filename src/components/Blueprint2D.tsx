import React from 'react';
import { CupParameters, CalculationResults } from '../types';

interface Blueprint2DProps {
  params: CupParameters;
  results: CalculationResults;
}

export const Blueprint2D: React.FC<Blueprint2DProps> = ({ params, results }) => {
  const { dz, h, s } = params;
  const { d, D0, formatted } = results;

  // Coordinate scales for drawing to fit nicely inside SVG viewport
  // Max D0 is around ~75mm, max h is 40mm.
  // SVG viewport 600 x 260
  const scale = 2.4; // 1mm = 2.4px

  // Blank circle center
  const blankCx = 140;
  const blankCy = 130;
  const blankR = (D0 / 2) * scale;

  // Cup section center
  const cupCx = 420;
  const cupBaseY = 190;
  const cupH_px = h * scale;
  const cupRo_px = (dz / 2) * scale;
  const cupRi_px = Math.max(1, ((dz - 2 * s) / 2) * scale);
  const cupS_px = Math.max(1.5, s * scale);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-sky-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
            Інженерне 2D-креслення (Схема витяжки)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="hidden sm:inline">ДСТУ ГОСТ 2.305</span>
          <span className="px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded text-[11px] font-medium">
            Масштаб М 1:{ (1 / (scale / 2.5)).toFixed(1) }
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-50/50 blueprint-grid p-2">
        <svg
          viewBox="0 0 600 250"
          className="w-full min-w-[500px] h-[240px] text-slate-800"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <defs>
            {/* Pattern for 45 deg engineering metal hatching */}
            <pattern
              id="hatchPattern"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.45" />
            </pattern>
            {/* Dimension Arrow Marker */}
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#0369a1" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#d97706" />
            </marker>
            <marker id="arrow-rose" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#e11d48" />
            </marker>
          </defs>

          {/* -------------------- 1. VIEW: FLAT BLANK (LEFT) -------------------- */}
          <g id="blank-view">
            {/* Centerline Cross */}
            <line
              x1={blankCx - blankR - 15}
              y1={blankCy}
              x2={blankCx + blankR + 15}
              y2={blankCy}
              stroke="#64748b"
              strokeWidth="0.8"
              strokeDasharray="14 3 2 3"
            />
            <line
              x1={blankCx}
              y1={blankCy - blankR - 15}
              x2={blankCx}
              y2={blankCy + blankR + 15}
              stroke="#64748b"
              strokeWidth="0.8"
              strokeDasharray="14 3 2 3"
            />

            {/* Circular Blank Contour */}
            <circle
              cx={blankCx}
              cy={blankCy}
              r={blankR}
              fill="#f1f5f9"
              stroke="#0f172a"
              strokeWidth="1.8"
            />

            {/* Inscribed diameter dimension line D0 */}
            <line
              x1={blankCx - blankR}
              y1={blankCy}
              x2={blankCx + blankR}
              y2={blankCy}
              stroke="#0369a1"
              strokeWidth="1.2"
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
            />
            {/* Dimension Text D0 */}
            <rect
              x={blankCx - 42}
              y={blankCy - 22}
              width="84"
              height="18"
              fill="#ffffff"
              rx="3"
              stroke="#bae6fd"
              strokeWidth="0.8"
            />
            <text
              x={blankCx}
              y={blankCy - 9}
              textAnchor="middle"
              className="text-[12px] font-mono font-bold fill-sky-800"
            >
              Ø D₀ = {formatted.D0}
            </text>

            {/* Blank Label */}
            <text x={blankCx} y={235} textAnchor="middle" className="text-[11px] font-mono fill-slate-500 font-semibold">
              Плоска заготовка (лист s = {formatted.s} мм)
            </text>
          </g>

          {/* -------------------- 2. VIEW: CUP SECTION (RIGHT) -------------------- */}
          <g id="cup-view">
            {/* Centerline of the cup */}
            <line
              x1={cupCx}
              y1={cupBaseY - cupH_px - 22}
              x2={cupCx}
              y2={cupBaseY + 18}
              stroke="#64748b"
              strokeWidth="0.8"
              strokeDasharray="14 3 2 3"
            />

            {/* Left Wall Hatched Section */}
            <path
              d={`
                M ${cupCx - cupRo_px} ${cupBaseY}
                L ${cupCx - cupRo_px} ${cupBaseY - cupH_px}
                L ${cupCx - cupRi_px} ${cupBaseY - cupH_px}
                L ${cupCx - cupRi_px} ${cupBaseY - cupS_px}
                L ${cupCx} ${cupBaseY - cupS_px}
                L ${cupCx} ${cupBaseY}
                Z
              `}
              fill="url(#hatchPattern)"
              stroke="#0f172a"
              strokeWidth="1.8"
            />

            {/* Right Wall Hatched Section */}
            <path
              d={`
                M ${cupCx + cupRo_px} ${cupBaseY}
                L ${cupCx + cupRo_px} ${cupBaseY - cupH_px}
                L ${cupCx + cupRi_px} ${cupBaseY - cupH_px}
                L ${cupCx + cupRi_px} ${cupBaseY - cupS_px}
                L ${cupCx} ${cupBaseY - cupS_px}
                L ${cupCx} ${cupBaseY}
                Z
              `}
              fill="url(#hatchPattern)"
              stroke="#0f172a"
              strokeWidth="1.8"
            />

            {/* Neutral fiber line (середній діаметр d) - dashed orange */}
            <line
              x1={cupCx - (d / 2) * scale}
              y1={cupBaseY}
              x2={cupCx - (d / 2) * scale}
              y2={cupBaseY - cupH_px}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1={cupCx + (d / 2) * scale}
              y1={cupBaseY}
              x2={cupCx + (d / 2) * scale}
              y2={cupBaseY - cupH_px}
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* --- Dimension: dz (Outer Diameter at the top) --- */}
            {/* Extension lines */}
            <line
              x1={cupCx - cupRo_px}
              y1={cupBaseY - cupH_px}
              x2={cupCx - cupRo_px}
              y2={cupBaseY - cupH_px - 22}
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            <line
              x1={cupCx + cupRo_px}
              y1={cupBaseY - cupH_px}
              x2={cupCx + cupRo_px}
              y2={cupBaseY - cupH_px - 22}
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            {/* Dimension line dz */}
            <line
              x1={cupCx - cupRo_px}
              y1={cupBaseY - cupH_px - 14}
              x2={cupCx + cupRo_px}
              y2={cupBaseY - cupH_px - 14}
              stroke="#e11d48"
              strokeWidth="1.2"
              markerStart="url(#arrow-rose)"
              markerEnd="url(#arrow-rose)"
            />
            <rect
              x={cupCx - 38}
              y={cupBaseY - cupH_px - 25}
              width="76"
              height="16"
              fill="#ffffff"
              rx="3"
              stroke="#fecdd3"
              strokeWidth="0.8"
            />
            <text
              x={cupCx}
              y={cupBaseY - cupH_px - 13}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-rose-700"
            >
              Ø dз = {formatted.dz}
            </text>

            {/* --- Dimension: h (Height of cup on the right) --- */}
            <line
              x1={cupCx + cupRo_px}
              y1={cupBaseY}
              x2={cupCx + cupRo_px + 28}
              y2={cupBaseY}
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            <line
              x1={cupCx + cupRo_px}
              y1={cupBaseY - cupH_px}
              x2={cupCx + cupRo_px + 28}
              y2={cupBaseY - cupH_px}
              stroke="#94a3b8"
              strokeWidth="0.8"
            />
            <line
              x1={cupCx + cupRo_px + 20}
              y1={cupBaseY}
              x2={cupCx + cupRo_px + 20}
              y2={cupBaseY - cupH_px}
              stroke="#d97706"
              strokeWidth="1.2"
              markerStart="url(#arrow-amber)"
              markerEnd="url(#arrow-amber)"
            />
            <rect
              x={cupCx + cupRo_px + 25}
              y={cupBaseY - cupH_px / 2 - 9}
              width="56"
              height="18"
              fill="#ffffff"
              rx="3"
              stroke="#fde68a"
              strokeWidth="0.8"
            />
            <text
              x={cupCx + cupRo_px + 53}
              y={cupBaseY - cupH_px / 2 + 4}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-amber-700"
            >
              h = {formatted.h}
            </text>

            {/* Wall thickness s callout on the left */}
            <line
              x1={cupCx - cupRo_px}
              y1={cupBaseY - cupH_px / 2}
              x2={cupCx - cupRo_px - 22}
              y2={cupBaseY - cupH_px / 2 - 14}
              stroke="#475569"
              strokeWidth="1"
            />
            <rect
              x={cupCx - cupRo_px - 62}
              y={cupBaseY - cupH_px / 2 - 25}
              width="44"
              height="16"
              fill="#ffffff"
              rx="3"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            <text
              x={cupCx - cupRo_px - 40}
              y={cupBaseY - cupH_px / 2 - 13}
              textAnchor="middle"
              className="text-[10px] font-mono font-semibold fill-slate-700"
            >
              s = {formatted.s}
            </text>

            {/* Cup Label */}
            <text x={cupCx} y={235} textAnchor="middle" className="text-[11px] font-mono fill-slate-500 font-semibold">
              Витягнутий ковпак (середній Ø d = {formatted.d} мм)
            </text>
          </g>
        </svg>
      </div>

      {/* Blueprint Legend / Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>dз — Зовнішній діаметр</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>h — Висота ковпака</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>D₀ — Діаметр круглої заготовки</span>
          </span>
        </div>
        <span className="font-mono text-slate-400 text-[10px]">Ковпак без фланця</span>
      </div>
    </div>
  );
};

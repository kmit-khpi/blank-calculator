/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CupParameters } from './types';
import { calculateBlank } from './utils/calculations';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsCards } from './components/ResultsCards';
import { ThreeViewport } from './components/ThreeViewport';
import { Blueprint2D } from './components/Blueprint2D';
import { HowItCalculates } from './components/HowItCalculates';
import { DroneMotorContext } from './components/DroneMotorContext';
import { Footer } from './components/Footer';
import { Play, Box, FileText } from 'lucide-react';

const DEFAULT_PARAMS: CupParameters = {
  dz: 28,
  h: 12,
  s: 0.5,
};

export default function App() {
  const [params, setParams] = useState<CupParameters>(DEFAULT_PARAMS);
  const [activeTab, setActiveTab] = useState<'3d' | '2d'>('3d');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);

  // Strictly calculate results based on provided engineering formulas
  const results = useMemo(() => calculateBlank(params), [params]);

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setIsAnimating(false);
    setAnimProgress(0);
  };

  const handleStartDrawingAnimation = () => {
    setActiveTab('3d');
    setAnimProgress(0);
    setIsAnimating(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Application Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        {/* Banner with Quick Action button */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Теорія обробки металів тиском (ОМТ)
              </span>
              <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                · Глибоке витягування циліндричних виробів
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              Розрахунок розгортки та коефіцієнта витяжки алюмінієвого стакана
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Визначте орієнтовний діаметр круглої заготовки <span className="text-sky-300 font-mono font-bold">D₀</span> та оцініть граничний ступінь деформації <span className="text-amber-300 font-mono font-bold">m</span> для захисного ковпака мотора квадрокоптера.
            </p>
          </div>

          <button
            onClick={handleStartDrawingAnimation}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Показати витягування</span>
          </button>
        </div>

        {/* Primary Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Sliders & Parameter Inputs (5 Cols on large) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <InputPanel
              params={params}
              onChange={setParams}
              onReset={handleReset}
            />

            <DroneMotorContext />
          </div>

          {/* Right Column: Visualizations & Calculation Results (7 Cols on large) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* KPI Results Cards */}
            <ResultsCards results={results} />

            {/* Visualizer Card (3D / 2D Tabbed View) */}
            <div className="flex flex-col gap-3">
              {/* Tabs Switcher */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-xs">
                  <button
                    onClick={() => setActiveTab('3d')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === '3d'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Інтерактивна модель</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('2d')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === '2d'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>2D Інженерне креслення</span>
                  </button>
                </div>

                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  {activeTab === '3d' ? 'Three.js WebGL' : 'Векторний переріз'}
                </span>
              </div>

              {/* Viewport Content */}
              {activeTab === '3d' ? (
                <ThreeViewport
                  params={params}
                  results={results}
                  isAnimating={isAnimating}
                  setIsAnimating={setIsAnimating}
                  animProgress={animProgress}
                  setAnimProgress={setAnimProgress}
                />
              ) : (
                <Blueprint2D params={params} results={results} />
              )}
            </div>
          </div>
        </div>

        {/* Theoretical Educational Block: «Як це рахується» */}
        <HowItCalculates params={params} results={results} />
      </main>

      {/* Required Bottom Note & University Community Footer */}
      <Footer />
    </div>
  );
}

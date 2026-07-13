import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, Compass, Layers, Check, Plus, HelpCircle, 
  Sparkles, Flame, RefreshCw, ChevronRight, Wind
} from 'lucide-react';
import { ScentOption } from '../types';
import { SCENT_OPTIONS } from '../data';

interface FragranceWheelProps {
  selectedScents: Record<string, number>;
  onToggleScent: (scId: string) => void;
}

interface ScentFamily {
  id: string;
  name: string;
  description: string;
  color: string;
  strokeColor: string;
  badgeClass: string;
  scents: string[]; // scent ids
}

interface ScentNoteLevel {
  id: 'top' | 'middle' | 'base';
  name: string;
  role: string;
  timing: string;
  percentage: string;
  description: string;
  color: string;
  scents: string[]; // scent ids
}

const SCENT_FAMILIES: ScentFamily[] = [
  {
    id: 'floral',
    name: 'Floral',
    description: 'Ethereal, blooming, and comforting. Floral scents promote a sense of inner peace, reduce stress levels, and bring an air of luxury and romance to any living space.',
    color: '#ec4899', // pink-500
    strokeColor: '#fbcfe8', // pink-200
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    scents: ['lavender', 'jasmine']
  },
  {
    id: 'fresh',
    name: 'Fresh & Herbal',
    description: 'Crisp, cooling, and clarifying. These refreshing scents clear the mind, enhance focus, and bring the vitalizing spirit of coastal Lekki breezes and rich green plants indoors.',
    color: '#10b981', // emerald-500
    strokeColor: '#a7f3d0', // emerald-200
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    scents: ['eucalyptus', 'citrus', 'lekki_breeze']
  },
  {
    id: 'woody',
    name: 'Woody',
    description: 'Earthy, ground, and deeply comforting. Rich resins like sandalwood and exotic oud anchor the space with a warm, steady, and meditative atmosphere that calms over-stimulated senses.',
    color: '#b45309', // amber-700
    strokeColor: '#fde68a', // amber-200
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    scents: ['sandalwood', 'ikeja_oud']
  },
  {
    id: 'spicy',
    name: 'Spicy',
    description: 'Invigorating, hot, and full of life. Spicy layers of ginger, cinnamon, and pepperfruit invoke warmth, inspire deep passion, and fill the room with dynamic and cozy energy.',
    color: '#ea580c', // orange-600
    strokeColor: '#fed7aa', // orange-200
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    scents: ['cinnamon_ginger', 'lasgidi_chai']
  },
  {
    id: 'sweet',
    name: 'Sweet & Warm',
    description: 'Indulgent, creamy, and nostalgic. Blending premium Madagascar vanilla bean and warm Gbagada cocoa to create a delicious sensory cocoon of pure comfort and warmth.',
    color: '#be123c', // rose-700
    strokeColor: '#fecdd3', // rose-200
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    scents: ['vanilla', 'cocoa_orchid']
  }
];

const SCENT_NOTE_LEVELS: ScentNoteLevel[] = [
  {
    id: 'top',
    name: 'Top Notes (The Greeting)',
    role: 'Initial impression, light, refreshing & sparkling',
    timing: 'First 5 - 15 minutes of burn time',
    percentage: 'Recommended: 15% - 25% of blend',
    description: 'These light, volatile aroma molecules evaporate quickly. They represent the first impression of your candle when you lift the lid or ignite the flame, clearing the headspace and setting the tone.',
    color: 'bg-sky-500/10 border-sky-500/30 text-sky-900',
    scents: ['eucalyptus', 'citrus', 'lekki_breeze']
  },
  {
    id: 'middle',
    name: 'Middle / Heart Notes (The Soul)',
    role: 'Full-bodied core character & aromatic body',
    timing: 'Emerges after 15 minutes, lasts up to 2 hours',
    percentage: 'Recommended: 40% - 50% of blend',
    description: 'The soul of your candle. Middle notes emerge as the top notes clear, establishing the core narrative, balancing the transitions, and forming the signature scent throw of the melting wax pool.',
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-900',
    scents: ['lavender', 'jasmine', 'cinnamon_ginger', 'lasgidi_chai']
  },
  {
    id: 'base',
    name: 'Base Notes (The Foundation)',
    role: 'Rich depth, anchor & long-lasting memory',
    timing: 'Lingers the longest, remains active after candle is out',
    percentage: 'Recommended: 25% - 35% of blend',
    description: 'Heavy, slow-evaporating molecules that anchor the blend. They provide depth, warmth, and persistence, keeping the fragrance lingering beautifully in the fabric and air of the room hours after the flame is out.',
    color: 'bg-rose-500/10 border-rose-500/30 text-rose-950',
    scents: ['vanilla', 'sandalwood', 'cocoa_orchid', 'ikeja_oud']
  }
];

export default function FragranceWheel({ selectedScents, onToggleScent }: FragranceWheelProps) {
  const [activeTab, setActiveTab] = useState<'families' | 'notes'>('families');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('floral');
  const [selectedNoteId, setSelectedNoteId] = useState<'top' | 'middle' | 'base'>('middle');
  const [hoveredFamilyId, setHoveredFamilyId] = useState<string | null>(null);

  // Math helper for drawing concentric circular SVG sectors
  const getSectPath = (cx: number, cy: number, rOut: number, rIn: number, startAngle: number, endAngle: number) => {
    const rad = Math.PI / 180;
    const sAngleRad = (startAngle - 90) * rad;
    const eAngleRad = (endAngle - 90) * rad;
    
    const x1Out = cx + rOut * Math.cos(sAngleRad);
    const y1Out = cy + rOut * Math.sin(sAngleRad);
    const x2Out = cx + rOut * Math.cos(eAngleRad);
    const y2Out = cy + rOut * Math.sin(eAngleRad);
    
    const x1In = cx + rIn * Math.cos(eAngleRad);
    const y1In = cy + rIn * Math.sin(eAngleRad);
    const x2In = cx + rIn * Math.cos(sAngleRad);
    const y2In = cy + rIn * Math.sin(sAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1Out} ${y1Out}
      A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2Out} ${y2Out}
      L ${x1In} ${y1In}
      A ${rIn} ${rIn} 0 ${largeArc} 0 ${x2In} ${y2In}
      Z
    `;
  };

  const selectedFamily = SCENT_FAMILIES.find(f => f.id === selectedFamilyId) || SCENT_FAMILIES[0];
  const selectedNote = SCENT_NOTE_LEVELS.find(n => n.id === selectedNoteId) || SCENT_NOTE_LEVELS[1];

  return (
    <div className="bg-stone-50/50 rounded-2xl border border-stone-200 p-5 mt-4" id="fragrance-wheel-container">
      {/* Title & Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Compass className="w-4 h-4 text-amber-700 animate-spin-slow" />
            <h3 className="font-serif font-bold text-sm tracking-wide text-stone-900">Interactive Fragrance Guide</h3>
          </div>
          <p className="text-[11px] text-stone-500 leading-tight">Master the chemistry of custom luxurious scent design</p>
        </div>
        
        {/* Guide mode toggle buttons */}
        <div className="flex bg-stone-200/60 p-1 rounded-lg self-stretch sm:self-auto shrink-0 border border-stone-200/30">
          <button
            onClick={() => setActiveTab('families')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'families'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Scent Families
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
              activeTab === 'notes'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Layers className="w-3 h-3" />
            Scent Notes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* LEFT COLUMN: The Visual Chart / Interactive Graphic */}
        <div className="md:col-span-5 flex justify-center items-center relative py-2">
          
          {/* VIEW 1: Scent Families Interactive Wheel */}
          {activeTab === 'families' && (
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Central text display */}
              <div className="absolute inset-10 rounded-full bg-white border border-stone-200 shadow-md flex flex-col items-center justify-center p-2 text-center z-10 select-none">
                <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">ACTIVE</span>
                <span className="text-xs font-serif font-bold text-stone-800 line-clamp-1 leading-tight uppercase">
                  {hoveredFamilyId 
                    ? SCENT_FAMILIES.find(f => f.id === hoveredFamilyId)?.name 
                    : selectedFamily.name
                  }
                </span>
                <span className="text-[8px] text-amber-700 font-mono mt-0.5">
                  {hoveredFamilyId
                    ? `${SCENT_FAMILIES.find(f => f.id === hoveredFamilyId)?.scents.length} SCENTS`
                    : `${selectedFamily.scents.length} SCENTS`
                  }
                </span>
              </div>

              {/* Circular SVG containing the segments */}
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-18">
                {SCENT_FAMILIES.map((fam, idx) => {
                  const angleSize = 360 / SCENT_FAMILIES.length;
                  const startAngle = idx * angleSize;
                  const endAngle = (idx + 1) * angleSize;
                  
                  const isSelected = selectedFamilyId === fam.id;
                  const isHovered = hoveredFamilyId === fam.id;
                  
                  // Expand slightly when selected or hovered for physical feedback
                  const outerRad = isSelected ? 96 : isHovered ? 92 : 86;
                  const innerRad = isSelected ? 50 : 54;

                  return (
                    <path
                      key={fam.id}
                      d={getSectPath(100, 100, outerRad, innerRad, startAngle, endAngle)}
                      fill={fam.color}
                      opacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.45}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onClick={() => setSelectedFamilyId(fam.id)}
                      onMouseEnter={() => setHoveredFamilyId(fam.id)}
                      onMouseLeave={() => setHoveredFamilyId(null)}
                    />
                  );
                })}
              </svg>
            </div>
          )}

          {/* VIEW 2: Scent Notes Layered Pyramid */}
          {activeTab === 'notes' && (
            <div className="w-full max-w-[200px] flex flex-col gap-2.5">
              
              {/* TOP NOTE LAYER (Triangle Cap) */}
              <button
                onClick={() => setSelectedNoteId('top')}
                className={`relative h-12 w-full transition-all flex flex-col justify-end items-center py-2 border rounded-t-full shadow-xs ${
                  selectedNoteId === 'top'
                    ? 'bg-sky-500/15 border-sky-500 text-sky-950 scale-102 ring-1 ring-sky-500'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
                style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
              >
                <div className="z-10 text-center flex flex-col items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold leading-tight">TOP</span>
                  <span className="text-[8px] font-semibold opacity-75">Greeting</span>
                </div>
              </button>

              {/* MIDDLE NOTE LAYER (Trapezoid) */}
              <button
                onClick={() => setSelectedNoteId('middle')}
                className={`relative h-16 w-full transition-all flex flex-col justify-center items-center border shadow-xs ${
                  selectedNoteId === 'middle'
                    ? 'bg-amber-500/15 border-amber-600 text-amber-950 scale-102 ring-1 ring-amber-600'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
                style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }}
              >
                <div className="z-10 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest font-bold block leading-tight">HEART / MIDDLE</span>
                  <span className="text-[9px] font-semibold opacity-75 block mt-0.5">The Soul (Core Body)</span>
                </div>
              </button>

              {/* BASE NOTE LAYER (Thicker Trapezoid) */}
              <button
                onClick={() => setSelectedNoteId('base')}
                className={`relative h-20 w-full transition-all flex flex-col justify-center items-center border shadow-xs rounded-b-md ${
                  selectedNoteId === 'base'
                    ? 'bg-rose-500/15 border-rose-600 text-rose-950 scale-102 ring-1 ring-rose-600'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
                style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)' }}
              >
                <div className="z-10 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest font-bold block leading-tight">BASE NOTES</span>
                  <span className="text-[9px] font-semibold opacity-75 block mt-0.5">Foundation (Memory)</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Educational Text, Selected Note details and Palette Integration */}
        <div className="md:col-span-7 space-y-4">
          
          {/* TAB 1 DETAIL: Families Info */}
          {activeTab === 'families' && (
            <motion.div
              key={selectedFamily.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider font-semibold border ${selectedFamily.badgeClass}`}>
                  {selectedFamily.name} Category
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-[10px] text-stone-400 font-mono font-medium">Click segments to explore</span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans font-normal">
                {selectedFamily.description}
              </p>

              {/* Scent matchers inside this family */}
              <div>
                <span className="text-[9px] font-mono tracking-wider text-stone-400 block mb-2 uppercase font-semibold">
                  Scent Palette in this family
                </span>
                <div className="space-y-2">
                  {selectedFamily.scents.map(scId => {
                    const scent = SCENT_OPTIONS.find(s => s.id === scId);
                    if (!scent) return null;

                    const isCurrentlySelected = selectedScents[scId] !== undefined;

                    return (
                      <div 
                        key={scId}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isCurrentlySelected 
                            ? 'bg-amber-500/5 border-amber-600/40' 
                            : 'bg-white hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <div className={`w-3.5 h-3.5 rounded-full shrink-0 bg-gradient-to-tr ${scent.color}`} />
                          <div>
                            <span className="font-serif font-bold text-xs text-stone-800 block leading-snug">{scent.name}</span>
                            <span className="text-[9px] text-stone-500 italic block leading-tight">{scent.notes}</span>
                          </div>
                        </div>

                        {/* Integration toggle button */}
                        <button
                          onClick={() => onToggleScent(scId)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shrink-0 ${
                            isCurrentlySelected
                              ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {isCurrentlySelected ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3.5px]" />
                              <span>IN BLEND</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[2.5px]" />
                              <span>ADD SCENT</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2 DETAIL: Notes Pyramid Info */}
          {activeTab === 'notes' && (
            <motion.div
              key={selectedNote.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider font-semibold border ${
                  selectedNote.id === 'top' ? 'bg-sky-50 border-sky-200 text-sky-700' :
                  selectedNote.id === 'middle' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {selectedNote.name}
                </span>
                <p className="text-[10px] text-amber-800 font-mono font-medium">{selectedNote.percentage}</p>
              </div>

              <div className="text-xs text-stone-500 leading-snug space-y-1">
                <p className="font-semibold text-stone-800">Role: <span className="font-normal text-stone-600">{selectedNote.role}</span></p>
                <p className="font-semibold text-stone-800">Activation: <span className="font-normal text-stone-600">{selectedNote.timing}</span></p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans font-normal">
                {selectedNote.description}
              </p>

              {/* Scent matchers inside this family */}
              <div>
                <span className="text-[9px] font-mono tracking-wider text-stone-400 block mb-2 uppercase font-semibold">
                  Scent Palette at this level
                </span>
                <div className="space-y-2">
                  {selectedNote.scents.map(scId => {
                    const scent = SCENT_OPTIONS.find(s => s.id === scId);
                    if (!scent) return null;

                    const isCurrentlySelected = selectedScents[scId] !== undefined;

                    return (
                      <div 
                        key={scId}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isCurrentlySelected 
                            ? 'bg-amber-500/5 border-amber-600/40' 
                            : 'bg-white hover:bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 pr-2">
                          <div className={`w-3.5 h-3.5 rounded-full shrink-0 bg-gradient-to-tr ${scent.color}`} />
                          <div>
                            <span className="font-serif font-bold text-xs text-stone-800 block leading-snug">{scent.name}</span>
                            <span className="text-[9px] text-stone-500 italic block leading-tight">{scent.notes}</span>
                          </div>
                        </div>

                        {/* Integration toggle button */}
                        <button
                          onClick={() => onToggleScent(scId)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 shrink-0 ${
                            isCurrentlySelected
                              ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {isCurrentlySelected ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3.5px]" />
                              <span>IN BLEND</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 stroke-[2.5px]" />
                              <span>ADD SCENT</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>

      {/* Guide Footer Tip */}
      <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2 text-stone-600">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 animate-pulse" />
        <p className="text-[10px] leading-relaxed">
          <span className="font-bold text-stone-800">Pro Scent Blender Tip:</span> For a balanced luxury candle, we recommend combining <span className="font-semibold text-stone-800">1 Top Note</span> (e.g. Eucalyptus or Orange Blossom) for initial sparkle, <span className="font-semibold text-stone-800">1 Heart Note</span> (e.g. Lavender or Jasmine) for character, and <span className="font-semibold text-stone-800">1 Base Note</span> (e.g. Vanilla or Sandalwood) to give deep long-lasting warmth to your space.
        </p>
      </div>

    </div>
  );
}

import React from 'react';
import { ChordChart as ChordChartType } from '../types/song';

interface ChordChartProps {
  chord: ChordChartType;
}

const ChordChart: React.FC<ChordChartProps> = ({ chord }) => {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
  const maxFret = Math.max(...chord.frets.filter(f => f > 0)) || 3;
  const minFret = Math.min(...chord.frets.filter(f => f > 0)) || 1;
  const fretRange = Math.max(3, maxFret - minFret + 1);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg">
      <h3 className="text-white font-bold text-lg mb-2">{chord.chord}</h3>
      
      {/* String markers (x, o) */}
      <div className="flex justify-between w-24 mb-2">
        {chord.frets.map((fret, index) => (
          <span key={index} className="text-white text-sm font-mono">
            {fret === 0 ? 'o' : fret === -1 ? 'x' : ''}
          </span>
        ))}
      </div>

      {/* Fretboard */}
      <div className="relative">
        <svg width="96" height="120" viewBox="0 0 96 120">
          {/* Frets */}
          {Array.from({ length: fretRange + 1 }).map((_, fretIndex) => (
            <line
              key={fretIndex}
              x1="8"
              y1={8 + fretIndex * 20}
              x2="88"
              y2={8 + fretIndex * 20}
              stroke="#ccc"
              strokeWidth={fretIndex === 0 ? "3" : "1"}
            />
          ))}

          {/* Strings */}
          {Array.from({ length: 6 }).map((_, stringIndex) => (
            <line
              key={stringIndex}
              x1={8 + stringIndex * 16}
              y1="8"
              x2={8 + stringIndex * 16}
              y2={8 + fretRange * 20}
              stroke="#ccc"
              strokeWidth="1"
            />
          ))}

          {/* Finger positions */}
          {chord.frets.map((fret, stringIndex) => {
            if (fret > 0 && fret <= maxFret) {
              const fretPos = fret - minFret + 1;
              return (
                <circle
                  key={stringIndex}
                  cx={8 + stringIndex * 16}
                  cy={8 + (fretPos - 0.5) * 20}
                  r="6"
                  fill="#333"
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}

          {/* Fret numbers */}
          {minFret > 1 && (
            <text
              x="2"
              y={8 + 10}
              fill="#ccc"
              fontSize="10"
              textAnchor="middle"
            >
              {minFret}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
};

export default ChordChart;
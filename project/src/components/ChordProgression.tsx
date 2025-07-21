import React from 'react';
import { ChordData } from '../types/song';

interface ChordProgressionProps {
  chords: ChordData[];
  currentTime?: number;
}

const ChordProgression: React.FC<ChordProgressionProps> = ({ chords, currentTime = 0 }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-semibold mb-4">Chord Progression</h3>
      
      {/* Timeline */}
      <div className="relative bg-gray-700 rounded-lg p-4 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-full">
          {chords.map((chordData, index) => {
            const isActive = currentTime >= chordData.timestamp && 
                            currentTime < chordData.timestamp + chordData.duration;
            
            return (
              <div
                key={index}
                className={`flex-shrink-0 px-4 py-2 rounded-md text-center font-semibold transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
                style={{ minWidth: '80px' }}
              >
                {chordData.chord}
              </div>
            );
          })}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 h-1 bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-100 ease-out rounded-full"
            style={{ 
              width: `${Math.min(100, (currentTime / (chords[chords.length - 1]?.timestamp + chords[chords.length - 1]?.duration || 1)) * 100)}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChordProgression;
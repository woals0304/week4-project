import React from 'react';

interface ChordProgressionProps {
  chords: Array<{
    chord: string;
    timestamp: number;
    duration: number;
  }>;
  currentTime: number;
}

const ChordProgression: React.FC<ChordProgressionProps> = ({ chords, currentTime }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">코드 진행</h3>
      <div className="flex flex-wrap gap-2">
        {chords.map((chord, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded ${
              currentTime >= chord.timestamp && currentTime < chord.timestamp + chord.duration
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            {chord.chord}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordProgression;
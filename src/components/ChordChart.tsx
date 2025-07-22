import React from 'react';

interface ChordChartProps {
  chord: {
    chord: string;
    frets: number[];
    fingers: number[];
  };
}

const ChordChart: React.FC<ChordChartProps> = ({ chord }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 text-center">
      <h3 className="font-bold text-lg mb-2">{chord.chord}</h3>
      <div className="text-sm text-gray-600">
        <div>Frets: {chord.frets.join('-')}</div>
        <div>Fingers: {chord.fingers.join('-')}</div>
      </div>
    </div>
  );
};

export default ChordChart;
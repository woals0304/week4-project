import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import YouTubePlayer from '../components/YouTubePlayer';
import { getSongDetail } from '../utils/api';
import { SongDetail } from '../types/song';

const SongDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Chordify URL 생성 함수
  const generateChordifyUrl = (title: string, artist: string) => {
    // 특수문자 제거 및 공백을 하이픈으로 변경
    const cleanTitle = title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // 특수문자 제거
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속된 하이픈을 하나로
      .trim();
    
    const cleanArtist = artist.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return `https://chordify.net/embed/${cleanArtist}-${cleanTitle}`;
  };

  useEffect(() => {
    const fetchSongDetail = async () => {
      if (!videoId) return;
      
      try {
        setLoading(true);
        const data = await getSongDetail(videoId);
        setSongDetail(data);
      } catch (err) {
        setError('곡 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching song detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetail();
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SearchBar onSearch={() => {}} />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !songDetail) {
    return (
      <div className="min-h-screen bg-white">
        <SearchBar onSearch={() => {}} />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error || '곡 정보를 찾을 수 없습니다.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SearchBar onSearch={() => {}} />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video player */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <YouTubePlayer
                videoId={videoId}
                className="w-full h-[500px]"
              />
            </div>
            
            {/* 여백 */}
            <div className="h-8" />
          </div>

          {/* Song info sidebar */}
          <div>
            <div className="bg-gray-100 rounded-lg p-6 h-[500px] flex flex-col justify-center">
              <h3 className="text-black font-semibold text-lg mb-1">{songDetail.title}</h3>
              <p className="text-gray-600 text-sm">{songDetail.channelTitle}</p>
            </div>
          </div>
        </div>

        {/* Chordify 임베드 */}
        <div className="mt-8">
          <iframe 
            frameBorder="0" 
            height="500" 
            src={generateChordifyUrl(songDetail.title, songDetail.channelTitle)}
            width="100%"
            className="rounded-lg"
            title="Chordify Player"
          />
        </div>
      </div>
    </div>
  );
};

export default SongDetailPage;
// src/components/YouTubePlayer.tsx

import React, { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  className?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, className = "" }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 1) IFrame API 스크립트 로드 (한 번만)
    const loadIframeAPI = () => {
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        return; // 이미 로드됨
      }
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => console.error('YouTube IFrame API 로드 실패');
      document.head.appendChild(script);
    };
    loadIframeAPI();

    // 2) 플레이어 초기화 함수
    const initializePlayer = () => {
      console.log('YouTube Player 초기화:', videoId);
      if (playerRef.current && window.YT && window.YT.Player) {
        // 기존 인스턴스 제거
        if (playerInstanceRef.current) {
          playerInstanceRef.current.destroy();
        }
        // 새 플레이어 생성
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          width: '100%',
          height: '100%',
          videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event: any) => console.log('Player Ready', event),
            onError: (err: any) => console.error('Player Error', err)
          }
        });
      }
    };

    // 3) API 준비 여부에 따라 초기화 호출
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    // 4) cleanup
    return () => {
      window.onYouTubeIframeAPIReady = () => {};
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={playerRef}
        className="w-full h-full bg-black flex items-center justify-center text-white"
      >
        유튜브 영상 플레이어
      </div>
    </div>
  );
};

export default YouTubePlayer;

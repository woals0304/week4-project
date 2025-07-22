// src/utils/api.ts

/** 검색 결과용 DTO */
export interface Song {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

/** 상세 정보용 DTO */
export interface SongDetail {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  // 필요에 따라 contentDetails 등 추가 정의 가능
}

/** 분석 결과 DTO */
export interface AnalyzeResult {
  bpm: number;
  signature: string;
  key: string;
  chords: { chord: string; timestamp: number; duration: number }[];
  chordCharts: { chord: string; frets: number[]; fingers: number[] }[];
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * 유튜브에서 영상 리스트 검색
 * @param query 검색어
 * @param pageToken 다음 페이지 토큰 (optional)
 */
export const searchSongs = async (
  query: string,
  pageToken = ''
): Promise<{ items: Song[]; nextPageToken?: string }> => {
  const maxResults = 10;
  // URLSearchParams로 파라미터 구성
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: String(maxResults),
    q: query,
    key: API_KEY
  });
  // pageToken이 있을 때만 추가
  if (pageToken) {
    params.append('pageToken', pageToken);
  }
  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  console.log('▶️ YouTube 검색 URL:', url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube Search Error: ${res.status}`);
  const data = await res.json();

  const items: Song[] = data.items.map((it: any) => ({
    videoId: it.id.videoId,
    title: it.snippet.title,
    channelTitle: it.snippet.channelTitle,
    thumbnailUrl: it.snippet.thumbnails.high.url
  }));

  return { items, nextPageToken: data.nextPageToken };
};

/**
 * 단일 영상의 메타데이터 조회
 * @param videoId 유튜브 동영상 ID
 */
export const getSongDetail = async (
  videoId: string
): Promise<SongDetail> => {
  const url = `https://www.googleapis.com/youtube/v3/videos?` +
    new URLSearchParams({
      part: 'snippet,contentDetails',
      id: videoId,
      key: API_KEY
    }).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube Detail Error: ${res.status}`);
  const data = await res.json();
  const vid = data.items[0];

  return {
    videoId,
    title: vid.snippet.title,
    channelTitle: vid.snippet.channelTitle,
    thumbnailUrl: vid.snippet.thumbnails.high.url,
    // contentDetails 등 추가 정보가 필요하면 여기에 할당
  };
};

/**
 * 백엔드 서버에서 곡 분석 결과 조회
 * @param videoId 유튜브 동영상 ID
 */
export const analyzeSong = async (
  videoId: string
): Promise<AnalyzeResult> => {
  const url = `${BACKEND_URL}/analyze`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ videoId })
  });
  if (!res.ok) throw new Error(`Analyze Error: ${res.status}`);
  const data = await res.json();
  return data as AnalyzeResult;
};

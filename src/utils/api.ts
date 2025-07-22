import { Song, SongDetail } from '../types/song';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// 더미 데이터 생성 함수
const generateDummyData = (query: string, pageToken: string = '') => {
  const dummySongs: Song[] = [
    {
      videoId: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      channelTitle: 'Rick Astley',
      thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      bpm: 113,
      signature: '4/4',
      key: 'F Major'
    },
    {
      videoId: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      channelTitle: 'Luis Fonsi',
      thumbnailUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      bpm: 89,
      signature: '4/4',
      key: 'B Minor'
    },
    {
      videoId: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      channelTitle: 'officialpsy',
      thumbnailUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      bpm: 132,
      signature: '4/4',
      key: 'G Major'
    },
    {
      videoId: 'fJ9rUzIMcZQ',
      title: 'Queen - Bohemian Rhapsody',
      channelTitle: 'Queen Official',
      thumbnailUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
      bpm: 72,
      signature: '4/4',
      key: 'Bb Major'
    },
    {
      videoId: 'L_jWHffIx5E',
      title: 'Smash Mouth - All Star',
      channelTitle: 'Smash Mouth',
      thumbnailUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      bpm: 104,
      signature: '4/4',
      key: 'F# Major'
    }
  ];

  // 검색어에 따라 필터링
  const filteredSongs = dummySongs.filter(song => 
    song.title.toLowerCase().includes(query.toLowerCase()) ||
    song.channelTitle.toLowerCase().includes(query.toLowerCase())
  );

  return {
    items: filteredSongs.length > 0 ? filteredSongs : dummySongs,
    nextPageToken: pageToken ? '' : 'dummy_next_token'
  };
};

export const searchSongs = async (
  query: string,
  pageToken = ''
): Promise<{ items: Song[]; nextPageToken?: string }> => {
  // API 키가 더미 키이거나 없는 경우 더미 데이터 반환
  if (!API_KEY || API_KEY.includes('Dummy') || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.log('▶️ Using dummy data for development');
    return generateDummyData(query, pageToken);
  }

  const maxResults = 10;
  // URLSearchParams로 파라미터 구성
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    q: query,
    maxResults: maxResults.toString(),
    key: API_KEY
  });

  if (pageToken) {
    params.append('pageToken', pageToken);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube Search Error: ${res.status}`);
  const data = await res.json();

  const items: Song[] = data.items.map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnailUrl: item.snippet.thumbnails.high.url,
  }));

  return {
    items,
    nextPageToken: data.nextPageToken,
  };
};

export const getSongDetail = async (videoId: string): Promise<SongDetail> => {
  const url = `https://www.googleapis.com/youtube/v3/videos?` +
    new URLSearchParams({
      part: 'snippet,contentDetails',
      id: videoId,
      key: API_KEY
    }).toString();

  // API 키가 더미 키이거나 없는 경우 더미 데이터 반환
  if (!API_KEY || API_KEY.includes('Dummy') || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.log('▶️ Using dummy song detail for development');
    return {
      videoId,
      title: 'Sample Song Title',
      channelTitle: 'Sample Artist',
      thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      bpm: 120,
      signature: '4/4',
      key: 'C Major',
      chords: [
        { chord: 'C', timestamp: 0, duration: 4 },
        { chord: 'Am', timestamp: 4, duration: 4 },
        { chord: 'F', timestamp: 8, duration: 4 },
        { chord: 'G', timestamp: 12, duration: 4 }
      ],
      chordCharts: [
        { chord: 'C', frets: [0, 1, 0, 2, 3, 0], fingers: [0, 1, 0, 2, 3, 0] },
        { chord: 'Am', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
        { chord: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
        { chord: 'G', frets: [3, 2, 0, 0, 3, 3], fingers: [3, 2, 0, 0, 4, 4] }
      ]
    };
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube Detail Error: ${res.status}`);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }

  const vid = data.items[0];
  return {
    videoId: vid.id,
    title: vid.snippet.title,
    channelTitle: vid.snippet.channelTitle,
    thumbnailUrl: vid.snippet.thumbnails.high.url,
    bpm: 120,
    signature: '4/4',
    key: 'C Major',
    chords: [],
    chordCharts: []
  };
};
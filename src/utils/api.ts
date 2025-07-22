@@ .. @@
-// src/utils/api.ts
-
-/** 검색 결과용 DTO */
-export interface Song {
-  videoId: string;
-  title: string;
-  channelTitle: string;
-  thumbnailUrl: string;
-}
-
-/** 상세 정보용 DTO */
-export interface SongDetail {
-  videoId: string;
-  title: string;
-  channelTitle: string;
-  thumbnailUrl: string;
-  // 필요에 따라 contentDetails 등 추가 정의 가능
-}
+import { Song, SongDetail } from '../types/song';
 
 const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
+
+// 더미 데이터 생성 함수
+const generateDummyData = (query: string, pageToken: string = '') => {
+  const dummySongs: Song[] = [
+    {
+      videoId: 'dQw4w9WgXcQ',
+      title: 'Rick Astley - Never Gonna Give You Up',
+      channelTitle: 'Rick Astley',
+      thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
+      bpm: 113,
+      signature: '4/4',
+      key: 'F Major'
+    },
+    {
+      videoId: 'kJQP7kiw5Fk',
+      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
+      channelTitle: 'Luis Fonsi',
+      thumbnailUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
+      bpm: 89,
+      signature: '4/4',
+      key: 'B Minor'
+    },
+    {
+      videoId: '9bZkp7q19f0',
+      title: 'PSY - GANGNAM STYLE',
+      channelTitle: 'officialpsy',
+      thumbnailUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
+      bpm: 132,
+      signature: '4/4',
+      key: 'G Major'
+    },
+    {
+      videoId: 'fJ9rUzIMcZQ',
+      title: 'Queen - Bohemian Rhapsody',
+      channelTitle: 'Queen Official',
+      thumbnailUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
+      bpm: 72,
+      signature: '4/4',
+      key: 'Bb Major'
+    },
+    {
+      videoId: 'L_jWHffIx5E',
+      title: 'Smash Mouth - All Star',
+      channelTitle: 'Smash Mouth',
+      thumbnailUrl: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
+      bpm: 104,
+      signature: '4/4',
+      key: 'F# Major'
+    }
+  ];
+
+  // 검색어에 따라 필터링
+  const filteredSongs = dummySongs.filter(song => 
+    song.title.toLowerCase().includes(query.toLowerCase()) ||
+    song.channelTitle.toLowerCase().includes(query.toLowerCase())
+  );
+
+  return {
+    items: filteredSongs.length > 0 ? filteredSongs : dummySongs,
+    nextPageToken: pageToken ? '' : 'dummy_next_token'
+  };
+};
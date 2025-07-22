@@ .. @@
 // src/utils/api.ts

+import { ChordData, ChordChart } from '../types/song';
+
 /** 검색 결과용 DTO */
 export interface Song {
   videoId: string;
@@ .. @@
   title: string;
   channelTitle: string;
   thumbnailUrl: string;
-  // 필요에 따라 contentDetails 등 추가 정의 가능
+  bpm: number;
+  signature: string;
+  key: string;
+  chords: ChordData[];
+  chordCharts: ChordChart[];
 }

 const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
+const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

 /**
@@ .. @@
 export const getSongDetail = async (
   videoId: string
 ): Promise<SongDetail> => {
+  try {
+    // 먼저 YouTube API에서 기본 정보 가져오기
     const url = `https://www.googleapis.com/youtube/v3/videos?` +
       new URLSearchParams({
         part: 'snippet,contentDetails',
@@ .. @@
     const data = await res.json();
     const vid = data.items[0];

-    return {
+    const basicInfo = {
       videoId,
       title: vid.snippet.title,
       channelTitle: vid.snippet.channelTitle,
       thumbnailUrl: vid.snippet.thumbnails.high.url,
-      // contentDetails 등 추가 정보가 필요하면 여기에 할당
     };
+
+    // 백엔드에서 코드 분석 결과 가져오기
+    try {
+      const analysisRes = await fetch(`${BACKEND_URL}/analyze`, {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify({ videoId }),
+      });
+
+      if (analysisRes.ok) {
+        const analysisData = await analysisRes.json();
+        return {
+          ...basicInfo,
+          bpm: analysisData.bpm,
+          signature: analysisData.signature,
+          key: analysisData.key,
+          chords: analysisData.chords,
+          chordCharts: analysisData.chordCharts,
+        };
+      }
+    } catch (analysisError) {
+      console.warn('코드 분석 실패, 기본값 사용:', analysisError);
+    }
+
+    // 분석 실패시 기본값 반환
+    return {
+      ...basicInfo,
+      bpm: 120,
+      signature: '4/4',
+      key: 'C Major',
+      chords: [
+        { chord: 'C', timestamp: 0, duration: 4 },
+        { chord: 'Am', timestamp: 4, duration: 4 },
+        { chord: 'F', timestamp: 8, duration: 4 },
+        { chord: 'G', timestamp: 12, duration: 4 },
+      ],
+      chordCharts: [
+        { chord: 'C', frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
+        { chord: 'Am', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
+        { chord: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
+        { chord: 'G', frets: [3, 2, 0, 0, 3, 3], fingers: [3, 1, 0, 0, 4, 4] },
+      ],
+    };
+  } catch (error) {
+    console.error('getSongDetail 오류:', error);
+    throw error;
+  }
 };
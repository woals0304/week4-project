@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import SearchBar from '../components/SearchBar';
 import YouTubePlayer from '../components/YouTubePlayer';
-import ChordChart from '../components/ChordChart';
-import ChordProgression from '../components/ChordProgression';
 import { getSongDetail } from '../utils/api';
 import { SongDetail } from '../types/song';

 const SongDetailPage: React.FC = () => {
   const { videoId } = useParams<{ videoId: string }>();
   const navigate = useNavigate();
   const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
   const [loading, setLoading] = useState(true);
-  const [currentTime, setCurrentTime] = useState(0);
   const [error, setError] = useState<string>('');

+  // Chordify URL 생성 함수
+  const generateChordifyUrl = (title: string, artist: string) => {
+    // 특수문자 제거 및 공백을 하이픈으로 변경
+    const cleanTitle = title.toLowerCase()
+      .replace(/[^\w\s-]/g, '') // 특수문자 제거
+      .replace(/\s+/g, '-') // 공백을 하이픈으로
+      .replace(/-+/g, '-') // 연속된 하이픈을 하나로
+      .trim();
+    
+    const cleanArtist = artist.toLowerCase()
+      .replace(/[^\w\s-]/g, '')
+      .replace(/\s+/g, '-')
+      .replace(/-+/g, '-')
+      .trim();
+    
+    return `https://chordify.net/embed/${cleanArtist}-${cleanTitle}`;
+  };
+
   useEffect(() => {
@@ .. @@
       <div className="max-w-7xl mx-auto p-4">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Video player */}
           <div className="lg:col-span-2">
             <div className="bg-gray-100 rounded-lg overflow-hidden">
               <YouTubePlayer
                 videoId={videoId}
-                className="w-full aspect-video"
-                onTimeUpdate={setCurrentTime} // YouTubePlayer가 이 prop을 지원한다고 가정
+                className="w-full h-[500px]"
               />
             </div>
-
-            {/* Chord progression */}
-            <div className="mt-6">
-              <ChordProgression
-                chords={songDetail.chords}
-                currentTime={currentTime}
-              />
-            </div>
+            
+            {/* 여백 */}
+            <div className="h-8" />
           </div>

           {/* Song info sidebar */}
-          <div className="space-y-6">
-            <div className="bg-gray-100 rounded-lg p-6">
-              <h2 className="text-black text-xl font-bold mb-4">곡 정보</h2>
-              <div className="space-y-3 text-gray-700">
-                <div>
-                  <span className="text-gray-500">제목:</span>
-                  <p className="font-semibold">{songDetail.title}</p>
-                </div>
-                <div>
-                  <span className="text-gray-500">아티스트:</span>
-                  <p className="font-semibold">{songDetail.channelTitle}</p>
-                </div>
-                <div>
-                  <span className="text-gray-500">Song BPM:</span>
-                  <p className="font-semibold">{songDetail.bpm}</p>
-                </div>
-                <div>
-                  <span className="text-gray-500">Song Signature:</span>
-                  <p className="font-semibold">{songDetail.signature}</p>
-                </div>
-                <div>
-                  <span className="text-gray-500">조성:</span>
-                  <p className="font-semibold">({songDetail.key})</p>
-                </div>
-              </div>
+          <div>
+            <div className="bg-gray-100 rounded-lg p-6 h-[500px] flex flex-col justify-center">
+              <h3 className="text-black font-semibold text-lg mb-1">{songDetail.title}</h3>
+              <p className="text-gray-600 text-sm">{songDetail.channelTitle}</p>
             </div>
           </div>
         </div>

-        {/* Chord charts */}
+        {/* Chordify 임베드 */}
         <div className="mt-8">
-          <h2 className="text-black text-2xl font-bold mb-6">코드 차트</h2>
-          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
-            {Array.isArray(songDetail.chordCharts) && songDetail.chordCharts.length > 0 ? (
-              songDetail.chordCharts.map((chord, index) => (
-                <ChordChart key={index} chord={chord} />
-              ))
-            ) : (
-              <p className="text-gray-500">코드 차트 정보가 없습니다.</p>
-            )}
-          </div>
+          <iframe 
+            frameBorder="0" 
+            height="500" 
+            src={generateChordifyUrl(songDetail.title, songDetail.channelTitle)}
+            width="100%"
+            className="rounded-lg"
+            title="Chordify Player"
+          />
         </div>
       </div>
     </div>
   );
 };
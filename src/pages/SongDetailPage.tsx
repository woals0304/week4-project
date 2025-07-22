@@ .. @@
             <div className="bg-gray-100 rounded-lg overflow-hidden">
               <YouTubePlayer
                 videoId={videoId}
                 className="w-full aspect-video"
-                onTimeUpdate={setCurrentTime} // YouTubePlayer가 이 prop을 지원한다고 가정
+                onTimeUpdate={setCurrentTime}
               />
             </div>
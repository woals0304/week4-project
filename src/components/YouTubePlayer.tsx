@@ .. @@
 interface YouTubePlayerProps {
   videoId: string;
   className?: string;
+  onTimeUpdate?: (time: number) => void;
 }

@@ .. @@
   }
 }

-const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, className = "" }) => {
+const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
+  videoId, 
+  className = "", 
+  onTimeUpdate 
+}) => {
   const playerRef = useRef<HTMLDivElement>(null);
   const playerInstanceRef = useRef<any>(null);
+  const intervalRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
@@ .. @@
         playerInstanceRef.current = new window.YT.Player(playerRef.current, {
           width: '100%',
           height: '100%',
@@ .. @@
           playerVars: {
             playsinline: 1,
             rel: 0,
             modestbranding: 1
+          },
+          events: {
+            onStateChange: (event: any) => {
+              if (event.data === window.YT.PlayerState.PLAYING) {
+                // 재생 중일 때 시간 업데이트 시작
+                if (onTimeUpdate && !intervalRef.current) {
+                  intervalRef.current = setInterval(() => {
+                    if (playerInstanceRef.current && playerInstanceRef.current.getCurrentTime) {
+                      const currentTime = playerInstanceRef.current.getCurrentTime();
+                      onTimeUpdate(currentTime);
+                    }
+                  }, 100); // 100ms마다 업데이트
+                }
+              } else {
+                // 재생 중이 아닐 때 시간 업데이트 중지
+                if (intervalRef.current) {
+                  clearInterval(intervalRef.current);
+                  intervalRef.current = null;
+                }
+              }
+            }
           }
         });
@@ .. @@
     // Cleanup on unmount
     return () => {
+      if (intervalRef.current) {
+        clearInterval(intervalRef.current);
+      }
       if (playerInstanceRef.current) {
         playerInstanceRef.current.destroy();
       }
@@ .. @@
   }, [videoId]);

+  // onTimeUpdate가 변경될 때 interval 재설정
+  useEffect(() => {
+    if (intervalRef.current) {
+      clearInterval(intervalRef.current);
+      intervalRef.current = null;
+    }
+    
+    if (onTimeUpdate && playerInstanceRef.current) {
+      const checkPlaying = () => {
+        if (playerInstanceRef.current && 
+            playerInstanceRef.current.getPlayerState && 
+            playerInstanceRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
+          intervalRef.current = setInterval(() => {
+            if (playerInstanceRef.current && playerInstanceRef.current.getCurrentTime) {
+              const currentTime = playerInstanceRef.current.getCurrentTime();
+              onTimeUpdate(currentTime);
+            }
+          }, 100);
+        }
+      };
+      checkPlaying();
+    }
+  }, [onTimeUpdate]);
+
   return (
     <div className={`relative ${className}`}>
       <div 
@@ .. @@
       >
         유튜브 영상 플레이어
       </div>
     </div>
   );
 };
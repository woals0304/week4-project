@@ .. @@
 export interface SongDetail extends Song {
   chords: ChordData[];
   chordCharts: ChordChart[];
+  bpm: number;
+  signature: string;
+  key: string;
 }
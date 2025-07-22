const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, className = "", onTimeUpdate }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
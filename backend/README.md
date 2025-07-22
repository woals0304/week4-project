# AutoChord Backend

Flask 기반 백엔드 서버로 유튜브 영상의 오디오를 분석해서 코드 진행을 추출합니다.

## 설치 및 실행

1. Python 가상환경 생성 및 활성화:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 의존성 설치:
```bash
pip install -r requirements.txt
```

3. 서버 실행:
```bash
python main.py
```

서버는 `http://localhost:5001`에서 실행됩니다.

## API 엔드포인트

### POST /analyze
유튜브 비디오 ID를 받아서 코드 분석 결과를 반환합니다.

**요청:**
```json
{
  "videoId": "dQw4w9WgXcQ"
}
```

**응답:**
```json
{
  "bpm": 120,
  "signature": "4/4",
  "key": "C Major",
  "chords": [
    {
      "chord": "C",
      "timestamp": 0,
      "duration": 4
    }
  ],
  "chordCharts": [
    {
      "chord": "C",
      "frets": [0, 3, 2, 0, 1, 0],
      "fingers": [0, 3, 2, 0, 1, 0]
    }
  ]
}
```

### POST /download
유튜브 URL에서 오디오를 다운로드합니다.

**요청:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**응답:**
```json
{
  "file": "downloads/uuid.mp3"
}
```

## 주의사항

- FFmpeg가 시스템에 설치되어 있어야 합니다.
- librosa 라이브러리는 오디오 분석을 위해 사용됩니다.
- 현재는 기본적인 코드 분석만 제공하며, 실제 음악 이론 기반의 정확한 분석을 위해서는 추가 개발이 필요합니다.
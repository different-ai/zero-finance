---
name: video-subtitle-cutter
description: Transcribe video, analyze subtitles with AI, and cut video by removing filler words, pauses, and mistakes
license: MIT
compatibility: opencode
metadata:
  service: video-editing
  category: media-automation
---

## What I Do

Automate video editing by:

1. Transcribing video to timestamped subtitles (Whisper)
2. Analyzing transcript with AI to identify cuts (filler words, pauses, mistakes)
3. Generating FFmpeg commands to cut and concatenate clean segments
4. Generating subtitles (SRT) for the final video

## CRITICAL: Always Re-encode (Never Use `-c copy`)

**The #1 mistake is using `-c copy` for cutting.** This causes:

- Frozen frames at cut points (1-8 seconds of freeze)
- Audio/video sync issues
- Glitchy playback

**Why?** H.264 video uses keyframes (I-frames) every 2-10 seconds. `-c copy` can only cut at keyframes, so FFmpeg includes extra frames that display as frozen.

**Solution:** Always re-encode segments with quality settings:

```bash
# WRONG - causes freeze frames
ffmpeg -ss 10 -i video.mp4 -t 5 -c copy segment.mp4

# CORRECT - smooth cuts at any timestamp
ffmpeg -ss 10 -i video.mp4 -t 5 \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -avoid_negative_ts make_zero \
  segment.mp4
```

**Quality presets (CRF = Constant Rate Factor):**

- `crf 15-17` = Near lossless (large files)
- `crf 18-20` = High quality (recommended)
- `crf 21-23` = Good quality (smaller files)
- `crf 24-28` = Medium quality (much smaller)

## Prerequisites

```bash
# Install Whisper (choose one)
pip install openai-whisper          # Local (requires Python 3.9+)
# OR use OpenAI API (no local install needed)

# Install FFmpeg
brew install ffmpeg                  # macOS
sudo apt install ffmpeg              # Linux
```

## Quick Start

### Step 1: Transcribe Video

**Option A: Local Whisper (free, slower)**

```bash
whisper video.mp4 --model medium --output_format json --output_dir ./
```

**Option B: OpenAI Whisper API (fast, paid)**

```bash
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@video.mp4" \
  -F model="whisper-1" \
  -F response_format="verbose_json" \
  -F timestamp_granularities[]="segment" \
  > transcript.json
```

**Option C: Use ffmpeg to extract audio first (for large files)**

```bash
# Extract audio (much smaller file to upload)
ffmpeg -i video.mp4 -vn -acodec libmp3lame -q:a 2 audio.mp3

# Then transcribe the audio
whisper audio.mp3 --model medium --output_format json
```

### Step 2: Analyze Transcript for Cuts

Feed the transcript to the AI with this prompt:

```
Analyze this video transcript and identify segments to CUT (remove).

TRANSCRIPT:
{paste transcript.json segments here}

Identify these issues:
1. FILLER WORDS: "um", "uh", "like", "you know", "basically", "actually", "so", "right"
2. FALSE STARTS: Incomplete sentences that restart ("I think— actually, let me...")
3. LONG PAUSES: Gaps > 1.5 seconds between segments
4. REPETITIONS: Same word/phrase repeated ("really really really")
5. CORRECTIONS: "Wait, I meant...", "Sorry, let me rephrase..."
6. TANGENTS: Off-topic rambling (use judgment)

Return a JSON array of segments to KEEP (not cut):
[
  {"start": 0.0, "end": 2.5, "text": "Welcome to this video"},
  {"start": 3.1, "end": 8.4, "text": "Today we're going to cover..."},
  ...
]

Rules:
- Merge adjacent keep segments if gap < 0.3s
- Ensure cuts don't happen mid-word (check word boundaries)
- Preserve natural speech rhythm (don't over-cut)
- When in doubt, keep the segment
```

### Step 3: Generate FFmpeg Commands (High Quality)

Once you have the keep segments, use this Python script for smooth cuts:

```python
import json
import subprocess
import os

VIDEO_INPUT = "video.mp4"
VIDEO_OUTPUT = "video_clean.mp4"
SEGMENTS_FILE = "keep_segments.json"

with open(SEGMENTS_FILE) as f:
    segments = json.load(f)

segment_files = []
for i, seg in enumerate(segments):
    outfile = f"temp_seg_{i:04d}.mp4"
    segment_files.append(outfile)

    # MUST re-encode for smooth cuts (no -c copy!)
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(seg['start']),      # Seek BEFORE input (fast)
        '-i', VIDEO_INPUT,
        '-t', str(seg['end'] - seg['start']),  # Duration
        '-c:v', 'libx264',
        '-preset', 'fast',              # fast/medium/slow
        '-crf', '18',                   # Quality (lower = better, 15-23 recommended)
        '-c:a', 'aac',
        '-b:a', '192k',
        '-avoid_negative_ts', 'make_zero',  # Fix timestamp issues
        '-async', '1',                  # Sync audio
        outfile
    ]
    subprocess.run(cmd, capture_output=True)
    print(f"✓ Segment {i+1}/{len(segments)}")

# Create concat file
with open('temp_concat.txt', 'w') as f:
    for sf in segment_files:
        f.write(f"file '{sf}'\n")

# Concatenate (can use -c copy here since all segments match)
subprocess.run([
    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
    '-i', 'temp_concat.txt',
    '-c', 'copy',
    VIDEO_OUTPUT
])

# Cleanup
for sf in segment_files:
    os.remove(sf)
os.remove('temp_concat.txt')
print(f"✓ Created: {VIDEO_OUTPUT}")
```

**Key flags explained:**

- `-ss` before `-i`: Fast seek (doesn't decode entire video)
- `-t`: Duration of segment (not end time)
- `-crf 18`: High quality encoding
- `-avoid_negative_ts make_zero`: Fixes concat timestamp issues
- `-async 1`: Keeps audio in sync

### Step 4: Generate Subtitles

After creating the final video, generate fresh subtitles with Whisper:

```bash
# Generate SRT subtitles for the cleaned video
whisper video_clean.mp4 --model medium --output_format srt --output_dir ./

# For higher accuracy (slower):
whisper video_clean.mp4 --model large --output_format srt --language en

# Output: video_clean.srt
```

**Burn subtitles into video (optional):**

```bash
# Embed subtitles permanently
ffmpeg -i video_clean.mp4 -vf "subtitles=video_clean.srt:force_style='FontSize=24,FontName=Arial,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'" -c:a copy video_with_subs.mp4
```

**Subtitle styling options:**

- `FontSize=24` - Text size
- `FontName=Arial` - Font face
- `PrimaryColour=&HFFFFFF` - White text (BGR format)
- `OutlineColour=&H000000` - Black outline
- `Outline=2` - Outline thickness
- `MarginV=50` - Distance from bottom

---

## Complete Workflow Script (High Quality)

```python
#!/usr/bin/env python3
"""
video_clean.py - Clean up video by removing filler words/pauses
Uses re-encoding for smooth cuts (no freeze frames)
"""

import json
import subprocess
import os
import sys

def get_duration(filepath):
    """Get video duration in seconds"""
    result = subprocess.run([
        'ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', filepath
    ], capture_output=True, text=True)
    return float(json.loads(result.stdout)['format']['duration'])

def extract_segment(input_file, start, end, output_file, crf=18, preset='fast'):
    """Extract a segment with re-encoding for smooth cuts"""
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(start),
        '-i', input_file,
        '-t', str(end - start),
        '-c:v', 'libx264',
        '-preset', preset,
        '-crf', str(crf),
        '-c:a', 'aac',
        '-b:a', '192k',
        '-avoid_negative_ts', 'make_zero',
        '-async', '1',
        output_file
    ]
    return subprocess.run(cmd, capture_output=True, text=True)

def concatenate_segments(segment_files, output_file):
    """Concatenate segments into final video"""
    with open('temp_concat.txt', 'w') as f:
        for sf in segment_files:
            f.write(f"file '{sf}'\n")

    subprocess.run([
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
        '-i', 'temp_concat.txt',
        '-c', 'copy',
        output_file
    ], capture_output=True)

    os.remove('temp_concat.txt')

def generate_subtitles(video_file, model='medium'):
    """Generate SRT subtitles using Whisper"""
    subprocess.run([
        'whisper', video_file,
        '--model', model,
        '--output_format', 'srt',
        '--output_dir', './'
    ])

def main(video_input, segments, output_name, crf=18):
    """Main workflow"""
    segment_files = []

    print(f"\n{'='*50}")
    print(f"Processing: {video_input}")
    print(f"Quality: CRF {crf} (lower=better, 15-23 recommended)")
    print(f"{'='*50}\n")

    # Extract segments with re-encoding
    for i, seg in enumerate(segments):
        outfile = f"temp_seg_{i:04d}.mp4"
        segment_files.append(outfile)

        result = extract_segment(video_input, seg['start'], seg['end'], outfile, crf)
        if result.returncode == 0:
            duration = seg['end'] - seg['start']
            print(f"✓ Segment {i+1}/{len(segments)}: {duration:.1f}s")
        else:
            print(f"✗ Error on segment {i+1}")
            print(result.stderr[-500:])

    # Concatenate
    print("\nConcatenating segments...")
    concatenate_segments(segment_files, output_name)

    # Cleanup temp segments
    for sf in segment_files:
        os.remove(sf)

    # Generate subtitles
    print("\nGenerating subtitles...")
    generate_subtitles(output_name)

    # Stats
    orig_duration = get_duration(video_input)
    new_duration = get_duration(output_name)
    orig_size = os.path.getsize(video_input) / (1024*1024)
    new_size = os.path.getsize(output_name) / (1024*1024)

    print(f"\n{'='*50}")
    print(f"COMPLETE")
    print(f"{'='*50}")
    print(f"Original:  {orig_duration:.0f}s | {orig_size:.1f} MB")
    print(f"Output:    {new_duration:.0f}s | {new_size:.1f} MB")
    print(f"Removed:   {orig_duration - new_duration:.0f}s ({((orig_duration - new_duration)/orig_duration)*100:.0f}%)")
    print(f"Video:     {output_name}")
    print(f"Subtitles: {output_name.replace('.mp4', '.srt')}")

if __name__ == '__main__':
    # Example usage
    VIDEO = "input.mp4"
    SEGMENTS = [
        {"start": 0.0, "end": 10.5},
        {"start": 12.3, "end": 25.0},
        # ... add your segments
    ]
    main(VIDEO, SEGMENTS, "output_clean.mp4", crf=18)
```

---

## AI Analysis Prompt Templates

### Basic Cleanup (Filler Words Only)

```
Remove filler words from this transcript. Return segments to KEEP.

Filler words to remove: um, uh, like, you know, basically, actually, so, right, I mean

TRANSCRIPT SEGMENTS:
{segments}

Return JSON: [{"start": float, "end": float, "text": "cleaned text"}, ...]
```

### Aggressive Cleanup (Podcast/Interview)

```
Clean this podcast transcript for a tight, professional edit.

REMOVE:
- All filler words (um, uh, like, you know, basically, so, right)
- False starts and restarts
- Pauses longer than 1 second
- Repetitions
- Off-topic tangents
- "That's a great question" type filler responses
- Excessive laughter/reactions (keep some for naturalness)

KEEP:
- Core content and insights
- Natural transitions
- Important reactions that add context

TRANSCRIPT:
{segments}

Return JSON array of segments to KEEP with cleaned text.
```

### Light Cleanup (Preserve Natural Feel)

```
Lightly clean this transcript while preserving natural speech patterns.

ONLY REMOVE:
- "Um" and "uh" when standalone (not part of thinking pause)
- Obvious mistakes followed by corrections
- Technical issues (coughs, phone rings, etc.)

PRESERVE:
- Natural "like" and "you know" that add personality
- Thinking pauses that feel authentic
- Personality quirks

TRANSCRIPT:
{segments}

Return JSON array of segments to KEEP.
```

---

## Transcript Format Reference

### Whisper JSON Output

```json
{
  "text": "Full transcript text...",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 2.5,
      "text": " Welcome to this video.",
      "tokens": [50364, 5765, ...],
      "temperature": 0.0,
      "avg_logprob": -0.25,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.01
    },
    {
      "id": 1,
      "start": 2.5,
      "end": 5.8,
      "text": " Um, so today we're going to...",
      ...
    }
  ],
  "language": "en"
}
```

### Keep Segments Format (for FFmpeg)

```json
[
  { "start": 0.0, "end": 2.5, "text": "Welcome to this video." },
  { "start": 3.2, "end": 5.8, "text": "Today we're going to..." }
]
```

---

## Advanced: Word-Level Timestamps

For precise filler word removal, use word-level timestamps:

```bash
# Whisper with word timestamps
whisper video.mp4 --model medium --word_timestamps True --output_format json
```

This gives you:

```json
{
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Um welcome to this video",
      "words": [
        { "word": "Um", "start": 0.0, "end": 0.3 },
        { "word": "welcome", "start": 0.5, "end": 0.9 },
        { "word": "to", "start": 0.9, "end": 1.0 },
        { "word": "this", "start": 1.0, "end": 1.2 },
        { "word": "video", "start": 1.2, "end": 1.6 }
      ]
    }
  ]
}
```

Now you can cut precisely around "Um" (0.0-0.3) and keep "welcome to this video" (0.5-1.6).

---

## Troubleshooting

### Frozen Frames at Cut Points (MOST COMMON)

**Cause:** Using `-c copy` which can only cut at keyframes.

**Solution:** Always re-encode with `-c:v libx264 -crf 18` (see examples above).

### Audio/Video Sync Issues

Add these flags when extracting segments:

```bash
ffmpeg -ss 10 -i video.mp4 -t 5 \
  -c:v libx264 -crf 18 \
  -c:a aac -b:a 192k \
  -avoid_negative_ts make_zero \  # Fix negative timestamps
  -async 1 \                       # Sync audio to video
  segment.mp4
```

### Cuts Sound Abrupt

Add audio fade in/out to each segment:

```bash
ffmpeg -ss 10 -i video.mp4 -t 5 \
  -c:v libx264 -crf 18 \
  -af "afade=t=in:st=0:d=0.05,afade=t=out:st=4.95:d=0.05" \
  -c:a aac segment.mp4
```

### Large Files Take Forever

1. Use `-preset fast` or `-preset veryfast` (trades quality for speed)
2. Extract audio first for transcription (much smaller)
3. Use Whisper API instead of local model
4. Process in parallel (multiple segments at once)

```bash
# Faster encoding (slightly lower quality)
ffmpeg ... -preset veryfast -crf 20 ...

# Even faster for previews
ffmpeg ... -preset ultrafast -crf 23 ...
```

### Whisper Misses Words

- Use `--model large` for better accuracy
- Use `--language en` to force English
- Normalize audio first:

```bash
ffmpeg -i video.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy normalized.mp4
```

### File Size Too Large After Re-encoding

Increase CRF value (higher = smaller file, lower quality):

```bash
# Original quality (large)
-crf 18

# Good quality (medium)
-crf 22

# Acceptable quality (small)
-crf 26
```

---

## Integration with OpenCode

When using this skill in OpenCode:

1. **Extract audio** (faster transcription):

   ```bash
   ffmpeg -i video.mp4 -vn -acodec libmp3lame -q:a 2 temp_audio.mp3 -y
   ```

2. **Transcribe with Whisper**:

   ```bash
   whisper temp_audio.mp3 --model medium --output_format json --output_dir ./
   ```

3. **Read transcript.json** and analyze segments

4. **Identify segments to KEEP** based on:
   - Removing filler words (um, uh, like, you know)
   - Removing long pauses (>1.5s gaps)
   - Removing false starts and repetitions
   - For "shorts style": Keep only hook + key points + CTA

5. **Re-encode and concatenate** (MUST re-encode, never -c copy):

   ```python
   # Use the Python script above with crf=18 for quality
   ```

6. **Generate subtitles** for final video:

   ```bash
   whisper output.mp4 --model medium --output_format srt
   ```

7. **Report results** with before/after stats

### Quality Settings Reference

| Use Case       | CRF   | Preset   | Notes                      |
| -------------- | ----- | -------- | -------------------------- |
| Archive/Master | 15-17 | slow     | Near lossless, large files |
| YouTube/Vimeo  | 18-20 | medium   | High quality, recommended  |
| Social Media   | 21-23 | fast     | Good quality, smaller      |
| Preview/Draft  | 24-28 | veryfast | Quick renders              |

### Anti-Patterns (DO NOT DO)

```bash
# WRONG: -c copy causes freeze frames
ffmpeg -ss 10 -i video.mp4 -t 5 -c copy segment.mp4

# WRONG: -to instead of -t with -ss before -i
ffmpeg -ss 10 -i video.mp4 -to 15 ...  # -to is absolute, not relative

# WRONG: Missing timestamp fix flags
ffmpeg ... -c:v libx264 ...  # Missing -avoid_negative_ts
```

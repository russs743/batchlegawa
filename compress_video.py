import sys
import os

from moviepy import VideoFileClip

input_path = r"C:\Users\Lenovo\Downloads\Farewell\FA - UNTUK CBN DARI LEGAWA.mp4"
output_path = r"C:\Users\Lenovo\Projects\legawa\public\aftermovie.mp4"

if not os.path.exists(input_path):
    print(f"File not found: {input_path}")
    sys.exit(1)

print(f"Loading video: {input_path}")
clip = VideoFileClip(input_path)

# Compress by resizing to 720p if it's larger
if clip.h > 720:
    print("Resizing to 720p...")
    clip = clip.resized(height=720)

print(f"Compressing video to {output_path}...")
# We use a lower bitrate to ensure the file size drops significantly
# A 9-min video (576s) at 700kbps video + 128kbps audio = ~60 MB
clip.write_videofile(
    output_path,
    codec="libx264",
    audio_codec="aac",
    bitrate="700k",
    audio_bitrate="128k",
    preset="fast",
    threads=4
)
print("Compression finished successfully!")

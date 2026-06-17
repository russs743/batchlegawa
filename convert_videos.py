import os
import subprocess
import sys

# Script ini akan otomatis mengunduh ffmpeg-binary khusus python
try:
    import imageio_ffmpeg
except ImportError:
    print("Menginstall imageio-ffmpeg (ffmpeg binary)...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "imageio-ffmpeg"])
    import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

# Cari seluruh folder public
target_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

if not os.path.exists(target_dir):
    print(f"Folder tidak ditemukan: {target_dir}")
    sys.exit(1)

print(f"Mencari file .mp4 di seluruh folder {target_dir}...\n")

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.lower().endswith('.mp4'):
            mp4_path = os.path.join(root, file)
            webm_path = os.path.splitext(mp4_path)[0] + ".webm"
            
            if os.path.exists(webm_path):
                print(f"[LEWATI] Sudah ada: {file}")
                continue
                
            print(f"[PROSES] Mengonversi: {file} -> .webm")
            
            # Perintah FFmpeg untuk WebM (VP9 codec)
            cmd = [
                ffmpeg_exe,
                "-i", mp4_path,
                "-c:v", "libvpx-vp9",
                "-crf", "35",
                "-b:v", "0",
                "-vf", "scale=-2:720", 
                # "-an" dihapus agar video seperti RevealLegawa.mp4 tetap memiliki suara
                "-c:a", "libopus", # Mengkompres audio juga agar ringan
                "-row-mt", "1",
                "-threads", "4",
                "-y", 
                webm_path
            ]
            
            try:
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
                print(f"[SUKSES] {file}.webm\n")
            except subprocess.CalledProcessError as e:
                print(f"[GAGAL] {e}\n")

print("Selesai! Semua video telah dikonversi ke WebM.")
print("Silakan ubah akhiran '.mp4' menjadi '.webm' di file komponen.")

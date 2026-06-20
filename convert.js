const ffmpeg = require('ffmpeg-static');
const { execSync } = require('child_process');

console.log("Using ffmpeg from:", ffmpeg);

const inputFile = 'c:\\Users\\Lenovo\\Projects\\legawa\\public\\Chapter\\Chapter4.mp4';
const outputFile = 'c:\\Users\\Lenovo\\Projects\\legawa\\public\\Chapter\\Chapter4.webm';

try {
  // Use libvpx (VP8) with realtime deadline, cpu-used 8, and scale down to 720p for ultra-fast conversion
  execSync(`"${ffmpeg}" -i "${inputFile}" -c:v libvpx -b:v 1.5M -deadline realtime -cpu-used 8 -threads 4 -vf scale=-2:720 -c:a libvorbis -y "${outputFile}"`, {
    stdio: 'inherit'
  });
  console.log("Conversion successful!");
} catch (e) {
  console.error("Error during conversion:", e.message);
  process.exit(1);
}

import {defineConfig} from 'vite';
import mcPlugin from '@motion-canvas/vite-plugin';
import ffmpegPlugin from '@motion-canvas/ffmpeg';

const motionCanvas = (mcPlugin as any).default ?? mcPlugin;
const ffmpeg = (ffmpegPlugin as any).default ?? ffmpegPlugin;

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
});

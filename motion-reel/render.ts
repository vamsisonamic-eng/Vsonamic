import {Renderer, Vector2} from '@motion-canvas/core';
import project from './src/project?project';

(window as any).__startRender = async () => {
  const renderer = new Renderer(project);
  await renderer.render({
    name: 'bharat-vamsi-reel',
    fps: 30,
    resolutionScale: 1,
    colorSpace: 'srgb',
    fileType: 'image/png',
    quality: 1,
    range: [0, Infinity],
    size: new Vector2(1920, 1080),
    exporter: {
      name: '@motion-canvas/ffmpeg',
      options: {fastStart: true, includeAudio: false},
    },
  });
  return 'done';
};

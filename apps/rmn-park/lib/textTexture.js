'use client';

import * as THREE from 'three';

/**
 * Draws crisp text/signage into a CanvasTexture so 3D screens and price
 * tags need no font downloads (works offline and under strict CSP).
 */
export function makeSignTexture({
  lines,
  w = 512,
  h = 256,
  bg = '#0D1329',
  fg = '#EEF2FF',
  accent = '#4FD6EA',
  glow = true,
}) {
  const cnv = document.createElement('canvas');
  cnv.width = w;
  cnv.height = h;
  const c = cnv.getContext('2d');

  const g = c.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, bg);
  g.addColorStop(1, '#141B3A');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = accent + '66';
  c.lineWidth = 6;
  c.strokeRect(6, 6, w - 12, h - 12);

  const rows = Array.isArray(lines) ? lines : [lines];
  const size = Math.min(h / (rows.length + 1.2), w / 9);
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  rows.forEach((row, i) => {
    const y = (h / (rows.length + 1)) * (i + 1);
    c.font = `800 ${i === 0 ? size * 1.15 : size * 0.8}px system-ui, sans-serif`;
    if (glow) {
      c.shadowColor = accent;
      c.shadowBlur = 24;
    }
    c.fillStyle = i === 0 ? fg : accent;
    c.fillText(row, w / 2, y);
  });

  const tex = new THREE.CanvasTexture(cnv);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

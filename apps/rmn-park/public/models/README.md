# Higgsfield GLB asset slots

Every hero prop renders a stylized procedural fallback until a GLB lands
here, so the park never breaks. Generate each asset with the Higgsfield
MCP (`generate_image` → `generate_3d`, GLB output) once the account has
credits, then drop the file in with the exact name below — no code
changes needed.

| File | Prompt for generate_image (then generate_3d) |
|---|---|
| `billboard-vintage.glb` | Stylized low-poly roadside billboard on two steel posts, slightly weathered paper poster, soft matte clay render, isometric-friendly, no text |
| `dsp-hub.glb` | Futuristic neon-cyan holographic terminal kiosk, glowing rings, low-poly stylized, dark sci-fi trading floor prop |
| `ssp-hub.glb` | Futuristic neon-magenta auctioneer podium terminal, glowing rings, low-poly stylized, dark sci-fi trading floor prop |
| `shopping-cart.glb` | Cute stylized chrome-blue shopping cart, low-poly, toy-like proportions, soft studio light |
| `cereal-box.glb` | Playful orange cereal box, blank front, low-poly stylized grocery prop, matte clay shading |

Keep meshes under ~50k tris; the scenes assume Y-up, meters-ish scale
(a cart ≈ 1.2 units long). `ModelOrFallback` swaps them in automatically.

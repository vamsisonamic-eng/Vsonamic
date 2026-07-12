'use client';

import { Suspense, Component } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * Higgsfield GLB slot.
 *
 * Each hero prop of the park has a reserved glTF/GLB slot generated via
 * the Higgsfield MCP pipeline (generate_image → generate_3d → GLB) and
 * dropped into /public/models — see public/models/README.md for the
 * exact per-asset prompts. Until a GLB exists at `src`, the stylized
 * procedural `fallback` renders instead, so the park is never broken
 * by a missing asset.
 */
class GLBBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function GLB({ src, ...props }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} {...props} />;
}

export default function ModelOrFallback({ src, fallback, ...props }) {
  return (
    <GLBBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLB src={src} {...props} />
      </Suspense>
    </GLBBoundary>
  );
}

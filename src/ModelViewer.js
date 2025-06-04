import React from 'react';
import '@google/model-viewer';

export function ModelViewer({ modelPath }) {
  return (
    <model-viewer
      src={modelPath}
      alt="3D model"
      camera-controls
      auto-rotate
      ar
      style={{ width: '100%', height: '100%' }}
    ></model-viewer>
  );
}

import React, { useRef, useState, useEffect, RefObject, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { type XRDevice } from 'iwer';
import { XR } from '@react-three/xr';
import { Scene } from "./Scene.tsx";
import { xrDevice, xrStore, XRSetup } from "./XRSetup.tsx";


// --- WebSocket Pose Hook ---
function useWebSocketPose(device: XRDevice) {
  useEffect(() => {
    console.log("Attempting to connect to ws://localhost:8887");
    const ws = new WebSocket("ws://localhost:8887");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("WebSocket connected for pose updates");
    };

    ws.onclose = (event) => {
      console.log(
        `WebSocket disconnected: Code=${event.code}, Reason='${event.reason}', WasClean=${event.wasClean}`
      );
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      // Attempt to log more details if possible
      console.error(
        "WebSocket error object:",
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
    };

    ws.onmessage = (event) => {
      if (!(event.data instanceof ArrayBuffer) || event.data.byteLength !== 48) {
        console.warn("Unexpected WebSocket message format or size", event.data);
        return;
      }

      const arr = new Float32Array(event.data);

      // Reconstruct 3x4 matrix components
      const matrixData = [
        [arr[0], arr[1], arr[2], arr[3]], // Row 1
        [arr[4], arr[5], arr[6], arr[7]], // Row 2
        [arr[8], arr[9], arr[10], arr[11]], // Row 3
      ];

      // Extract position (4th column)
      const position = {
        x: matrixData[0][3],
        y: matrixData[1][3],
        z: matrixData[2][3],
      };

      // Build a THREE.Matrix4 from the 3x3 rotation part
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.set(
        matrixData[0][0], matrixData[0][1], matrixData[0][2], 0,
        matrixData[1][0], matrixData[1][1], matrixData[1][2], 0,
        matrixData[2][0], matrixData[2][1], matrixData[2][2], 0,
        0, 0, 0, 1
      );

      // Convert rotation matrix to quaternion
      const quaternion = new THREE.Quaternion();
      quaternion.setFromRotationMatrix(rotationMatrix);

      // Update XR device position and orientation
      // Ensure updates are applied smoothly if needed (e.g., using lerp or slerp in a useFrame loop)
      // For now, direct update:
      device.position.set(position.x, position.y, position.z);
      device.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

      // Optional: Log updates for debugging
      // console.log("Updated device pose:", position, quaternion.toArray());
    };

    // Cleanup function to close WebSocket on component unmount
    return () => {
      console.log("Closing WebSocket connection");
      ws.close();
    };
  }, [device]); // Re-run effect if the device instance changes
}


function App() {
  // Call the WebSocket hook here, passing the xrDevice instance
  useWebSocketPose(xrDevice);

  return (
    <>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <XRSetup />
        <XR store={xrStore}>
          <Scene />
        </XR>
      </Canvas>
    </>
  )
}

export default App

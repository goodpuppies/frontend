import React, { useEffect } from 'react';
import { XRDevice, metaQuest3 } from 'iwer';
import { createXRStore } from '@react-three/xr';

const AUTO_START_XR = true;

export const xrDevice = new XRDevice(metaQuest3, {
  stereoEnabled: true,
  //ipd: 0.90,
  fovy: 2
});
xrDevice.installRuntime();

export const xrStore = createXRStore();

export const XRSetup = () => {
  useEffect(() => {
    if (AUTO_START_XR) {
      console.log("attempting to auto-start XR...");
      // Use a timeout to give other systems a chance to initialize
      const timerId = setTimeout(() => {
        if (typeof xrStore.enterAR === 'function') {
          xrStore.enterAR().catch(err => {
            console.error("Failed to auto-enter AR:", err);
          });
        } else {
          console.error("xrStore.enterAR is not a function. Cannot auto-start XR.");
        }
      }, 1000); // 1 second delay

      return () => clearTimeout(timerId); // Cleanup timeout on unmount
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // This component doesn't render anything visual itself
  return null;
};

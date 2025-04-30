import React, { useEffect } from 'react';
import { XRDevice, metaQuest3 } from 'iwer';
import { createXRStore } from '@react-three/xr';
import { xrStore } from "./App.tsx";

const AUTO_START_XR = true;



export const XRSetup = () => {
  useEffect(() => {
    if (AUTO_START_XR) {
      console.log("attempting to auto-start XR...");
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

  return null;
};

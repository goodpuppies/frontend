import React, { useEffect } from 'react';
import { xrStore } from "./App.tsx";

const AUTO_START_XR = true;

function installSessionBridgeOnce() {
  try {
    // deno-lint-ignore no-explicit-any
    const xrAny = (navigator as any)?.xr as any;
    if (!xrAny?.requestSession || xrAny.__petplay_wrapped) return;

    const orig = xrAny.requestSession.bind(xrAny);
    xrAny.requestSession = async (...args: unknown[]) => {
      const session = await orig(...args);
      try {
        // deno-lint-ignore no-explicit-any
        (window as any).cefExt?.webxr?.setSession?.(session);
      } catch (_e) {
        throw new Error("wtf")
      }
      try {
        // deno-lint-ignore no-explicit-any
        (session as any).__setExternalClock?.(true);
      } catch (_e) {
        throw new Error("wtf")
      }
      console.log("got em")
      return session;
    };
    xrAny.__petplay_wrapped = true;
  } catch (_e) {
    throw new Error("wtf")
  }
}



export const XRSetup = () => {
  useEffect(() => {
    installSessionBridgeOnce();
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

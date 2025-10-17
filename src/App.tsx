import React, { Suspense, useEffect, forwardRef, useState, useRef, ReactNode } from "react";
import { Canvas } from '@react-three/fiber';
import { XR, XRHandModel } from '@react-three/xr';
import { Scene } from "./Scene.tsx";
import { XRSetup } from "./XRSetup.tsx";
import { useWebSocketPose, useWebSocketControllerPose } from "./websocket.ts";

import { XRDevice, metaQuest3 } from 'iwer';
import { createXRStore } from '@react-three/xr';
import { UI } from "./Menu.tsx";
import { Root, Container, Text } from "@react-three/uikit";
import { Defaults } from "@react-three/uikit-default";
import { ClockIcon, Group } from '@react-three/uikit-lucide'
import { CustomTransformHandles } from "./Handle.tsx"
import { Frame } from "./Frame.tsx"
import { Handle } from '@react-three/handle'


export const xrDevice = new XRDevice(metaQuest3, {
  stereoEnabled: true,
  //ipd: 0.90,
  fovy: 1.9
});
xrDevice.installRuntime();
/* //@ts-expect-error cef extension
// deno-lint-ignore no-window */
window.cefExt.webxr.setDevice(xrDevice);



export function UiSus() {
  return (
    <>
      <Suspense>
        <UItrans />
      </Suspense>
    </>
  )
}

export function Empty() {
  return (
    <>
    </>
  )
}

export const xrStore = createXRStore({
  controller: {
    right: UiSus,
    left: { rayPointer: { minDistance:-1, }, model: false },
  },
  foveation: 0,
  bounded: false,
})

function App() {
  // Call the WebSocket hook here, passing the xrDevice instance
  //useWebSocketPose(xrDevice);
  //useWebSocketControllerPose(xrDevice);
  


  return (
    <>
      {/* <button
        onClick={()=> xrStore.enterAR()}
        style={{ position: 'relative', zIndex: 1, padding: '10px', margin: '10px' }}
      >
        Enter AR
      </button> */}
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

export function UItrans() {
  return (
    <group
      position={[0.14, 1e-7, 0.04]}
      rotation={[-1.1064536056499201, -0.5691113573725565, -1.1867850376947444]}
      scale={[0.47, 0.47, 0.47]}
    >
      <Handle>
        <Frame>
          <Root pixelSize={0.001} >
            <UI />
          </Root>
        </Frame>
      </Handle>
    </group>
  )
}



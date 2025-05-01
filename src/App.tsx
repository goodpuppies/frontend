import { Suspense, useEffect, forwardRef, useState, useRef, ReactNode } from "react";
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
import { Group as ThreeGroup } from 'three'; // Import Group from three
import { Frame } from "./Frame.tsx"


export const xrDevice = new XRDevice(metaQuest3, {
  stereoEnabled: true,
  //ipd: 0.90,
  fovy: 1.9
});
xrDevice.installRuntime();





export const UItrans = () => {
  // Note: The Root's pixelSize and the Frame's geometry args
  // need careful coordination for the frame to visually "bound" the UI.
  // Dynamic sizing would be a more robust solution.
  return (
    <group
      position={[0.11, 1e-7, 0.04]}
      rotation={[-1.1064536056499201, -0.5691113573725565, -1.1867850376947444]}
      scale={[0.47, 0.47, 0.47]}
    >
      <CustomTransformHandles>
        <Frame>
          <Root pixelSize={0.001} >
            <UI />
          </Root>
        </Frame>
      </CustomTransformHandles>
    </group>
  )
}

export function HandWithWatch() {
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
    right: HandWithWatch,
    left: { model: false },
  },
  foveation: 0,
  bounded: false,
})

function App() {
  // Call the WebSocket hook here, passing the xrDevice instance
  useWebSocketPose(xrDevice);
  useWebSocketControllerPose(xrDevice);

  return (
    <>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <XRSetup />
        <XR store={xrStore}>
          <Scene />
          <group position={[0, 1.12, 0.25]}>
            <Root
              overflow="scroll"
              scrollbarColor="black"
              flexDirection="column"
              gap={32}
              paddingX={32}
              alignItems="center"
              padding={32}
              pixelSize={0.0005}
            >
              <Defaults>
                <UI />
              </Defaults>
            </Root>
          </group>
        </XR>
      </Canvas>
    </>
  )
}

export default App

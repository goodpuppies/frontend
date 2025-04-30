import { Suspense, useEffect, useState } from "react";
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




export const xrDevice = new XRDevice(metaQuest3, {
  stereoEnabled: true,
  //ipd: 0.90,
  fovy: 1.9
});
xrDevice.installRuntime();

export const UItrans = () => {
  return (
    <group
      position={[0.11, 1e-7, 0.04]}
      rotation={[-1.1064536056499201, -0.5691113573725565, -1.1867850376947444]} scale={[0.47, 0.47, 0.47]}>
      <Root pixelSize={0.001} >
        <UI />
      </Root>
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





export const xrStore = createXRStore({
  controller: {
    right: HandWithWatch,
    left: { model: { colorWrite: false, renderOrder: -1 }, grabPointer: false, rayPointer: false },
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

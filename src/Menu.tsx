import React, { useRef, useState, useEffect, RefObject, ReactNode } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  Group,
  Quaternion,
  Scene as SceneImpl,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRM, VRMUtils, VRMHumanBoneName } from '@pixiv/three-vrm';
import { create } from 'zustand';
import { Text, Fullscreen, Container, getPreferredColorScheme, setPreferredColorScheme, Image, Root } from '@react-three/uikit'
import { Defaults, DialogAnchor, colors, Button, Switch } from "@react-three/uikit-default";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@react-three/uikit-default"
import { Layers, Music, SignalHigh } from '@react-three/uikit-lucide' // Import icons


export const TriplexWrapper = () => {
  return (
    <>
      <Canvas style={{ position: "absolute", inset: "0", touchAction: "none" }} gl={{ localClippingEnabled: true }}>
        <Defaults>
          <Fullscreen
            overflow="scroll"
            scrollbarColor="black"
            backgroundColor="white"
            dark={{ backgroundColor: "black" }}
            flexDirection="column"
            gap={32}
            paddingX={32}
            alignItems="center"
            padding={32}
          >
            <UI />
          </Fullscreen>
        </Defaults>
      </Canvas>
    </>
  )
}



export const UI = () => {
  const [pcs, updatePCS] = useState(() => getPreferredColorScheme())
  // Set dark mode as the base, colors will be adjusted manually
  setPreferredColorScheme('dark')

  // Define colors based on the image (approximations)
  const darkBlueGray = '#2c3e50' // Main background
  const semiTransparentGray = 'rgba(70, 80, 90, 0.6)' // Top section background
  const orange = '#f39c12' // Controls background
  const lightGrayText = '#bdc3c7' // Secondary text
  const whiteText = '#ffffff'

  return (
    <Container
      backgroundColor={darkBlueGray}
      borderRadius={20}
      padding={10}
      flexDirection="column"
      gap={10}
      backgroundOpacity={0.8} // Add some transparency if desired
    // Consider adding a background image texture if possible with uikit/three.js
    >
      {/* Top Section */}
      <Container
        flexDirection="row"
        // justifyContent="space-between" // This is not needed when using a flexGrow spacer
        alignItems="center"
        paddingX={15}
        paddingY={8}
        borderRadius={15}
        backgroundColor={semiTransparentGray}
        backgroundOpacity={0.7}
      >
        {/* Left Side (Time/Date/Duration) */}
        <Container flexDirection="column" flexShrink={0} >
          <Text color={whiteText} fontSize={28} fontWeight="bold">
            06:35 AM
          </Text>
          <Text color={lightGrayText} fontSize={14}>
            Tue 16/01/2024
          </Text>
          <Text color={lightGrayText} fontSize={12}>
            00:03:42
          </Text>
        </Container>

        {/* Spacer Container */}
        <Container padding={14} flexGrow={1} /> {/* Add this expanding spacer */}

        {/* Right Side (Icons) */}
        <Container flexDirection="row" gap={8} alignItems="center" /* marginLeft="auto" REMOVE THIS */ >
          {/* Wrap each icon in a styled Container */}
          <Container padding={24} borderRadius={12} backgroundColor={orange}>
            <Layers color={whiteText} />
          </Container>
          <Container padding={24} borderRadius={12} backgroundColor={orange}>
            <Music color={whiteText} />
          </Container>
          <Container padding={24} borderRadius={12} backgroundColor={orange}>
            <SignalHigh color={whiteText} />
          </Container>
        </Container>
      </Container>

    </Container>
  )
}

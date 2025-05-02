import React, { useRef, useState, useEffect, RefObject, ReactNode } from 'react';
import { useFrame, Canvas, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRMLoaderPlugin, VRM, VRMUtils, VRMHumanBoneName } from '@pixiv/three-vrm';
import { create } from 'zustand';
import { Text, Fullscreen, Container, getPreferredColorScheme, setPreferredColorScheme, Image, Root } from '@react-three/uikit'
import { Defaults, DialogAnchor, colors, Button, Switch } from "@react-three/uikit-default"; // Ensure Button is imported
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
  const [_pcs, _updatePCS] = useState(() => getPreferredColorScheme())
  // Set dark mode as the base, colors will be adjusted manually
  setPreferredColorScheme('dark')

  // Define colors based on the image (approximations)
  const darkBlueGray = '#2c3e50' // Main background
  const semiTransparentGray = 'rgba(70, 80, 90, 0.6)' // Top section background
  const orange = '#f39c12' // Controls background (inactive)
  const lightGrayText = '#bdc3c7' // Secondary text
  const whiteText = '#ffffff'
  const activeOrange = '#a51d1d' // Controls background (active)
  const darkerOrange = '#d35400' // Darker shade for hover when inactive
  const darkerActiveOrange = '#8c1818' // Darker shade for hover when active


  // State for each icon button
  const [layersActive, setLayersActive] = useState(false);
  const [musicActive, setMusicActive] = useState(false);
  const [signalActive, setSignalActive] = useState(false);

  // WebSocket state and ref
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null); // For reconnection attempts

  const connectWebSocket = () => {
    console.log("Attempting to connect WebSocket...");
    // Clear any existing reconnect interval
    if (reconnectInterval.current) {
      clearInterval(reconnectInterval.current);
      reconnectInterval.current = null;
    }

    // Close existing socket if any before creating a new one
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      console.log("Closing existing socket before reconnecting.");
      socketRef.current.close();
    }


    const socket = new WebSocket('ws://localhost:8889'); // Connect to port 8889

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      socketRef.current = socket; // Store the active socket
      // Clear reconnect interval on successful connection
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
      // Send initial state upon connection
      sendStateUpdate(socket, layersActive, musicActive, signalActive);
    };

    socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.reason, event.code);
      setIsConnected(false);
      socketRef.current = null; // Clear the ref
      // Attempt to reconnect after a delay, avoid spamming connection attempts
      if (!reconnectInterval.current) {
        console.log('Attempting to reconnect WebSocket in 5 seconds...');
        reconnectInterval.current = setInterval(connectWebSocket, 5000);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      // The 'onclose' event will likely fire after an error, triggering reconnection logic there.
      // Explicitly close here just in case 'onclose' doesn't fire reliably on all errors.
      socket.close();
    };

    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // Handle incoming messages if needed
    };

    // Assign the potentially connecting socket to the ref immediately
    // This helps prevent race conditions if close is called quickly
    socketRef.current = socket;
  };

  // Effect to establish and manage WebSocket connection
  useEffect(() => {
    connectWebSocket(); // Initial connection attempt

    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket connection.");
      // Clear reconnect interval on unmount
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
      // Close the WebSocket connection if it exists and is open/connecting
      if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
        socketRef.current.onclose = null; // Prevent reconnection attempts during unmount cleanup
        socketRef.current.onerror = null;
        socketRef.current.close();
        console.log("WebSocket connection closed on component unmount.");
      }
      socketRef.current = null;
      setIsConnected(false);
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  // Function to send state update
  const sendStateUpdate = (socket: WebSocket | null, layers: boolean, music: boolean, signal: boolean) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const stateMessage = JSON.stringify({
        type: 'uiState', // Add a type for message identification on the server
        layersActive: layers,
        musicActive: music,
        signalActive: signal,
      });
      console.log('Sending state:', stateMessage);
      socket.send(stateMessage);
    } else {
      console.warn('WebSocket not connected. Cannot send state update.');
    }
  }

  // Effect to send state when button states change and socket is connected
  useEffect(() => {
    sendStateUpdate(socketRef.current, layersActive, musicActive, signalActive);
  }, [layersActive, musicActive, signalActive, isConnected]); // Depend on states and connection status


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
        <Container flexDirection="row" gap={8} alignItems="center" >
          {/* Wrap each icon in a Button */}
          <Button
            padding={24} // Apply padding directly to Button
            borderRadius={12} // Apply borderRadius directly to Button
            backgroundColor={layersActive ? activeOrange : orange} // Conditional background
            onClick={() => setLayersActive(!layersActive)} // Toggle state on click
            hover={{ backgroundColor: layersActive ? darkerActiveOrange : darkerOrange }} // Conditional hover effect
            borderOpacity={0} // Remove default button border
            backgroundOpacity={1} // Ensure button background is opaque
          >
            <Layers color={whiteText} />
          </Button>
          <Button
            padding={24}
            borderRadius={12}
            backgroundColor={musicActive ? activeOrange : orange}
            onClick={() => setMusicActive(!musicActive)}
            hover={{ backgroundColor: musicActive ? darkerActiveOrange : darkerOrange }} // Conditional hover effect
            borderOpacity={0}
            backgroundOpacity={1}
          >
            <Music color={whiteText} />
          </Button>
          <Button
            padding={24}
            borderRadius={12}
            backgroundColor={signalActive ? activeOrange : orange}
            onClick={() => setSignalActive(!signalActive)}
            hover={{ backgroundColor: signalActive ? darkerActiveOrange : darkerOrange }} // Conditional hover effect
            borderOpacity={0}
            backgroundOpacity={1}
          >
            <SignalHigh color={whiteText} />
          </Button>
        </Container>
      </Container>

      {/* Optional: Display connection status */}
      <Container positionType='absolute' top={10} right={10}>
        <Text color={isConnected ? 'lightgreen' : 'red'} fontSize={12}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </Container>

    </Container>
  )
}

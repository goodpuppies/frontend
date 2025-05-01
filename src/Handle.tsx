import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode
} from "react";
import { Group, Vector3Tuple, Quaternion } from 'three';
import { create } from 'zustand'

import {
  OrbitHandles,
  Handle,
  HandleTarget,
  HandleState,
  createScreenCameraStore,
  ScreenCameraStateAndFunctions,
  PivotHandles,
} from '@react-three/handle'


function createDefaultTransformation(x: number, y: number, z: number) {
  return {
    position: [x, y, z] as Vector3Tuple,
    rotation: new Quaternion().toArray(),
    scale: [1, 1, 1] as Vector3Tuple,
  }
}

type ElementType = 'sphere' | 'cube' | 'cone'

const useSceneStore = create(() => ({
  lightPosition: [0.3, 0.3, 0.3] as Vector3Tuple,
  sphereTransformation: createDefaultTransformation(-0.1, 0, 0),
  cubeTransformation: createDefaultTransformation(0.1, 0, 0),
  coneTransformation: createDefaultTransformation(0, 0, 0.1),
  selected: undefined as ElementType | undefined,
}))

export function CustomTransformHandles({
  children,
  size,
}: {
  size?: number
  children?: ReactNode
}) {
  const targetRef = useRef<Group>(null)



  return (
    <HandleTarget ref={targetRef}>
      <Handle targetRef="from-context" >
        {children}
      </Handle>
    </HandleTarget>
  )
}
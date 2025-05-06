// Frame.jsx (Updated)
// Frame.jsx (Enhanced with Hover State)

import { Suspense, useEffect, forwardRef, useState, useRef, ReactNode } from "react";
// Define props type for Frame
import { Group as ThreeGroup } from 'three'; // Import Group from three
import { ThreeElements, } from '@react-three/fiber';

interface FrameProps {
    children?: ReactNode;
}

export const Frame = forwardRef<ThreeGroup, FrameProps>(({ children, ...props }, ref) => {
    const [hovered, setHovered] = useState(false);
    // TODO: Dynamically size the frame based on children bounds
    const width = 0.4;
    const height = 0.2;
    const depth = 0.04;

    return (
        <group
            ref={ref}
            {...props}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {children}
            {/* Frame wireframe - no event handlers on this mesh */}
            <mesh
                // Disable raycasting for this mesh
                raycast={() => null}
                // Remove event handlers from here
                // The mesh should not block pointer events for children
                renderOrder={1} // Optional: Render mesh later if needed for visual layering
            >
                <boxGeometry args={[width, height, depth]} />
                <meshBasicMaterial
                    color={hovered ? "red" : "blue"}
                    wireframe
                    transparent
                    opacity={0.2}
                    depthTest={false} // Optional: Ensure wireframe is visible through children
                />
            </mesh>
        </group>
    );
});
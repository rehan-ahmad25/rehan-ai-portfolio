import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Vector3, MathUtils } from "three";

const NODE_COUNT = 46;

function generateNodes(count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    // Distribute in a loose flattened sphere so it reads as a "network", not a blob.
    const radius = 3.2 + Math.random() * 1.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    nodes.push({
      pos: new Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.55,
        radius * Math.cos(phi) * 0.7
      ),
      speed: 0.15 + Math.random() * 0.25,
      offset: Math.random() * Math.PI * 2,
    });
  }
  return nodes;
}

function buildEdges(nodes, maxDist, maxPerNode) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    let count = 0;
    for (let j = i + 1; j < nodes.length; j++) {
      if (count >= maxPerNode) break;
      const d = nodes[i].pos.distanceTo(nodes[j].pos);
      if (d < maxDist) {
        edges.push([i, j]);
        count++;
      }
    }
  }
  return edges;
}

function Graph() {
  const groupRef = useRef();
  const pointsRef = useRef();
  const nodes = useMemo(() => generateNodes(NODE_COUNT), []);
  const edges = useMemo(() => buildEdges(nodes, 2.1, 3), [nodes]);

  const positions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.pos.x;
      arr[i * 3 + 1] = n.pos.y;
      arr[i * 3 + 2] = n.pos.z;
    });
    return arr;
  }, [nodes]);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 2 * 3);
    edges.forEach(([a, b], i) => {
      arr[i * 6] = nodes[a].pos.x;
      arr[i * 6 + 1] = nodes[a].pos.y;
      arr[i * 6 + 2] = nodes[a].pos.z;
      arr[i * 6 + 3] = nodes[b].pos.x;
      arr[i * 6 + 4] = nodes[b].pos.y;
      arr[i * 6 + 5] = nodes[b].pos.z;
    });
    return arr;
  }, [edges, nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.045;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.08;

      // gentle mouse parallax
      const mx = state.mouse.x * 0.25;
      const my = state.mouse.y * 0.15;
      groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, mx, 0.03);
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, my, 0.03);
    }

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = Math.sin(t * n.speed + n.offset) * 0.06;
        posAttr.array[i * 3 + 1] = n.pos.y + pulse;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4C8DFF" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#7FA9FF"
          size={0.055}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * Decorative neural-graph background. `paused` stops the R3F render loop
 * entirely (used when the hero scrolls out of view) so the GPU/CPU aren't
 * doing work the visitor can't see.
 */
export default function NeuralField({ paused = false }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={paused ? "never" : "always"}
      className="!absolute inset-0"
      aria-hidden="true"
    >
      <Graph />
    </Canvas>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';

// Canvas and scene configuration
const CONFIG = {
  canvas: {
    width: 800,
    height: 600,
  },
  rect: {
    main: {
      width: 400,
      height: 400,
      left: 200,
      top: 100,
    },
    mid: {
      width: 90,
      height: 90,
    },
    small: {
      width: 5,
      height: 5,
    },
  },
  movement: [
    { dx: 1, dy: 0, steps: 200 },   // Right
    { dx: 0, dy: 1, steps: 200 },   // Down
    { dx: -1, dy: 0, steps: 200 },  // Left
    { dx: 0, dy: -1, steps: 200 }   // Up
  ],
  zoom: [
    // Zoom out levels (1.0 to 0.5)
    ...Array.from({ length: 21 }, (_, i) => 1 - i * 0.025),
    // Zoom in levels (0.525 to 1.0)
    ...Array.from({ length: 20 }, (_, i) => 0.5 + (i + 1) * 0.025),
  ]
};

export default function Home() {
  // Canvas and performance state references
  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const canvas1Ref = useRef<fabric.Canvas | null>(null);
  const canvas2Ref = useRef<fabric.Canvas | null>(null);
  const [isMovementRunning, setIsMovementRunning] = useState<boolean>(false);
  const [isZoomRunning, setIsZoomRunning] = useState<boolean>(false);
  const [isPartialMovementRunning, setIsPartialMovementRunning] = useState<boolean>(false);
  const [isPartialZoomRunning, setIsPartialZoomRunning] = useState<boolean>(false);
  const [performance1, setPerformance1] = useState<number>(0);
  const [performance2, setPerformance2] = useState<number>(0);
  const [performance3, setPerformance3] = useState<number>(0);
  const [performance4, setPerformance4] = useState<number>(0);
  const [performance5, setPerformance5] = useState<number>(0);
  const [performance6, setPerformance6] = useState<number>(0);
  const [performance7, setPerformance7] = useState<number>(0);
  const [performance8, setPerformance8] = useState<number>(0);

  // Create scene functions
  const createNonGroupedScene = useCallback((canvas: fabric.Canvas) => {
    // Create main rectangle
    const mainRect = new fabric.Rect({
      ...CONFIG.rect.main,
      fill: 'transparent',
      stroke: 'black',
    });

    // Create mid rectangles with their small rectangles
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const midRect = new fabric.Rect({
          ...CONFIG.rect.mid,
          fill: 'transparent',
          stroke: 'blue',
          left: CONFIG.rect.main.left + 10 + (j * 95),
          top: CONFIG.rect.main.top + 10 + (i * 95),
        });

        // Create small rectangles for this mid rectangle
        for (let k = 0; k < 100; k++) {
          const smallRect = new fabric.Rect({
            ...CONFIG.rect.small,
            fill: 'red',
            left: midRect.left! + Math.random() * 80,
            top: midRect.top! + Math.random() * 80,
          });
          canvas.add(smallRect);
        }
        canvas.add(midRect);
      }
    }
    canvas.add(mainRect);
  }, []);

  const createGroupedScene = useCallback((canvas: fabric.Canvas) => {
    // Create main rectangle
    const mainRect = new fabric.Rect({
      ...CONFIG.rect.main,
      fill: 'transparent',
      stroke: 'black',
    });

    // Create mid rectangles with their small rectangles as groups
    const midGroups = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const midRect = new fabric.Rect({
          ...CONFIG.rect.mid,
          fill: 'transparent',
          stroke: 'blue',
          left: 0,
          top: 0,
        });

        // Create small rectangles for this mid rectangle
        const smallRects = [];
        for (let k = 0; k < 100; k++) {
          const smallRect = new fabric.Rect({
            ...CONFIG.rect.small,
            fill: 'red',
            left: Math.random() * 80,
            top: Math.random() * 80,
          });
          smallRects.push(smallRect);
        }

        // Group mid rectangle with its small rectangles
        const midGroup = new fabric.Group([midRect, ...smallRects], {
          left: CONFIG.rect.main.left + 10 + (j * 95),
          top: CONFIG.rect.main.top + 10 + (i * 95),
        });
        midGroups.push(midGroup);
      }
    }

    // Create final group containing main rectangle and all mid groups
    const finalGroup = new fabric.Group([mainRect, ...midGroups], {
      left: CONFIG.rect.main.left,
      top: CONFIG.rect.main.top,
    });
    canvas.add(finalGroup);
  }, []);

  // Performance measurement functions
  const measurePerformance = useCallback(async (
    testFn: () => Promise<void>,
    setPerformance: (time: number) => void
  ) => {
    const startTime = performance.now();
    await testFn();
    const endTime = performance.now();
    setPerformance(endTime - startTime);
  }, []);

  // Movement test function
  const moveObjects = useCallback(async () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;
    setIsMovementRunning(true);

    // Test movement for non-grouped objects
    await measurePerformance(async () => {
      for (const direction of CONFIG.movement) {
        for (let step = 0; step < direction.steps; step++) {
          canvas1Ref.current?.getObjects().forEach(obj => {
            obj.set({
              left: obj.left! + direction.dx,
              top: obj.top! + direction.dy
            });
          });
          canvas1Ref.current?.renderAll();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }, setPerformance1);

    // Test movement for grouped objects
    await measurePerformance(async () => {
      const group = canvas2Ref.current?.getObjects()[0];
      for (const direction of CONFIG.movement) {
        for (let step = 0; step < direction.steps; step++) {
          group?.set({
            left: group.left! + direction.dx,
            top: group.top! + direction.dy
          });
          canvas2Ref.current?.renderAll();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }, setPerformance2);

    setIsMovementRunning(false);
  }, [measurePerformance]);

  // Zoom test function
  const zoomTest = useCallback(async () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;
    setIsZoomRunning(true);

    // Test zoom for all objects in non-grouped canvas
    await measurePerformance(async () => {
      for (const zoom of CONFIG.zoom) {
        canvas1Ref.current?.getObjects().forEach(obj => {
          obj.scale(zoom);
        });
        canvas1Ref.current?.renderAll();
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }, setPerformance3);

    // Test zoom for all objects in grouped canvas
    await measurePerformance(async () => {
      const group = canvas2Ref.current?.getObjects()[0];
      for (const zoom of CONFIG.zoom) {
        group?.scale(zoom);
        canvas2Ref.current?.renderAll();
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }, setPerformance4);

    setIsZoomRunning(false);
  }, [measurePerformance]);

  // Partial movement test function
  const movePartialObjects = useCallback(async () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;
    setIsPartialMovementRunning(true);

    // Test movement for first mid rectangle and its small rectangles in non-grouped canvas
    await measurePerformance(async () => {
      const objects = canvas1Ref.current?.getObjects();
      const targetObjects = objects?.slice(0, 101); // First mid rect and its 100 small rects

      for (const direction of CONFIG.movement) {
        for (let step = 0; step < direction.steps; step++) {
          targetObjects?.forEach(obj => {
            obj.set({
              left: obj.left! + direction.dx,
              top: obj.top! + direction.dy
            });
          });
          canvas1Ref.current?.renderAll();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }, setPerformance5);

    // Test movement for first mid rectangle and its small rectangles in grouped canvas
    await measurePerformance(async () => {
      const group = canvas2Ref.current?.getObjects()[0] as fabric.Group;
      const targetObject = group.getObjects()[1] as fabric.Group; // First mid group

      for (const direction of CONFIG.movement) {
        for (let step = 0; step < direction.steps; step++) {
          targetObject.set({
            left: targetObject.left! + direction.dx,
            top: targetObject.top! + direction.dy
          });
          canvas2Ref.current?.renderAll();
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }, setPerformance6);

    setIsPartialMovementRunning(false);
  }, [measurePerformance]);

  // Partial zoom test function
  const zoomPartialObjects = useCallback(async () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;
    setIsPartialZoomRunning(true);

    // Store original scales to restore later
    const originalScales = new Map<fabric.Object, number>();

    // Test zoom for first mid rectangle and its small rectangles in non-grouped canvas
    await measurePerformance(async () => {
      const objects = canvas1Ref.current?.getObjects();
      const targetObjects = objects?.slice(0, 101); // First mid rect and its 100 small rects

      for (const zoom of CONFIG.zoom) {
        targetObjects?.forEach(obj => {
          obj.scale(zoom)
        });
        canvas1Ref.current?.renderAll();
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }, setPerformance7);

    // Test zoom for first mid group in grouped canvas
    await measurePerformance(async () => {
      const group = canvas2Ref.current?.getObjects()[0] as fabric.Group;
      const targetObject = group.getObjects()[1] as fabric.Group; // First mid group

      for (const zoom of CONFIG.zoom) {
        targetObject.scale(zoom);
        canvas2Ref.current?.renderAll();
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }, setPerformance8);

    setIsPartialZoomRunning(false);
  }, [measurePerformance]);

  // Initialize canvases on component mount
  useEffect(() => {
    if (!canvasRef1.current || !canvasRef2.current) return;

    canvas1Ref.current = new fabric.Canvas(canvasRef1.current, {
      ...CONFIG.canvas,
    });

    canvas2Ref.current = new fabric.Canvas(canvasRef2.current, {
      ...CONFIG.canvas,
    });

    createNonGroupedScene(canvas1Ref.current);
    createGroupedScene(canvas2Ref.current);

    return () => {
      canvas1Ref.current?.dispose();
      canvas2Ref.current?.dispose();
    };
  }, [createNonGroupedScene, createGroupedScene]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Fabric.js Performance Comparison</h1>
      <div className="flex gap-2 mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={moveObjects}
          disabled={isMovementRunning || isZoomRunning || isPartialMovementRunning || isPartialZoomRunning}
        >
          {isMovementRunning ? 'Movement Test Running...' : 'Start Movement Test'}
        </button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={zoomTest}
          disabled={isMovementRunning || isZoomRunning || isPartialMovementRunning || isPartialZoomRunning}
        >
          {isZoomRunning ? 'Zoom Test Running...' : 'Start Zoom Test'}
        </button>
        <button 
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={movePartialObjects}
          disabled={isMovementRunning || isZoomRunning || isPartialMovementRunning || isPartialZoomRunning}
        >
          {isPartialMovementRunning ? 'Partial Movement Test Running...' : 'Start Partial Movement Test'}
        </button>
        <button 
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={zoomPartialObjects}
          disabled={isMovementRunning || isZoomRunning || isPartialMovementRunning || isPartialZoomRunning}
        >
          {isPartialZoomRunning ? 'Partial Zoom Test Running...' : 'Start Partial Zoom Test'}
        </button>
      </div>
      <div className="flex gap-4">
        <div>
          <h2>Non-Grouped Implementation</h2>
          <canvas ref={canvasRef1} />
          <p>Full Movement Time: {performance1.toFixed(2)}ms</p>
          <p>Full Zoom Time: {performance3.toFixed(2)}ms</p>
          <p>Partial Movement Time: {performance5.toFixed(2)}ms</p>
          <p>Partial Zoom Time: {performance7.toFixed(2)}ms</p>
        </div>
        <div>
          <h2>Grouped Implementation</h2>
          <canvas ref={canvasRef2} />
          <p>Full Movement Time: {performance2.toFixed(2)}ms</p>
          <p>Full Zoom Time: {performance4.toFixed(2)}ms</p>
          <p>Partial Movement Time: {performance6.toFixed(2)}ms</p>
          <p>Partial Zoom Time: {performance8.toFixed(2)}ms</p>
        </div>
      </div>
    </div>
  );
} 
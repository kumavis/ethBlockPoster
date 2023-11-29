import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export function useSvgDraggable(ref, setPosition, initialPosition = { x: 0, y: 0 }) {
  useEffect(() => {
    let translateX = initialPosition.x;
    let translateY = initialPosition.y;
    
    const handleDrag = d3.drag()
      .subject(() => {
        return { x: translateX, y: translateY };
      })
      .on('drag', function(event) {
        translateX = event.x;
        translateY = event.y;
        setPosition({ x: translateX, y: translateY });
      });

    if (ref.current) {
      handleDrag(d3.select(ref.current));
    }
  }, [ref]);
}

export const DraggableComponent = ({ x = 0, y = 0, setPosition, children }) => {
  const [position, setOwnPosition] = useState({ x, y });
  const ref = useRef(null);
  useSvgDraggable(ref, (newPos) => {
    setPosition?.(newPos);
    setOwnPosition(newPos);
  }, position);

  return (
    <g ref={ref} transform={`translate(${position.x}, ${position.y})`}>
      {children}
    </g>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


function useSvgDraggable(ref, setPosition) {
  useEffect(() => {
    let translateX = 0;
    let translateY = 0;
    
    const handleDrag = d3.drag()
      .subject(() => {
        return { x: translateX, y: translateY };
      })
      .on('drag', function(event) {
        setPosition({ x: event.x, y: event.y });
        translateX = event.x;
        translateY = event.y;
      });

    if (ref.current) {
      handleDrag(d3.select(ref.current));
    }
  }, [ref]);
}

export const useRectsController = () => {
  const [rectsValue, setRects] = useState([]);
  const addRect = (rect) => {
    let currentRect = rect;
    setRects(rects => [...rects, rect]);
    return {
      set (newRect) {
        setRects(rects => {
          const index = rects.indexOf(currentRect);
          if (index === -1) return rects
          currentRect = newRect;
          rects[index] = newRect;
          return [...rects];
        })
      },
      remove () {
        setRects(rects => {
          const index = rects.indexOf(currentRect);
          if (index === -1) return rects
          rects.splice(index, 1);
          return [...rects];
        })
      }
    }
  }
  return { rects: rectsValue, addRect };
}

export const GlassEffectComponent = ({ rects, width, height, children }) => {
  // console.log('glass rects', rects);
  // const ref = useRef(null);
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  // useSvgDraggable(ref, setPosition);
  return (
    <>
      <defs>
        <filter id="blur-effect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
        </filter>
        <clipPath id="clip-box">
          {/* <rect x={position.x} y={position.y} width="200" height="100" /> */}
          {rects.map(rect => (
            <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
          ))}
        </clipPath>
        <mask id="inverse-clip">
          <rect x="0" y="0" width={width} height={height} fill="white" />
          {/* <rect x={position.x} y={position.y} width="200" height="100" fill="black" /> */}
          {rects.map(rect => (
            <rect fill="black" x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
          ))}
        </mask>
        {/* <g id='effect-children'>
          {children}
        </g> */}
      </defs>
      {/* <!-- Elements to be filtered --> */}
      <g filter="url(#blur-effect)" clipPath="url(#clip-box)">
        {/* <use xlinkHref="#effect-children" /> */}
        {children}
      </g>
      {/* <!-- Elements to NOT be filtered --> */}
      <g mask="url(#inverse-clip)">
        {/* <use xlinkHref="#effect-children" /> */}
        {children}
      </g>
      {/* <rect ref={ref} x={position.x} y={position.y} width="200" height="100" fill="rgba(0,0,0,0)"/> */}
    </>
  );
}
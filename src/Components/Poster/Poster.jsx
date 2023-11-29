// Poster.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import BlockData from './BlockData';
import { DraggableComponent } from './Draggable';
import { notes } from '../../assets/staticText.json';
import { GlassEffectComponent, useRectsController } from './GlassEffect';

const NoteComponent = ({ addRect, note, x = 0, y = 0, width = 200, height = 20 }) => {
  const rectControllerRef = useRef(null);
  // get rect, cleanup on unmount
  useEffect(() => {
    const rectController = addRect({ x, y, width, height })
    rectControllerRef.current = rectController;
    return () => rectController.remove();
  }, []);
  const setPosition = (newPos) => {
    // console.log('newPos', newPos);
    rectControllerRef.current?.set({ width, height, ...newPos });
  }
  
  return (
    <DraggableComponent x={x} y={y} setPosition={setPosition}>
      <rect width={width} height={height} fill="rgba(0,0,0,0)" fillOpacity="0.5"/>
      <text fill="white">{note.text}</text>
    </DraggableComponent>
  );
}

const Poster = ({ blockInfo }) => {

  const { rects, addRect } = useRectsController();
  // console.log('poster rects', rects);

  return (
    <div className="poster">
      <div className="poster-container">
      <svg width="1000" height="1414" viewBox="0 0 1000 1414" fill="none" xmlns="http://www.w3.org/2000/svg">

        <rect width="1000" height="1414" fill="#1E1E1E"/>

        <DraggableComponent>
          <GlassEffectComponent rects={rects} width="1000" height="1414">
            {blockInfo && <BlockData blockInfo={blockInfo}/>}
          </GlassEffectComponent>
        </DraggableComponent>

        {notes.map((note, index) => (
          <NoteComponent addRect={addRect} note={note} x={330} y={60 + 20 * index}/>
        ))}

      </svg>
      </div>
    </div>
  );
};
export default Poster;

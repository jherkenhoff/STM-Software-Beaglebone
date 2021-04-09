
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react'

const ResizableCancas = styled.canvas`
  height: 100%;
  width: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  position: relative;
`;

const ControlWrapper = styled.div`
  position: absolute;
  top: 5;
  left: 5;
`;

const ZOOM_STEP = 0.3

function ScanView(props) {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [translation, setTranslation] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(0);
  const [mouseDown, setMouseDown] = React.useState(true);
  const [lastMousePos, setLastMousePos] = React.useState({x: 0, y: 0});
  const [pan, setPan] = React.useState({x: 0, y: 0});
  const canvasRef = useRef(null)

  function handleResize(width, height) {
    setSize({width, height})
  }

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    setLastMousePos({x: parseInt(e.clientX), y: parseInt(e.clientY)})
    setMouseDown(true);
  }

  function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    setMouseDown(false);
  }

  function handleMouseMove(e) {

    if (!mouseDown)
      return

    e.preventDefault();
    e.stopPropagation();

    const mouseX = parseInt(e.clientX)
    const mouseY = parseInt(e.clientY)

    const dx = mouseX - lastMousePos.x;
    const dy = mouseY - lastMousePos.y;

    setPan({x: pan.x+dx, y: pan.y+dy})

    // reset the vars for next mousemove
    setLastMousePos({x: mouseX, y: mouseY})
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const myObserver = new ResizeObserver(entries => {
      handleResize(entries[0].contentRect.width, entries[0].contentRect.height)
    });

    myObserver.observe(canvas)

    // canvasRef.current.addEventListener('mousedown', handleMouseDown);
    // canvasRef.current.addEventListener('mouseup', handleMouseUp);
    // canvasRef.current.addEventListener('mousemove', handleMouseMove);


    return () => myObserver.disconnect();
  }, []);

  useEffect(() => {
    console.log("Redraw");
    const canvas = canvasRef.current
    canvas.width = size.width
    canvas.height = size.height
    const ctx = canvas.getContext('2d')

    const scale= size.height / props.scanRange.y * (1+zoom*ZOOM_STEP)

    // Set drawing to center of canvas
    ctx.translate(size.width/2, size.height/2)

    // Handle pan translation
    ctx.translate(pan.x, pan.y)


    // Draw maximum scan range
    ctx.beginPath();
    ctx.rect(-props.scanRange.x/2*scale, -props.scanRange.y/2*scale, props.scanRange.x*scale, props.scanRange.y*scale)
    ctx.stroke()

    // Draw grid
    ctx.beginPath();
    ctx.moveTo(-props.scanRange.x/2*scale, 0)
    ctx.lineTo(props.scanRange.x/2*scale, 0)
    ctx.moveTo(0, -props.scanRange.y/2*scale)
    ctx.lineTo(0, props.scanRange.y/2*scale)
    ctx.stroke()

    // Draw scan bounding box
    ctx.fillStyle = '#EEE'
    ctx.setLineDash([5, 3]);
    ctx.translate(props.boundingBoxPosition.x*scale, -props.boundingBoxPosition.y*scale)
    ctx.rotate(props.boundingBoxRotation*Math.PI/180)
    ctx.beginPath();
    ctx.rect(-props.boundingBoxSize.x*scale/2, -props.boundingBoxSize.y*scale/2, props.boundingBoxSize.x*scale, props.boundingBoxSize.y*scale)
    ctx.fill()
    ctx.stroke()
    ctx.rotate(-props.boundingBoxRotation*Math.PI/180)
    ctx.translate(-props.boundingBoxPosition.x*scale, props.boundingBoxPosition.y*scale)
    ctx.setLineDash([]);

    // Draw pattern lines
    let path = new Path2D();
    props.patternPoints.forEach((item, i) => {
      if (i == 0)
        path.moveTo(item[0]*scale, -item[1]*scale)
      else
        path.lineTo(item[0]*scale, -item[1]*scale)
    });
    ctx.stroke(path);

    // Draw pattern points
    ctx.fillStyle = '#000000'
    props.patternPoints.forEach((item, i) => {
      ctx.beginPath();
      ctx.arc(item[0]*scale, -item[1]*scale, 2, 0, 2*Math.PI);
      ctx.fill()
    });

    // Draw tip position cursor
    ctx.translate(props.currentPosition.x*scale, -props.currentPosition.y*scale)
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2*Math.PI);
    ctx.fill()
    ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.stroke();
    ctx.translate(-props.currentPosition.x*scale, props.currentPosition.y*scale)

    console.log(props.patternPoints);

  }, [props.patternPoints, size, props.boundingBoxSize, props.boundingBoxPosition, props.boundingBoxRotation, zoom, pan]) //, props.currentPosition])

  return (
    <Wrapper>
      <ControlWrapper>
      <Button.Group>
        <Button icon onClick={() => setZoom(zoom-1)}>
          <Icon name='minus' />
        </Button>
        <Button icon onClick={() => setZoom(zoom+1)}>
          <Icon name='plus' />
        </Button>
      </Button.Group>
      </ControlWrapper>
      <ResizableCancas ref={canvasRef}/>
    </Wrapper>
  );
}

ScanView.propTypes = {
  patternPoints: PropTypes.array,
  boundingBoxSize: PropTypes.object,
  boundingBoxPosition: PropTypes.object,
  boundingBoxRotation: PropTypes.number,
  scanRange: PropTypes.object,
  currentPosition: PropTypes.object
};

export default ScanView;

import React, { useState, useRef, useEffect } from 'react'
import PropTypes from "prop-types";
import styled from 'styled-components';
import { Button, Icon, Progress, Transition } from 'semantic-ui-react'

import Voronoi from 'voronoi';
import Gradient from "javascript-color-gradient";

const colorGradient = new Gradient();

const color1 = "#270b52";
const color2 = "#aa2e5d";
const color3 = "#e55b2e";
const color4 = "#f3f68c";

colorGradient.setMidpoint(256);
colorGradient.setGradient(color1, color2, color3, color4);

function val2color(val, min, max) {
  return colorGradient.getColor((val-min)/(max-min)*255 + 1)
}


var voronoi = new Voronoi();
var diagram;

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

const ProgressWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
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


    ctx.save();

    var bbox = {xl: -props.scanRange.x/2, xr: props.scanRange.x/2, yt: -props.scanRange.y/2, yb: props.scanRange.y/2};
    var sites = props.scanResult.points

    console.time("voronoi")
    diagram = voronoi.recycle(diagram)
    diagram = voronoi.compute(sites, bbox);
    console.timeEnd("voronoi")
    console.log(diagram);

		var cells = diagram.cells,
			iCell = cells.length,
			cell,
			halfedges, nHalfedges, iHalfedge, v,
			mustFill;
		while (iCell--) {
			cell = cells[iCell];
			halfedges = cell.halfedges;
			nHalfedges = halfedges.length;
			if (nHalfedges) {
					v = halfedges[0].getStartpoint();
					ctx.beginPath();
					ctx.moveTo(v.x*scale, -v.y*scale);
					for (iHalfedge=0; iHalfedge<nHalfedges; iHalfedge++) {
						v = halfedges[iHalfedge].getEndpoint();
						ctx.lineTo(v.x*scale, -v.y*scale);
						}
            ctx.strokeStyle = val2color(cell.site.adc, props.scanResult.statistics.adc.min, props.scanResult.statistics.adc.max)
            ctx.lineWidth = 0.50;
						ctx.fillStyle = val2color(cell.site.adc, props.scanResult.statistics.adc.min, props.scanResult.statistics.adc.max)
						ctx.fill();
            ctx.stroke()
			}

      // ctx.fillStyle = '#000000'
      // ctx.beginPath();
      // ctx.rect(cell.site.x*scale-1, -cell.site.y*scale-1, 3, 3)
      // ctx.fill()
    }
    ctx.restore();


    if (!props.isScanResultUpToDate) {
      ctx.save();
      ctx.globalAlpha = 0.4;

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

      ctx.restore();
    }


    if (props.isPatternUploaded && !props.isScanResultUpToDate) {
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
    }

    // Draw grid
    ctx.save();
    ctx.globalAlpha = 0.2;
    const divisions = 20
    for (var i = 1; i < divisions; i++) {
      ctx.beginPath();
      // Horizonatal
      let y = props.scanRange.y/divisions * i - props.scanRange.y/2
      ctx.moveTo(-props.scanRange.x/2*scale, y*scale)
      ctx.lineTo(props.scanRange.x/2*scale, y*scale)
      let x = props.scanRange.x/divisions * i - props.scanRange.x/2
      ctx.moveTo(x*scale, -props.scanRange.y/2*scale)
      ctx.lineTo(x*scale, props.scanRange.y/2*scale)
      // ctx.moveTo(0, -props.scanRange.y/2*scale)
      // ctx.lineTo(0, props.scanRange.y/2*scale)
      ctx.stroke()
    }
    ctx.restore();

    // Draw maximum scan range
    ctx.beginPath();
    ctx.rect(-props.scanRange.x/2*scale, -props.scanRange.y/2*scale, props.scanRange.x*scale, props.scanRange.y*scale)
    ctx.stroke()

    // Draw tip position cursor
    ctx.translate(props.currentPosition.x*scale, -props.currentPosition.y*scale)
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, 2*Math.PI);
    ctx.fillStyle = '#000000'
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

  }, [props.patternPoints, size, props.boundingBoxSize, props.boundingBoxPosition, props.boundingBoxRotation, zoom, pan, props.scanResult, props.isPatternUploaded, props.isScanResultUpToDate]) //, props.currentPosition])

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
      <ProgressWrapper>

        <Transition visible={props.scanResult.running} animation='scale' duration={500}>
          <Progress percent={Math.round(props.scanResult.progress)} progress success={props.scanResult.finished}/>
        </Transition>
      </ProgressWrapper>
    </Wrapper>
  );
}

ScanView.propTypes = {
  patternPoints: PropTypes.array,
  boundingBoxSize: PropTypes.object,
  boundingBoxPosition: PropTypes.object,
  boundingBoxRotation: PropTypes.number,
  scanRange: PropTypes.object,
  currentPosition: PropTypes.object,
  scanResult: PropTypes.object,
  isPatternUploaded: PropTypes.bool,
  isScanResultUpToDate: PropTypes.bool
};

export default ScanView;

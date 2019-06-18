import React from 'react';
import './Wire.css';

const BEZIER_OFFSET = 25;

// Convert an SVG element's local coordinates to absolute coordinate space,
// according to:
// https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group
function getAbsoluteBBox(element, svgDocument) {
  const bbox = element.getBBox();
  const x = bbox.x;
  const y = bbox.y;

  const offset = svgDocument.getBoundingClientRect();
  const matrix = element.getScreenCTM();
  return {
    x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
    y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top,
    width: bbox.width,
    height: bbox.height
  };
}

class Wire extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    if (evt.type !== 'contextmenu') {
      return;
    }
    evt.preventDefault();
    this.props.deleteWire(this.props.id);
  }

  computePathD() {
    const fromDom = document.querySelector(
      `.Patch-output [patch-id='${this.props.fromPatch}'][port-name='${this.props.fromPort}']`);
    const toDom = document.querySelector(
      `.Patch-input [patch-id='${this.props.toPatch}'][port-name='${this.props.toPort}']`);
    // DOM elements may be missing on first render
    if (!fromDom || !toDom) {
      return null;
    }

    const svg = document.querySelector('.Workspace-doc');
    const fromBox = getAbsoluteBBox(fromDom, svg);
    const toBox = getAbsoluteBBox(toDom, svg);

    const from = {
      x: fromBox.x + fromBox.width / 2,
      y: fromBox.y + fromBox.height / 2
    }
    const to = {
      x: toBox.x + toBox.width / 2 - 10,
      y: toBox.y + toBox.height / 2
    };

    if (to.x - from.x > -20) {
      // Simple direct curve
      return `M ${from.x},${from.y} C ${from.x + BEZIER_OFFSET},${from.y} ${to.x - BEZIER_OFFSET},${to.y} ${to.x},${to.y}`;
    }

    // Curve that wraps back to the left
    const height = 80;
    const padding = 25;

    const fromDirection = from.y < to.y
      ?  1
      : -1;
    const toDirection = Math.abs(from.y - to.y) < height / 2
      ? fromDirection
      : fromDirection * -1;

    const half = {
      x: to.x + (from.x - to.x) / 2,
      y: Math.min(from.y, to.y) + Math.abs(from.y - to.y) / 2
          + (fromDirection === toDirection ? fromDirection * height / 2 : 0)
    }

    const fromCorner = {
      x: from.x + padding,
      y: from.y + fromDirection * (padding + height / 2)
    };
    const toCorner = {
      x: to.x - padding,
      y: to.y + toDirection * (padding + height / 2)
    };

    return `M ${from.x},${from.y} `
      + `C ${fromCorner.x},${from.y} ${fromCorner.x},${fromCorner.y} ${half.x},${half.y} `
      + `C ${toCorner.x},${toCorner.y} ${toCorner.x},${to.y} ${to.x},${to.y}`;
  }

  render() {
    const pathData = this.computePathD() || '';

    return (
      <path
        className='Wire-line'
        onClick={this.onClick}
        onContextMenu={this.onClick}
        markerEnd='url(#head)'
        d={pathData} />
    );
  }
}

export default Wire;

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
    const from = document.querySelector(
      `.Patch-output [patch-id='${this.props.fromPatch}'][port-name='${this.props.fromPort}']`);
    const to = document.querySelector(
      `.Patch-input [patch-id='${this.props.toPatch}'][port-name='${this.props.toPort}']`);
    // DOM elements may be missing on first render
    if (!from || !to) {
      return null;
    }

    const svg = document.querySelector('.Workspace-doc');
    const fromBox = getAbsoluteBBox(from, svg);
    const x1 = fromBox.x + fromBox.width / 2;
    const y1 = fromBox.y + fromBox.height / 2;

    const toBox = getAbsoluteBBox(to, svg);
    const x2 = toBox.x + toBox.width / 2 - 10;
    const y2 = toBox.y + toBox.height / 2;

    if (x2 - x1 > -20) {
      // Simple direct curve
      return `M${x1},${y1} C${x1 + BEZIER_OFFSET},${y1} ${x2 - BEZIER_OFFSET},${y2} ${x2},${y2}`;
    }

    // Curve that wraps back to the left
    const xh = x2 + (x1 - x2) / 2;
    const dy = Math.abs(y1 - y2);
    const yh = Math.min(y1, y2) + dy / 2 + (dy < 50 ? 75 : 0);
    return `M${x1},${y1} `
      + `C${x1 + BEZIER_OFFSET},${y1} ${x1 + BEZIER_OFFSET},${yh} ${xh},${yh} `
      + `S ${x2 - BEZIER_OFFSET},${y2} ${x2},${y2}`;
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

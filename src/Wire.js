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
  render() {
    const from = document.querySelector(
      `[patch-id='${this.props.fromPatch}'][port-name='${this.props.fromPort}']`);
    const to = document.querySelector(
      `[patch-id='${this.props.toPatch}'][port-name='${this.props.toPort}']`);
    // DOM elements may be missing on first render
    if (!from || !to) {
      return null;
    }

    const svg = document.querySelector(".Workspace-doc");
    const fromBox = getAbsoluteBBox(from, svg);
    const toBox = getAbsoluteBBox(to, svg);

    const x1 = fromBox.x + fromBox.width / 2;
    const y1 = fromBox.y + fromBox.height / 2;
    const x2 = toBox.x + toBox.width / 2;
    const y2 = toBox.y + toBox.height / 2;

    return (
      <path className="Wire-line"
        d={`M${x1},${y1} C${x1 + BEZIER_OFFSET},${y1} ${x2 - BEZIER_OFFSET},${y2} ${x2},${y2}`} />
    );
  }
}

export default Wire;

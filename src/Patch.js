import React from 'react';
import Draggable from 'react-draggable';
import './Patch.css';

class Patch extends React.Component {
  static defaultProps = { width: 120, height: 80 }

  constructor(props) {
    super(props);

    this.onPatchMove = this.onPatchMove.bind(this);
  }

  onPatchMove(evt, data) {
    this.props.onPatchMove(this.props.id, { x: data.x, y: data.y });
  }

  render() {
    return (
      <Draggable defaultPosition={this.props.position} onDrag={this.onPatchMove}>
        <g>
          <rect className="Patch-rect" width={this.props.width} height={this.props.height} rx="8" />

          {
            this.props.inputs.map((input, i) =>
              <circle key={input}
                className="Patch-port"
                patch-id={this.props.id}
                port-name={input}
                r="5"
                cx="0"
                cy={this.portY(i, this.props.inputs.length)}/>
            )
          }

          {
            this.props.outputs.map((output, i) =>
              <circle key={output}
                className="Patch-port"
                patch-id={this.props.id}
                port-name={output}
                r="5"
                cx={this.props.width}
                cy={this.portY(i, this.props.outputs.length)}/>
            )
          }

        </g>
      </Draggable>
    );
  }

  // Calculates Y-coordinate of a port relative to a patch
  portY(i, count) {
    const spacing = 0.2 * this.props.height;
    const totalPortHeight = (count - 1) * spacing;
    return i * spacing + this.props.height / 2 - totalPortHeight / 2;
  }
}

export default Patch;

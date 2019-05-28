import React from 'react';
import Draggable from 'react-draggable';
import './Patch.css';

class Patch extends React.Component {
  static defaultProps = { width: 120, height: 80 }

  constructor(props) {
    super(props);

    this.onPatchMove = this.onPatchMove.bind(this);
    this.onPortSelect = this.onPortSelect.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onPatchMove(evt, data) {
    this.props.onPatchMove(this.props.id, { x: data.x, y: data.y });
  }

  onPortSelect(evt, portName, isInput) {
    this.props.onPortSelect(this.props.id, portName, isInput);
  }

  onClick(evt) {
    if (evt.type !== 'contextmenu') {
      return;
    }
    evt.preventDefault();
    this.props.deletePatch(this.props.id);
  }

  render() {
    return (
      <Draggable handle='.Patch-body' defaultPosition={this.props.position} onDrag={this.onPatchMove}>
        <g>
          <g className='Patch-body'
            onClick={this.onClick}
            onContextMenu={this.onClick}>
            <rect className='Patch-rect'
              width={this.props.width}
              height={this.props.height}
              rx='8' />
            <text className='Patch-name'
              x={this.props.width / 2}
              y={this.props.height / 2}
              width={this.props.width - 16}
              dominantBaseline='middle'
              textAnchor='middle'>
              {this.props.name}
            </text>
          </g>

          {
            this.props.inputs.map((input, i) =>
              <circle key={input}
                className='Patch-port'
                onClick={(evt) => this.onPortSelect(evt, input, true)}
                patch-id={this.props.id}
                port-name={input}
                r='5'
                cx='0'
                cy={this.portY(i, this.props.inputs.length)}/>
            )
          }

          {
            this.props.outputs.map((output, i) =>
              <circle key={output}
                className='Patch-port'
                onClick={(evt) => this.onPortSelect(evt, output, false)}
                patch-id={this.props.id}
                port-name={output}
                r='5'
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

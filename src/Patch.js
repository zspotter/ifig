import React from 'react';
import Draggable from 'react-draggable';
import './Patch.css';

class Patch extends React.Component {
  static defaultProps = { x: 0, y: 0, width: 150, height: 100 }

  constructor(props) {
    super(props);

    this.onPatchMove = this.onPatchMove.bind(this);
  }

  onPatchMove(evt, data) {
    this.props.onPatchMove(this.props.patchId, { x: data.x, y: data.y });
  }

  render() {
    return (
      <Draggable defaultPosition={{x: this.props.x, y: this.props.y}} onDrag={this.onPatchMove}>
        <g>
          <rect className="Patch-rect" width={this.props.width} height={this.props.height} rx="5" />
          <circle className="Patch-port" r="5" cx={this.props.width - 7} cy={this.props.height / 2}/>
          <circle className="Patch-port" r="5" cx={7} cy={this.props.height / 2}/>
        </g>
      </Draggable>
    );
  }
}

export default Patch;

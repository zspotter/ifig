import React from 'react';
import './Wire.css';

class Wire extends React.Component {
  render() {
    return (
      <line className="Wire-line"
        x1={this.props.x1}
        y1={this.props.y1}
        x2={this.props.x2}
        y2={this.props.y2} />
    );
  }
}

export default Wire;

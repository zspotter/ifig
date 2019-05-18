import React from 'react';
import uuid from 'uuid/v4';
import Patch from './Patch';
import Wire from './Wire';
import './Workspace.css';

const SAMPLE_STATE = {
  patches: [
    {
      id: 's1',
      name: 'Supplier 1',
      inputs: [],
      outputs: ['value'],
      position: {x: 100, y: 150}
    },
    {
      id: 's2',
      name: 'Supplier 2',
      inputs: [],
      outputs: ['value'],
      position: {x: 120, y: 500}
    },
    {
      id: 'a1',
      name: 'Adder 1',
      inputs: ['element1', 'element2'],
      outputs: ['sum'],
      position: {x: 400, y: 300}
    },
    {
      id: 'l1',
      name: 'Logger 1',
      inputs: ['message'],
      outputs: [],
      position: {x: 600, y: 300}
    }
  ],
  wires: [
    { id: uuid(), fromPatch: 's1', fromPort: 'value', toPatch: 'a1', toPort: 'element1' },
    { id: uuid(), fromPatch: 's2', fromPort: 'value', toPatch: 'a1', toPort: 'element2' },
    { id: uuid(), fromPatch: 'a1', fromPort: 'sum', toPatch: 'l1', toPort: 'message' }
  ]
};

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      ...props.network
    };
    this.onPatchMove = this.onPatchMove.bind(this);
  }

  onPatchMove(patchId, position) {
    this.setState({
      patches: this.state.patches.map((patch) => {
        if (patch.id === patchId) {
          return { ...patch, position };
        }
        return patch;
      })
    });
  }

  render() {
    return (
      <div className="Workspace">
        <div className="Workspace-view">
          <svg className="Workspace-doc" viewBox="0 0 3000 3000" xmlns="http://www.w3.org/2000/svg">
            <g className="Workspace-active" transform={`scale(${this.state.scale})`}>

              {
                this.state.wires.map((wire) =>
                  <Wire key={wire.id} {...wire} />)
              }
              {
                this.state.patches.map((patch) =>
                  <Patch key={patch.id} {...patch} onPatchMove={this.onPatchMove}/>)
              }

            </g>
          </svg>
        </div>
    </div>
    );
  }
}

export { Workspace, SAMPLE_STATE };

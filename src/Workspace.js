import React from 'react';
import uuid from 'uuid/v4';
import Patch from './Patch';
import PatchModal from './PatchModal';
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

function svgCoords(evt) {
    const svg = document.querySelector('svg');
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selections: {
        lastPort: null
      },
      ui: {
        isModalActive: false
      },
      incompleteWire: { fromPatch:null, fromPort: null, toCoords: null },
      scale: 1,
      ...props.network
    };
    this.onPatchMove = this.onPatchMove.bind(this);
    this.onPortSelect = this.onPortSelect.bind(this);
    this.deleteWire = this.deleteWire.bind(this);
    this.deletePatch = this.deletePatch.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onAddPatch = this.onAddPatch.bind(this);
  }

  onPatchMove(patchId, position) {
    this.setState((state, props) => ({
      patches: state.patches.map((patch) => {
        if (patch.id === patchId) {
          return { ...patch, position };
        }
        return patch;
      })
    }));
  }

  deleteWire(id) {
    this.setState((state, props) => ({
      wires: state.wires.filter((wire) => wire.id !== id)
    }));
  }

  deletePatch(id) {
    this.setState((state, props) => ({
      patches: state.patches.filter((patch) => patch.id !== id),
      wires: state.wires.filter((wire) => wire.fromPatch !== id && wire.toPatch !== id)
    }));
  }

  onPortSelect(patchId, portName, isInput) {
    this.setState((state, props) => {
      if (isInput && state.selections.lastPort) {
        const alreadyConnected = state.wires.find((wire) =>
          wire.fromPatch === state.selections.lastPort.patchId
          && wire.fromPort === state.selections.lastPort.portName
          && wire.toPatch === patchId
          && wire.toPort === portName);
        if (alreadyConnected) {
          // Clear selection
          return { selections: { lastPort: null } };
        } else {
          return {
            // Clear selection
            selections: { lastPort: null },
            // Create new wire
            wires: state.wires.concat([{
              id: uuid(),
              fromPatch: state.selections.lastPort.patchId,
              fromPort: state.selections.lastPort.portName,
              toPatch: patchId,
              toPort: portName
            }])
          };
        }
      }
      return {
        selections: {
          lastPort: {
            patchId: patchId,
            portName: portName
          }
        }
      };
    });
  }

  onCloseModal() {
    this.setState({ ui: { isModalActive: false, lastClickCoords: null }});
  }

  onOpenModal(evt) {
    this.setState({ ui: { isModalActive: true, lastClickCoords: svgCoords(evt) }});
  }

  onAddPatch(patch) {
    const coords = this.state.ui.lastClickCoords;
    const newPatch = {
      id: uuid(),
      name: 'New Patch',
      inputs: ['in1', 'in2'],
      outputs: ['out1', 'out2', 'out3'],
      ...patch,
      position: { x: coords.x - 20, y: coords.y - 20 }
    };

    this.setState((state, props) => ({
      patches: state.patches.concat([newPatch])
    }));
  }

  render() {
    return (
      <div className='Workspace' >

        <PatchModal isActive={this.state.ui.isModalActive} onClose={this.onCloseModal} onAddPatch={this.onAddPatch} />

        <div className='Workspace-view'>
          <div className='Workspace-surface'>
            <svg className='Workspace-doc' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <marker id='head' orient='auto' markerWidth='2' markerHeight='4' refX='0.1' refY='2'>
                  <path d='M0,0 V4 L2,2 Z' fill='black' />
                </marker>
              </defs>
              <g className='Workspace-active' transform={`scale(${this.state.scale})`} >

                <rect className='Workspace-background' width='100%' height='100%' onDoubleClick={this.onOpenModal}/>

                {
                  this.state.wires.map((wire) =>
                    <Wire key={wire.id} {...wire} deleteWire={this.deleteWire}/>)
                }
                {
                  this.state.patches.map((patch) =>
                    <Patch key={patch.id}
                      {...patch}
                      deletePatch={this.deletePatch}
                      onPatchMove={this.onPatchMove}
                      onPortSelect={this.onPortSelect}/>)
                }

              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export { Workspace, SAMPLE_STATE };

import React from 'react';
import Patch from './components/Patch';
import PatchModal from './components/PatchModal';
import Wire from './components/Wire';
import './Workspace.css';

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
      ...props.network.getModel()
    };

    this.onPatchMove = this.onPatchMove.bind(this);
    this.onPortSelect = this.onPortSelect.bind(this);
    this.deleteWire = this.deleteWire.bind(this);
    this.deletePatch = this.deletePatch.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onAddPatch = this.onAddPatch.bind(this);
    this.onToggleStickyPort = this.onToggleStickyPort.bind(this);
    this.onExecute = this.onExecute.bind(this);
  }

  onPatchMove(patchId, position) {
    this.setState((state, props) => {
      this.props.network.updatePatch(patchId, { position: position });
      return this.props.network.getModel();
    });
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
          this.props.network.addWire(
            state.selections.lastPort.patchId,
            state.selections.lastPort.portName,
            patchId,
            portName
          );
          return {
            // Clear selection
            selections: { lastPort: null },
            ...this.props.network.getModel()
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

  deleteWire(id) {
    this.setState((state, props) => {
      this.props.network.deleteWire(id);
      return this.props.network.getModel();
    });
  }

  onCloseModal() {
    this.setState({ ui: { isModalActive: false, lastClickCoords: null }});
  }

  onOpenModal(evt) {
    this.setState({ ui: { isModalActive: true, lastClickCoords: svgCoords(evt) }});
  }

  onAddPatch(patchClass) {
    const coords = this.state.ui.lastClickCoords;

    this.setState((state, props) => {
      this.props.network.addPatch(patchClass, { x: coords.x - 20, y: coords.y - 20 });
      return this.props.network.getModel();
    });
  }

  deletePatch(id) {
    this.setState((state, props) => {
      this.props.network.deletePatch(id);
      return this.props.network.getModel();
    });
  }

  onToggleStickyPort(patchId, inputPort) {
    this.setState((state, props) => {
      this.props.network.toggleStickiness(patchId, inputPort);
      return this.props.network.getModel();
    });
  }

  onExecute() {
    this.props.network.execute();
  }

  render() {
    return (
      <div className='Workspace' >
        <button className='Workspace-exec-btn' onClick={this.onExecute}>Execute</button>

        <PatchModal
          patchRegistry={this.props.network.patchRegistry}
          isActive={this.state.ui.isModalActive}
          onClose={this.onCloseModal}
          onAddPatch={this.onAddPatch} />

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
                      onPortSelect={this.onPortSelect}
                      onToggleStickyPort={this.onToggleStickyPort}/>)
                }

              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default Workspace;

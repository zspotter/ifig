import React from 'react';
import Patch from './components/Patch';
import PatchCreateModal from './components/PatchCreateModal';
import PatchEditModal from './components/PatchEditModal';
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
        activeModal: null,
        patchId: null,
        lastClickCoords: null
      },
      incompleteWire: { fromPatch:null, fromPort: null, toCoords: null },
      scale: 1,
      ...props.network.getModel()
    };

    this.onPatchMove = this.onPatchMove.bind(this);
    this.onPatchEdit = this.onPatchEdit.bind(this);
    this.onPortSelect = this.onPortSelect.bind(this);
    this.deleteWire = this.deleteWire.bind(this);
    this.deletePatch = this.deletePatch.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseCreateModal = this.onCloseCreateModal.bind(this);
    this.onCloseEditModal = this.onCloseEditModal.bind(this);
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

  onPatchEdit(patchId) {
    if (this.props.network.getPatch(patchId).properties) {
      this.setState({ ui: { activeModal: 'PATCH_EDIT', patchId: patchId }});
    }
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

  onOpenModal(evt) {
    this.setState({ ui: { activeModal: 'PATCH_CREATE', lastClickCoords: svgCoords(evt) }});
  }

  onCloseCreateModal() {
    this.setState({ ui: { activeModal: null }});
  }

  onCloseEditModal(id, properties) {
    if (!properties) {
      this.setState({ ui: { activeModal: null }});
      return;
    }

    this.setState((state, props) => {
      this.props.network.updatePatch(id, { properties });
      return {
        ui: { activeModal: null },
        ...this.props.network.getModel()
      };
    });
  }

  onAddPatch(patchClass) {
    const coords = this.state.ui.lastClickCoords;

    this.setState((state, props) => {
      this.props.network.addPatch(patchClass, { position: { x: coords.x - 20, y: coords.y - 20 } });
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

        <PatchCreateModal
          patchRegistry={this.props.network.patchRegistry}
          isActive={this.state.ui.activeModal === 'PATCH_CREATE'}
          onClose={this.onCloseCreateModal}
          onAddPatch={this.onAddPatch} />

        <PatchEditModal
          patchId={this.state.ui.patchId}
          network={this.props.network}
          isActive={this.state.ui.activeModal === 'PATCH_EDIT'}
          onClose={this.onCloseEditModal} />

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
                      onToggleStickyPort={this.onToggleStickyPort}
                      onPatchEdit={this.onPatchEdit}/>)
                }

              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // Force a re-render after the component is first added to the DOM.
    // This is a bit of a hack to hide the DOM issue mentioned in `Wire.computePathD()`
    this.forceUpdate();
  }
}

export default Workspace;

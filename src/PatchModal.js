import React from 'react';
import './PatchModal.css';

const SAMPLE = [
  'numbers/Add',
  'numbers/Subtract',
  'numbers/Divide',
  'numbers/Multiply',
  'numbers/Random',
  'numbers/Range',
  'inputs/Supply',
  'outputs/Log',
  'conditions/Switch',
  'conditions/Filter',
];

class PatchModal extends React.Component {
  static defaultProps = { patches: SAMPLE }

  constructor(props) {
    super(props);

    this.onClickClose = this.onClickClose.bind(this);
    this.onClickPatch = this.onClickPatch.bind(this);
  }

  onClickClose(evt) {
    if (evt.target.classList.contains('PatchModal-container')) {
      this.props.onClose();
    } else {
      // Ignore click events from children
      evt.stopPropagation();
    }
  }

  onClickPatch(evt, patchName) {
    this.props.onAddPatch({ name: patchName });
    this.props.onClose();
  }

  render() {
    const conditionalClass = this.props.isActive ? '' : 'inactive';
    return (
      <div className={'PatchModal-container ' + conditionalClass} onClick={this.onClickClose}>
        <div className='PatchModal-centered'>
          <div className='PatchModal-content'>
            <h2>New Patch</h2>
            <div className='PatchModal-list'>
              <ul>
                {
                  this.props.patches.map((patch) =>
                    <li className='PatchModal-list-item' key={patch}>
                      <button onClick={(evt) => this.onClickPatch(evt, patch)}>{patch}</button>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatchModal;

import React from 'react';
import './PatchModal.css';

class PatchModal extends React.Component {
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

  onClickPatch(evt, patchClass) {
    this.props.onAddPatch(patchClass);
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
                  [...this.props.patchRegistry.patchClasses].map((pair) => {
                    return (<li className='PatchModal-list-item' key={pair[1]}>
                      <button onClick={(evt) => this.onClickPatch(evt, pair[0])}>{pair[1]}</button>
                    </li>);
                  })
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

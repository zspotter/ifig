import React from 'react';
import './PatchModal.css';

class PatchEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.inputs = {};

    this.onClickClose = this.onClickClose.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onClickClose(evt) {
    if (evt.target.classList.contains('PatchModal-container')) {
      this.props.onClose();
    } else {
      // Ignore click events from children
      evt.stopPropagation();
    }
  }

  onSubmit(evt) {
    evt.preventDefault();
    const properties = {};
    for (let key in this.inputs) {
      properties[key] = this.inputs[key].current.value;
    }
    this.props.onClose(this.props.patchId, properties);
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }

    const patch = this.props.network.getPatch(this.props.patchId);
    this.inputs = {};
    for (let key in patch.properties) {
      this.inputs[key] = React.createRef();
    }

    const conditionalClass = this.props.isActive ? '' : 'inactive';
    return (
      <div className={'PatchModal-container ' + conditionalClass} onClick={this.onClickClose}>
        <div className='PatchModal-centered'>
          <div className='PatchModal-content'>
            <h2>Edit {patch.displayName}</h2>
            <div className='PatchModal-list'>
              <form onSubmit={this.onSubmit}>
                {
                  Object.entries(patch.properties).map(([key, value]) => (
                    <label key={key}>
                      {key}:
                      <input type="text" ref={this.inputs[key]} defaultValue={value}/>
                    </label>
                  ))
                }
                <input type="submit" value="Update" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatchEditModal;

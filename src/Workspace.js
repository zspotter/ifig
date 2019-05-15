import React from 'react';
import './Workspace.css';

function Workspace() {
  return (
    <div className="Workspace">
      <svg viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg" stroke="red" fill="grey">

        <rect class="patch" x="100" y="250" width="150" height="100" rx="5" />
        <rect class="patch" x="400" y="400" width="150" height="100" rx="5" />
        <rect class="patch" x="300" y="50" width="150" height="100" rx="5" />
        <line class="wire" x1="250" y1="300" x2="400" y2="450" stroke="black" />
        <line class="wire" x1="250" y1="300" x2="300" y2="100" stroke="black" />
      </svg>
    </div>
  );
}

export default Workspace;

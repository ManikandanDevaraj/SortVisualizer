import React from 'react';
import ReactDOM from 'react-dom';
import SortVisualizer from './SortVisualizer.jsx';

const screen = document.getElementById('screen');

ReactDOM.render(
    <React.Fragment>
        <SortVisualizer />
    </React.Fragment>,
   screen
);

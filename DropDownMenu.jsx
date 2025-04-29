import React from 'react';


export default function DropDownMenu({ items, onChangeHandler , disabled}) {
    return <select className="drop-down-menu" onChange={ event => onChangeHandler(event.target.value) } disabled={disabled}>
        { items.map((item, index) => <option key={index}>{item}</option>) }
    </select>;

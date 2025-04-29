import React, { useState, useRef, useEffect } from 'react';
import Histogram from './Histogram.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import { sorterFactory } from './sortingalgorithms.js';
import { range, shuffled } from './_utilities.js';

const availableAlgorithms = [
    'bubble sort',
    'selection sort',
    'insertion sort',
    'merge sort',
    'quick sort',
    'heap sort',
    'radix sort(LSD)',
    'bogo sort'
];

export default function SortVisualizer() {
    const [data, setData] = useState(shuffled(range(100)));
    const algorithm = useRef(availableAlgorithms[0]);
    const sorter = useRef(sorterFactory(algorithm.current)(data));
    const [isSorting, setSortingState] = useState(false);
    const binColorMapper = useRef(binIndex => 'white');

    useEffect(() => {
        if (!isSorting) return;

        const interval = setInterval(() => {
            const { value, done } = sorter.current.next();
            if (done) {
                binColorMapper.current = binIndex => 'white';
                setSortingState(false);
            } else {
                binColorMapper.current = value.binColorMapper;
                setData(data => [...value.arr]);
            }
        }, (10 / data.length) * 100);

        return () => clearTimeout(interval);
    }, [isSorting]);

    const utilityComponents = (
        <div className="utility-components-container">
            <div>
                <button className="volume-off"></button>
                <DropDownMenu
                    items={availableAlgorithms}
                    onChangeHandler={selectedOption => {
                        algorithm.current = selectedOption;
                        sorter.current = sorterFactory(algorithm.current)(data);
                    }}
                    disabled={isSorting}
                />
            </div>
            <div>
                <button
                    className={!isSorting ? 'utility-button' : 'disabled'}
                    onClick={() => setSortingState(true)}
                >
                    sort
                </button>
                <button
                    className={!isSorting ? 'utility-button' : 'disabled'}
                    onClick={() => {
                        const shuffledData = [...shuffled(data)];
                        sorter.current = sorterFactory(algorithm.current)(shuffledData);
                        setData(shuffledData);
                    }}
                >
                    shuffle
                </button>
                <input
                    type="range"
                    min="10"
                    max="200"
                    value={String(data.length)}
                    step="10"
                    onChange={event => {
                        event.persist(); // Required in React 16
                        const shuffledData = [...shuffled(range(parseInt(event.target.value)))];
                        sorter.current = sorterFactory(algorithm.current)(shuffledData);
                        setData([...shuffledData]);
                    }}
                    disabled={isSorting}
                />
            </div>
        </div>
    );

    return (
        <div className="sort-visualizer-container">
            {utilityComponents}
            <Histogram
                data={data}
                binColorMapper={binColorMapper.current}
            />
        </div>
    );
                    

import React from 'react';

export default function Histogram({ data, binColorMapper }) {
    const highestBin = Math.max(...data);

    const bins = data.map((item, index) => (
        <div
            key={index}
            style={{
                backgroundColor: binColorMapper(index),
                height: `${(item / highestBin) * 100}%`,
                width: `${100 / data.length}%`,
                border: '.5px solid black'
            }}
        />
    ));

    const histogram = <div className="histogram-container">{bins}</div>;

    return histogram;

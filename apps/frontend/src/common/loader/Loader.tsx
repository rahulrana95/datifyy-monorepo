import React from 'react';
import './Loader.css';

const Loader: React.FC = ({ text = 'Loading Love...' }: { text?: string }) => {
    return (
        <div className="alllove">
            <span className="love love1 glyphicon glyphicon-heart"></span>
            <span className="love love2 glyphicon glyphicon-heart"></span>
            <span className="love love3 glyphicon glyphicon-heart"></span>
            <span className="love love4 glyphicon glyphicon-heart"></span>
            <span className="love love5 glyphicon glyphicon-heart"></span>
            <h1>{text}</h1>
        </div>
    );
};

export default Loader;
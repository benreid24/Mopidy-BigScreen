import React from 'react';

import './Scrubber.css';

const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export interface SCrubberProps {
    //
}

export const Scrubber: React.FC<SCrubberProps> = ({}) => {
    const currentTime = 93 * 1000;
    const duration = 180 * 1000;
    
    return (
        <div className='scrubberContainer'>
            <p className='scrubberLabel'>{formatTime(currentTime)}</p>
            <div className='scrubberUnplayed'>
                <div className='scrubberPlayed' style={{width: `${currentTime / duration * 100}%`}}/>
            </div>
            <p className='scrubberLabel'>{formatTime(duration)}</p>
        </div>
    )
}
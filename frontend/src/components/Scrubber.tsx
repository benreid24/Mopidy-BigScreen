import React from 'react';
import Mopidy from 'mopidy';

import './Scrubber.css';

const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const SyncInterval = 100; // ms

export interface SCrubberProps {
    client: Mopidy;
    duration: number;
}

export const Scrubber: React.FC<SCrubberProps> = ({client, duration}) => {
    const [currentTime, setCurrentTime] = React.useState<number>(0);

    React.useEffect(() => {
        let syncTimeoutId: number;
        const syncPlaytime = async () => {
            const actual = await client.playback?.getTimePosition();
            console.log(`Time: ${actual}`);
            if (actual) {
                setCurrentTime(cur => actual >= 1000 ? Math.max(cur, actual) : actual);
            }

            syncTimeoutId = window.setTimeout(syncPlaytime, SyncInterval);
        };
        syncTimeoutId = window.setTimeout(syncPlaytime, SyncInterval);

        return () => {
            clearTimeout(syncTimeoutId);
        };
    }, [client]);
    
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
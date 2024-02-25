import React from 'react';
import Mopidy from 'mopidy';
import {Track} from './components/Track';

import './Content.css';

export interface ContentProps {
    client: Mopidy;
    track: Mopidy.models.TlTrack;
}

export const Content: React.FC<ContentProps> = ({client, track}) => {
    return (
        <div className='content'>
            <div className='columnContainer'>
                <div className='sideColumn'>
                    {/* TODO */}
                </div>
                <div className='centerColumn'>
                    <Track client={client} track={track} />
                </div>
                <div className='sideColumn'>
                    {/* TODO */}
                </div>
            </div>
        </div>
    )
}

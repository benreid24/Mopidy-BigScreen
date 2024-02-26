import React from 'react';
import Mopidy from 'mopidy';
import {Scrubber} from './Scrubber';
import {AlbumArt} from './AlbumArt';
import {getArtist} from '../Util';

import './Track.css';

export interface TrackProps {
    client: Mopidy;
    track: Mopidy.models.TlTrack;
}

export const Track: React.FC<TrackProps> = ({client, track}) => {
    const artist = getArtist(track.track);

    return (
        <div className='trackContainer'>
            <AlbumArt client={client} track={track.track} className='trackArt'/>
            <h1 className='trackTitle'>{track.track.name}</h1>
            <h2 className='artistTitle'>{artist}</h2>
            <Scrubber client={client} duration={track.track.length}/>
        </div>
    )
}

import React from 'react';
import Mopidy from 'mopidy';
import {Scrubber} from './Scrubber';
import {AlbumArt} from './AlbumArt';
import {getArtist} from '../Util';

import './Track.css';

const computeFontSize = (text: string): string => {
    if (text.length < 48) {
        return '8vh';
    }
    if (text.length < 64) {
        return '6vh';
    }
    return '4vh';
}

export interface TrackProps {
    client: Mopidy;
    track: Mopidy.models.TlTrack;
}

export const Track: React.FC<TrackProps> = ({client, track}) => {
    const title = track.track.name;
    const artist = getArtist(track.track);

    return (
        <div className='trackContainer'>
            <AlbumArt client={client} track={track.track} className='trackArt'/>
            <h1 className='trackTitle' style={{fontSize: computeFontSize(title)}}>{title}</h1>
            <h2 className='artistTitle'>{artist}</h2>
            <Scrubber client={client} duration={track.track.length}/>
        </div>
    )
}

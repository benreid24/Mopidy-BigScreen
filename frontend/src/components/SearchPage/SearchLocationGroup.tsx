import React from 'react';
import Mopidy from 'mopidy';
import {AlbumArt} from '../AlbumArt';
import {getArtist} from '../../Util';
import {SchemePrefixToName} from '../../Constants';

import './SearchLocationGroup.css';

interface ResultTrackProps {
    client: Mopidy;
    track: Mopidy.models.Track;
    index: number;
}

const ResultTrack: React.FC<ResultTrackProps> = ({client, track, index}) => {
    const className = index % 2 === 0 ? 'resultTrack' : 'resultTrackAlt';

    return (
        <div className={`resultTrackContainer ${className}`}>
            <div className='resultTrackArtContainer'>
                <AlbumArt client={client} track={track} className='resultTrackArt'/>
            </div>
            <div className='resultTrackCenterColumn'>
                <h2 className='resultTrackTitle'>{track.name}</h2>
                <h3 className='resultTrackArtist'>{getArtist(track)}</h3>
            </div>
        </div>
    );
}

export interface SearchLocationGroupProps {
    client: Mopidy;
    results: Mopidy.models.SearchResult;
}

export const SearchLocationGroup: React.FC<SearchLocationGroupProps> = ({client, results}) => {
    const backend = results.uri.split(':')[0];
    const name = SchemePrefixToName[backend] ? SchemePrefixToName[backend] : backend;

    const filtered = results.tracks.filter(track => track.name.length > 0);
    const limited = filtered.slice(0, 6);

    return (
        <div className='searchLocationGroup'>
            <h2 className='searchLocationTitle'>{name}</h2>
            <div className='searchLocationResultsContainer'>
                {limited.map((track, i) => <ResultTrack key={track.uri} client={client} track={track} index={i}/>)}
            </div>
        </div>
    );
}

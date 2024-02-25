import React from 'react';
import Mopidy from 'mopidy';
import Spinner from './Spinner';
import {Scrubber} from './Scrubber';

import './Track.css';

export interface TrackProps {
    client: Mopidy;
    track: Mopidy.models.TlTrack;
}

export const Track: React.FC<TrackProps> = ({client, track}) => {
    const [albumArt, setAlbumArt] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        client.library?.getImages({uris: [track.track.uri]}).then((result) => {
            const imgs = result[track.track.uri];
            if (imgs.length > 0) {
                const biggest = imgs.reduce(
                    (cur, next) => !cur || next.width > cur.width ? next : cur
                );
                setAlbumArt(biggest.uri);
            }
            else {
                setAlbumArt('fish.webp');
            }
        });
    }, [track, client]);

    const artist = track.track.artists.map(artist => artist.name).join(' | ');

    return (
        <div className='trackContainer'>
            {albumArt ? <img className='trackArt' src={albumArt}/> : <Spinner/>}
            <h1 className='trackTitle'>{track.track.name}</h1>
            <h2 className='artistTitle'>{artist}</h2>
            <Scrubber/>
        </div>
    )
}

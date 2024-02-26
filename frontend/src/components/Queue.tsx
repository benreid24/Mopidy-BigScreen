import React from 'react';
import Mopidy from 'mopidy';
import {AlbumArt} from './AlbumArt';
import {getArtist} from '../Util';

import './Queue.css';

interface QueueTrackProps {
    client: Mopidy;
    track: Mopidy.models.TlTrack;
    index: number;
}

const QueueTrack: React.FC<QueueTrackProps> = ({client, track, index}) => {
    const className = index % 2 === 0 ? 'queueTrack' : 'queueTrackAlt';

    return (
        <div className={`queueTrackContainer ${className}`}>
            <div className='queueTrackArtContainer'>
                <AlbumArt client={client} track={track.track} className='queueTrackArt'/>
            </div>
            <div className='queueTrackCenterColumn'>
                <h2 className='queueTrackTitle'>{track.track.name}</h2>
                <h3 className='queueTrackArtist'>{getArtist(track.track)}</h3>
            </div>
        </div>
    );
}

export interface QueueProps {
    client: Mopidy;
}

export const Queue: React.FC<QueueProps> = ({client}) => {
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [trackList, setTrackList] = React.useState<Mopidy.models.TlTrack[]>([]);
    const [renderedTracks, setRenderedTracks] = React.useState<Mopidy.models.TlTrack[]>([]);

    React.useEffect(() => {
        const sliceSize = Math.min(25, trackList.length);
        const start = currentIndex + 1;
        const newTracks = trackList.slice(currentIndex + 1, start + sliceSize);

        if (newTracks.length < sliceSize) {
            newTracks.push(
                ...trackList.slice(
                    0, Math.min(sliceSize - newTracks.length, currentIndex)
                )
            );
        }

        setRenderedTracks(newTracks);
    }, [client, setRenderedTracks, trackList, currentIndex]);

    const updateTrackList = React.useCallback(async () => {
        const tracks = await client.tracklist?.getTlTracks();
        if (tracks) {
            setTrackList(tracks);
        }
    }, [client, setTrackList]);

    const updateIndex = React.useCallback(async ({tl_track}: {tl_track: Mopidy.models.TlTrack}) => {
        const ni = await client.tracklist?.index({tl_track});
        if (ni !== null && ni !== undefined) {
            setCurrentIndex(ni);
        }
    }, [client, setCurrentIndex]);

    React.useEffect(() => {
        client.on('event:tracklistChanged', updateTrackList);
        client.on('event:trackPlaybackStarted', updateIndex);

        updateTrackList();
        client.playback?.getCurrentTlTrack().then(track => {
            if (track) {
                updateIndex({tl_track: track});
            }
        });

        return () => {
            client.off('event:tracklistChanged', updateTrackList);
            client.off('event:trackPlaybackStarted', updateIndex);
        };
    }, [client, updateIndex, updateTrackList]);

    return (
        <div className='queueContainer'>
            <h1 className='queueTitle'>Up next</h1>
            {renderedTracks.map((track, index) => <QueueTrack key={track.tlid} client={client} track={track} index={index}/>)}
            {renderedTracks.length >= 14 && <div className='queueCover'/>}
        </div>
    );
}

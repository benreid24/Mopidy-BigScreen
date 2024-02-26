import React from 'react';
import Mopidy from 'mopidy';
import {Track} from './components/Track';
import {Queue} from './components/Queue';
import {AddPanel} from './components/AddPanel';

import './Content.css';
import Spinner from './components/Spinner';

export interface ContentProps {
    client: Mopidy;
}

export const Content: React.FC<ContentProps> = ({client}) => {
    const [currentTrack, setCurrentTrack] = React.useState<Mopidy.models.TlTrack | undefined>(undefined);

    React.useEffect(() => {
        client.playback?.getCurrentTlTrack().then((track) => {
            if (!currentTrack && track) {
                setCurrentTrack(track);
            }
        });

        const onTrackHandler = ({tl_track}: {tl_track: Mopidy.models.TlTrack}) => {
            setCurrentTrack(tl_track);
        };

        client.on('event:trackPlaybackStarted', onTrackHandler);

        return () => {
            client.off('event:trackPlaybackStarted', onTrackHandler);
        };
    }, [currentTrack, setCurrentTrack]);

    if (!currentTrack) {
        return <Spinner/>;
    }

    return (
        <div className='content'>
            <div className='columnContainer'>
                <div className='sideColumn'>
                    <Queue client={client}/>
                </div>
                <div className='centerColumn'>
                    <Track client={client} track={currentTrack} />
                </div>
                <div className='sideColumn'>
                    <AddPanel/>
                </div>
            </div>
        </div>
    );
}

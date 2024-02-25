import React from 'react';
import Mopidy from "mopidy";
import Spinner from './components/Spinner';
import {Content} from './Content';

import './App.css';

const options: Mopidy.Options = {
  webSocketUrl: 'ws://192.168.0.100:6680/mopidy/ws',
};

const client = new Mopidy(options);

export function App() {
  const [currentTrack, setCurrentTrack] = React.useState<Mopidy.models.TlTrack | undefined>(undefined);

  React.useEffect(() => {
    const playbackStateChangeCb = (
      {old_state, new_state}: {old_state: Mopidy.core.PlaybackState, new_state: Mopidy.core.PlaybackState}
      ) => {
        // playing, paused, stopped
    };

    client.on('event:playbackStateChanged', playbackStateChangeCb);
    client.on('event:streamTitleChanged', ({title}: {title: string}) => {
      console.log(`Track: ${title}`);
    });
    client.on('state:online', () => {
      client.playback?.getCurrentTlTrack().then((track) => {
        if (!currentTrack && track) {
          setCurrentTrack(track);
        }
      })
    });
  }, []);

  return (
    <div className="App">
      {currentTrack ? <Content client={client} track={currentTrack}/> : <Spinner/>}
    </div>
  );
}

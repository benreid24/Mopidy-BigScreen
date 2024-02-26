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
    const onLoadHandler = () => {
      client.playback?.getCurrentTlTrack().then((track) => {
        if (!currentTrack && track) {
          setCurrentTrack(track);
        }
      })
    };

    const onTrackHandler = ({tl_track}: {tl_track: Mopidy.models.TlTrack}) => {
      setCurrentTrack(tl_track);
    };

    const logger = (arg: any) => console.log(JSON.stringify(arg));
    
    client.on('event', logger);
    client.on('state:online', onLoadHandler);
    client.on('event:trackPlaybackStarted', onTrackHandler);

    return () => {
      client.off('state:online', onLoadHandler);
      client.off('event:trackPlaybackStarted', onTrackHandler);
    }
  }, [currentTrack, setCurrentTrack]);

  return (
    <div className="App">
      {currentTrack ? <Content client={client} track={currentTrack}/> : <Spinner/>}
    </div>
  );
}

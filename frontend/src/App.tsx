import React from 'react';
import Mopidy from "mopidy";
import Spinner from './components/Spinner';
import {Content} from './Content';

import './App.css';

const getServerUrl = (): string => {
    const isHttps = window.location.protocol === 'https:';

    const devServer = 'ws://192.168.0.100:6680/mopidy/ws';
    const prodServer = `${isHttps ? 'wss' : 'ws'}://${window.location.host}`;

    return process.env.NODE_ENV === 'development' ? devServer : prodServer;
}

const options: Mopidy.Options = {
    webSocketUrl: getServerUrl(),
    autoConnect: true,
};

const client = new Mopidy(options);

export function App() {
    const [connected, setConnected] = React.useState<boolean>(false);

    React.useEffect(() => {
        const onConnect = () => {
            setConnected(true);
        };
        const onDisconnect = () => {
            setConnected(false);
        };

        client.on('state:online', onConnect);
        client.on('state:offline', onDisconnect);

        return () => {
            client.off('state:online', onConnect);
            client.off('state:offline', onDisconnect);
        };
    }, [setConnected]);

    return (
        <div className="App">
            {connected ? <Content client={client}/> : <Spinner/>}
        </div>
    );
}

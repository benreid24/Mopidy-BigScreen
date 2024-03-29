import React from 'react';
import Mopidy from "mopidy";
import Spinner from './components/Spinner';
import {Content} from './Content';
import {PageParam, SearchPageName} from './Constants';
import {SearchPage} from './SearchPage';

import './App.css';

const getServerUrl = (): string => {
    const isHttps = window.location.protocol === 'https:';

    const devServer = 'ws://192.168.0.100:6680/mopidy/ws';
    const prodServer = `${isHttps ? 'wss' : 'ws'}://${window.location.host}/mopidy/ws`;

    return process.env.NODE_ENV === 'development' ? devServer : prodServer;
}

const options: Mopidy.Options = {
    webSocketUrl: getServerUrl(),
    autoConnect: true,
};

const client = new Mopidy(options);

function resolvePage(connected: boolean): React.ReactNode {
    if (!connected) {
        return <Spinner/>;
    }

    const params = new URLSearchParams(window.location.search);
    const page = params.get(PageParam);

    if (page === SearchPageName) {
        return <SearchPage client={client}/>
    }

    return <Content client={client}/>;
}

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
            {resolvePage(connected)}
        </div>
    );
}

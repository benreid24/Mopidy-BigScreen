import React from 'react';
import QRCode from "react-qr-code";
import Spinner from './Spinner';
import {PageParam, SearchPage} from '../Constants';

import './AddPanel.css';

const getUrl = async (): Promise<string> => {
    // TODO - fetch from backend
    await new Promise(resolve => setTimeout(resolve, 800));
    const configUrl = null;
    if (configUrl) {
        return configUrl;
    }

    const currentUrl = new URL(window.location.toString());
    currentUrl.searchParams.set(PageParam, SearchPage);
    return currentUrl.toString();
}

export const AddPanel: React.FC = () => {
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        getUrl().then(setUrl);
    }, [setUrl]);

    console.log(url);

    return (
        <div className='addPanel'>
            <h1 className='addPanelTitle'>Add a song</h1>
            {url ? <QRCode className='addQrCode' value={url} size={300}/> : <Spinner/>}
        </div>
    );
}

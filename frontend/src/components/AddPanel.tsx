import React from 'react';
import QRCode from "react-qr-code";
import Spinner from './Spinner';
import {getAddSongUrl} from '../Util';

import './AddPanel.css';



export const AddPanel: React.FC = () => {
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        getAddSongUrl().then(setUrl);
    }, [setUrl]);

    return (
        <div className='addPanel'>
            <h1 className='addPanelTitle'>Add a song</h1>
            {url ? <QRCode className='addQrCode' value={url} size={300}/> : <Spinner/>}
            {url && <p className='addPanelUrl'>{url}</p>}
        </div>
    );
}

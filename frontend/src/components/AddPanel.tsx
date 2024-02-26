import React from 'react';
import QRCode from "react-qr-code";

import './AddPanel.css';

// TODO - get from extension config on backend
const url = 'http://192.168.0.100:6680';

export const AddPanel: React.FC = ({}) => {
    return (
        <div className='addPanel'>
            <h1 className='addPanelTitle'>Add a song</h1>
            <QRCode className='addQrCode' value={url} size={300}/>
        </div>
    );
}

import React from 'react';
import Mopidy from 'mopidy';

import './PostAdd.css';

export interface PostAddProps {
    track: Mopidy.models.Track;
    addAnother: () => void;
}

export const PostAdd: React.FC<PostAddProps> = ({track, addAnother}) => {
    return (
        <div className='postAddContainer'>
            <h1 className='postAddTitle'>Added song!</h1>
            <p className='postAddContent'>Successfully queued for playback</p>
            <p className='postAddTrackName'>{track.name}</p>
            <button className='postAddDoAgain' onClick={addAnother}>Add another</button>
        </div>
    );
}

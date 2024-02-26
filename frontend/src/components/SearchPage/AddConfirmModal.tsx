import React from 'react';
import Mopidy from 'mopidy';

import './AddConfirmModal.css';

export interface AddConfirmModalProps {
    track: Mopidy.models.Track;
    onChoice: (confirmed: boolean) => void;
}

export const AddConfirmModal: React.FC<AddConfirmModalProps> = ({track, onChoice}) => {
    return (
        <div className='addConfirmModalBacker'>
            <div className='addConfirmModal'>
                <h1 className='addConfirmTitle'>Add song?</h1>
                <p className='addConfirmTrack'>{track.name}</p>
                <div className='addConfirmButtonContainer'>
                    <button className='addConfirmYes addConfirmButton' onClick={() => onChoice(true)}>Add song</button>
                    <button className='addConfirmNo addConfirmButton' onClick={() => onChoice(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

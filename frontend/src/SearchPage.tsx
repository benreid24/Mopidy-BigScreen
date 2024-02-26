import React from 'react';
import Mopidy from 'mopidy';
import {SearchMode} from './components/SearchPage/SearchMode';

import './SearchPage.css';

export enum SearchPageState {
    Searching,
    ConfirmingAdd,
    PostAdd
};

export interface SearchPageParams {
    client: Mopidy;
}

export const SearchPage: React.FC<SearchPageParams> = ({client}) => {
    const [mode, setMode] = React.useState<SearchPageState>(SearchPageState.Searching);

    const onTrackAdd = React.useCallback(async (track: Mopidy.models.Track) => {
        // TODO
    }, []);

    return (
        <div className='searchPageContainer'>
            <h1 className='searchPageTitle'>Add a song</h1>
            {mode !== SearchPageState.PostAdd && <SearchMode client={client} onSelect={onTrackAdd}/>}
            {/* TODO - modal for add confirm */}
            {/* TODO - track added page */}
        </div>
    );
}

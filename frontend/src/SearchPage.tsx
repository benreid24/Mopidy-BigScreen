import React from 'react';
import Mopidy from 'mopidy';
import {SearchMode} from './components/SearchPage/SearchMode';
import {AddConfirmModal} from './components/SearchPage/AddConfirmModal';
import {PostAdd} from './components/SearchPage/PostAdd';

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
    const [selectedTrack, setSelectedTrack] = React.useState<Mopidy.models.Track | null>(null);

    const onTrackAdd = React.useCallback((track: Mopidy.models.Track) => {
        setMode(SearchPageState.ConfirmingAdd);
        setSelectedTrack(track);
    }, [setMode, setSelectedTrack]);

    const onAddConfirm = React.useCallback(async (confirmed: boolean) => {
        if (confirmed && selectedTrack) {
            const currentTrack = await client?.playback?.getCurrentTlTrack();
            const currentIndex = await client.tracklist?.index({tl_track: currentTrack ? currentTrack : undefined});
            const addIndex = currentIndex !== null && currentIndex !== undefined ? currentIndex + 1 : undefined;
            await client.tracklist?.add({tracks: [selectedTrack], at_position: addIndex});
        }
        setMode(confirmed ? SearchPageState.PostAdd : SearchPageState.Searching);
    }, [selectedTrack, setSelectedTrack, setMode]);

    const startOver = React.useCallback(() => {
        setSelectedTrack(null);
        setMode(SearchPageState.Searching);
    }, [setSelectedTrack, setMode]);

    return (
        <div className='searchPageContainer'>
            {mode !== SearchPageState.PostAdd && <h1 className='searchPageTitle'>Add a song</h1>}
            {mode !== SearchPageState.PostAdd && <SearchMode client={client} onSelect={onTrackAdd}/>}
            {mode === SearchPageState.ConfirmingAdd && <AddConfirmModal track={selectedTrack!} onChoice={onAddConfirm}/>}
            {mode === SearchPageState.PostAdd && <PostAdd track={selectedTrack!} addAnother={startOver}/>}
        </div>
    );
}

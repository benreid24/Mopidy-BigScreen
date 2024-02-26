import React from 'react';
import Mopidy from 'mopidy';
import Spinner from '../Spinner';
import {SearchLocationGroup} from './SearchLocationGroup';

import './SearchMode.css';

interface SearchResultsProps {
    client: Mopidy;
    results: Mopidy.models.SearchResult[] | null;
    onSelect: (track: Mopidy.models.Track) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({client, results, onSelect}) => {
    if (results === null) {
        return <div/>;
    }

    const filtered = results.filter(result => result.tracks);

    if (filtered.length === 0) {
        return <p>No results</p>;
    }
    
    return (
        <div>
            {filtered.map(result => <SearchLocationGroup key={result.uri} client={client} results={result} onSelect={onSelect}/>)}
        </div>
    );
}

const SearchSpinner = () => {
    return (
        <div className='searchSpinner'>
            <Spinner/>
        </div>
    );
}

export interface SearchModeProps {
    client: Mopidy;
    onSelect: (track: Mopidy.models.Track) => void;
}

export const SearchMode: React.FC<SearchModeProps> = ({client, onSelect}) => {
    const [searchText, setSearchText] = React.useState<string>('');
    const [searchResults, setSearchResults] = React.useState<Mopidy.models.SearchResult[] | null>(null);
    const [pending, setIsPending] = React.useState<boolean>(false);

    const doSearch = React.useCallback(async (event: any) => {
        event.preventDefault();
        setIsPending(true);
        
        const results = await client.library?.search({query: {any: [searchText]}});
        if (results !== undefined) {
            setIsPending(false);
            setSearchResults(results);
        }
    }, [client, searchText, setIsPending, setSearchResults]);

    return (
        <div className='searchModeContainer'>
            <form className='searchBarContainer' onSubmit={doSearch}>
                <input 
                    className='searchBar'
                    type='text'
                    value={searchText}
                    onChange={event => setSearchText(event.target.value)}
                    placeholder='Search for a song'
                />
                <input
                    className='searchButton'
                    type='submit'
                    value='Search'
                    onClick={doSearch}
                />
            </form>
            <div className='searchResultsContainer'>
                {pending ? <SearchSpinner/> : <SearchResults client={client} results={searchResults} onSelect={onSelect}/>}
            </div>
        </div>
    )
}

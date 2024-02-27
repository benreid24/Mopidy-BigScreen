import Mopidy from 'mopidy';
import {ArtPlaceholder} from './Constants';
import {PageParam, SearchPageName} from './Constants';

const artCache: Record<string, string> = {};

export const getArtist = (track: Mopidy.models.Track): string => {
    if (!track.artists) {
        return '';
    }
    return track.artists.map(artist => artist.name).join(' | ');
}

export const getAlbumArt = async (client: Mopidy, track: Mopidy.models.Track): Promise<string | null> => {
    if (artCache[track.uri]) {
        return artCache[track.uri];
    }

    const result = await client.library?.getImages({uris: [track.uri]});
    if (result === undefined) {
        return null;
    }
    const images = result[track.uri];
    if (images.length === 0) {
        artCache[track.uri] = ArtPlaceholder;
        return ArtPlaceholder;
    }
    const image = images.reduce(
        (cur, next) => !cur || next.width > cur.width ? next : cur
    ).uri;
    artCache[track.uri] = image;
    return image;
}

export const getAddSongUrl = async (): Promise<string> => {
    const doFetch = async () => {
        try {
            const result = await fetch(new URL('config', document.location.toString()));
            const json = await result.json();
            return json['add_url'];
        }
        catch (_) {
            return null;
        }
    }
    
    const configUrl = await doFetch();
    if (configUrl) {
        return configUrl;
    }

    const currentUrl = new URL(window.location.toString());
    currentUrl.searchParams.set(PageParam, SearchPageName);
    return currentUrl.toString();
}

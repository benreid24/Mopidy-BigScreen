import Mopidy from 'mopidy';
import {ArtPlaceholder} from './Constants';

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

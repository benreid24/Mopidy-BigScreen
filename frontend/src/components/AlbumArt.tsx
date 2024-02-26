import React from 'react';
import Mopidy from 'mopidy';
import Spinner from './Spinner';
import {getAlbumArt} from '../Util';
import {ArtPlaceholder} from '../Constants';

export interface AlbumArtProps {
    client: Mopidy;
    track: Mopidy.models.Track;
    className: string;
}

export const AlbumArt: React.FC<AlbumArtProps> = ({client, track, className}) => {
    const [albumArt, setAlbumArt] = React.useState<string | null>(null);

    const onError = React.useCallback(() => {
        setAlbumArt(ArtPlaceholder);
    }, [setAlbumArt]);

    React.useEffect(() => {
        let timeoutId: number | null = null;

        const trySetArt = () => {
            getAlbumArt(client, track).then(uri => {
                setAlbumArt(uri);
                if (!uri) {
                    timeoutId = window.setTimeout(trySetArt, 200);
                }
            })
        }

        trySetArt();

        return () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [track, client]);

    return albumArt ? <img className={className} src={albumArt} alt='Album art' onError={onError}/> : <Spinner/>;
}

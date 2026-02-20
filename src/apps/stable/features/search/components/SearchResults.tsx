import React, { type FC } from 'react';
import { useSearchItems } from '../api/useSearchItems';
import globalize from 'lib/globalize';
import Loading from 'components/loading/LoadingComponent';
import SearchResultsRow from './SearchResultsRow';
import { CardShape } from 'utils/card';
import { CollectionType } from '@jellyfin/sdk/lib/generated-client/models/collection-type';
import { Section } from '../types';
import { Link } from 'react-router-dom';

interface SearchResultsProps {
    parentId?: string;
    collectionType?: CollectionType;
    query?: string;
}

/*
 * React component to display search result rows for global search and library view search
 */
const SearchResults: FC<SearchResultsProps> = ({
    parentId,
    collectionType,
    query
}) => {
    const trimmedQuery = query?.trim();
    const { data, isPending } = useSearchItems(parentId, collectionType, trimmedQuery);
    console.log("DEBUG SEARCH:", {
        query,
        data,
        dataLength: data?.length,
        isPending
        });

    if (isPending) return <Loading />;

    if (!data?.length) {
        const externalUrl =
            'https://docs.nextcloud.com/server/latest/user_manual/fr/files/encrypting_files.html';

        return (
            <div className='noItemsMessage centerMessage'>
                {/* Ajoute "Bonjour" devant le message d'aucun résultat */}
                {`Bonjour ${globalize.translate('SearchResultsEmpty', query)}`}

                <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {/* Lien externe cliquable */}
                    <a
                        className='emby-button'
                        href={externalUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Aller ici
                    </a>

                    {/* Bouton Jellyfin existant (réessayer en recherche globale) */}
                    {collectionType && (
                        <Link
                            className='emby-button'
                            to={`/search?query=${encodeURIComponent(trimmedQuery || '')}`}
                        >
                            {globalize.translate('RetryWithGlobalSearch')}
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const renderSection = (section: Section, index: number) => {
        return (
            <SearchResultsRow
                key={`${section.title}-${index}`}
                title={globalize.translate(section.title)}
                items={section.items}
                cardOptions={{
                    shape: CardShape.AutoOverflow,
                    scalable: true,
                    showTitle: true,
                    overlayText: false,
                    centerText: true,
                    allowBottomPadding: false,
                    ...section.cardOptions
                }}
            />
        );
    };

    return (
        <div className={'searchResults padded-top padded-bottom-page'}>
            {data.map((section, index) => renderSection(section, index))}
        </div>
    );
};

export default SearchResults;
import buildFilterQuery from './buildFilterQuery';

export default function getFilterQuery(filters) {
    if (filters && filters !== 'undefined') {
        return buildFilterQuery(JSON.parse(filters));
    }
    return {};
}

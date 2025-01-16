export default function buildFilterQuery(filters) {
    const query = {};

    for (let [field, value] of Object.entries(filters)) {
        if (value instanceof Object && !Array.isArray(value)) {
            if (value.$gte || value.$lte || value.$gt || value.$lt || value.$ne || value.$in || value.$nin) {
                query[field] = value;
            }
            else if (value.$regex) {
                query[field] = new RegExp(value.$regex, 'i'); 
            }
        } else {
            query[field] = value;
        }
    }

    return query;
}

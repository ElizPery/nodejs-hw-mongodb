import { SORT_ORDER } from "../constants/index.js";

const parseSortParams = ({ sortBy, sortField, sortOrder }) => {
    const parsedSortOrder = SORT_ORDER.includes(sortOrder) ? sortOrder : SORT_ORDER[0];
    const parsedSortBy = sortField.includes(sortBy) ? sortBy : '_id';

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder
    };
};

export default parseSortParams;
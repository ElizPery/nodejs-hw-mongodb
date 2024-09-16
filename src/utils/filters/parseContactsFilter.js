import { contactTypeList } from "../../constants/contacts.js";

const parseType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return;

    if (contactTypeList.includes(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
    const isString = typeof isFavourite === 'string';
    if (!isString) return;

    console.log(typeof isFavourite);

    if (isFavourite === 'true') return true;
    if (isFavourite === 'false') return false;
};

const parseContactsFilter = ({ type, isFavourite }) => {
    const parsedType = parseType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};

export default parseContactsFilter;
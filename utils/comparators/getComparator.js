import descendingComparator from "./descendingComparator";

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (curr, next) => descendingComparator(curr, next, orderBy)
        : (curr, next) => -descendingComparator(curr, next, orderBy);
}

export default getComparator;
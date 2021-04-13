function stableSort(array, comparator) {
    const stabilizedThis = array.map((element, index) => [element, index]);
    stabilizedThis.sort((next, curr) => {
        const order = comparator(next[0], curr[0]);
        if (order !== 0) return order;
        return next[1] - curr[1];
    });
    return stabilizedThis.map((element) => element[0]);
}

export default stableSort;
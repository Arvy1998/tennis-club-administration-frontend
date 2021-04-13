function descendingComparator(curr, next, orderBy) {
    if (next[orderBy] < curr[orderBy]) {
        return -1;
    }
    if (next[orderBy] > curr[orderBy]) {
        return 1;
    }
    return 0;
}

export default descendingComparator;
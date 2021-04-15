const isDateToEarlierThanDateFrom = (from, to) => {
    if (Date.parse(from) > Date.parse(to)) {
        return true;
    } else {
        return false;
    }
}

export default isDateToEarlierThanDateFrom;
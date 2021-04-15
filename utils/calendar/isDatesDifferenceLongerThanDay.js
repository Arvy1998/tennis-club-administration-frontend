const isDatesDifferenceLongerThanDay = (from, to) => {
    const differenceInDays = Math.abs(Date.parse(to) - Date.parse(from)) / (1000 * 60 * 60 * 24);
    if (differenceInDays >= 1) {
        return true;
    } else {
        return false;
    }
}

export default isDatesDifferenceLongerThanDay;
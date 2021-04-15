const isDatePast = (date) => {
    if (Date.parse(date) < new Date()) {
        return true;
    } else {
        return false;
    }
}

export default isDatePast;
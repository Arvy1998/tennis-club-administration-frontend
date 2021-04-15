import areDatesSame from "./areDatesSame";
import isDatePast from "./isDatePast";
import isDatesDifferenceLongerThanDay from "./isDatesDifferenceLongerThanDay";
import isDateToEarlierThanDateFrom from "./isDateToEarlierThanDateFrom";

const validationsActive = ({ start, end }) => {
    return isDatePast(start) ||
        isDatePast(end) ||
        isDatesDifferenceLongerThanDay(start, end) ||
        isDateToEarlierThanDateFrom(start, end) ||
        areDatesSame(start, end)
}

export default validationsActive;
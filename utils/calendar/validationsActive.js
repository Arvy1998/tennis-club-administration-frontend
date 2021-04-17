import areDatesSame from "./areDatesSame";
import doSelectedDatesIntersect from "./doSelectedDatesIntersect";
import isDatePast from "./isDatePast";
import isDatesDifferenceLongerThanDay from "./isDatesDifferenceLongerThanDay";
import isDateToEarlierThanDateFrom from "./isDateToEarlierThanDateFrom";

const validationsActive = ({ start, end }, reservations) => {
    return isDatePast(start) ||
        isDatePast(end) ||
        isDatesDifferenceLongerThanDay(start, end) ||
        isDateToEarlierThanDateFrom(start, end) ||
        areDatesSame(start, end) ||
        doSelectedDatesIntersect({ start, end }, reservations)
}

export default validationsActive;
import areDatesSame from "./areDatesSame";
import isDatePast from "./isDatePast";
import isDatesDifferenceLongerThanDay from "./isDatesDifferenceLongerThanDay";
import isDateToEarlierThanDateFrom from "./isDateToEarlierThanDateFrom";

const helperTextMap = ({ start, end }) => {
    if (isDatePast(start) || isDatePast(end)) return 'Please do not select past dates...';
    if (isDatesDifferenceLongerThanDay(start, end)) return 'Reservation time cannot be longer than 1 day...';
    if (isDateToEarlierThanDateFrom(start, end)) return 'End date cannot be earlier than start date...';
    if (areDatesSame(start, end)) return 'Selected dates are the same...';
    return null;
}

export default helperTextMap;
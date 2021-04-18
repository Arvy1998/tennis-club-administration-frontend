const doSelectedDatesIntersect = ({ start, end }, reservations) => {
    const intersections = reservations.map(reservation => {
        if (reservation.start <= end && start <= reservation.end) return true;
        return false;
    })
    
    const filteredIntersections = intersections.filter(intersection => intersection === true);
    if (filteredIntersections.length) return true;
    return false;
}

export default doSelectedDatesIntersect;
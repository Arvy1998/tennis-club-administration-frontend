const getDatesDifferenceInHour = ({ start, end }) => {
    const differenceInHours = Math.abs(Date.parse(end) - Date.parse(start)) / (1000 * 60 * 60);
    return differenceInHours.toFixed(2);
}

export default getDatesDifferenceInHour;
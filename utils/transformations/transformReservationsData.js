const transformReservationsData = (reservations) => {
    return reservations.map(reservation => {
        return {
            playFieldTitle: reservation.playField.title,
            playFieldCity: reservation.playField.city,
            playFieldAddress: reservation.playField.address,
            ...reservation,
        }
    })
}

export default transformReservationsData;
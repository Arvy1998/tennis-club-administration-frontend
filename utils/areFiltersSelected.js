const areFiltersSelected = (filters) => {
    if (filters.title !== '') return true;
    if (filters.city !== 'Not Selected') return true;
    if (filters.cost !== 0) return true;
    if (filters.courtType !== 'Not Selected') return true;
    if (filters.courtFloorType !== 'Not Selected') return true;
    if (filters.rating !== 0) return true;
    return false;
}

export default areFiltersSelected;

const isEmpty = (field) => {
    if (field === null) return true;
    if (field === 'undefined') return true;
    if (field === '') return true;
    if (field === NaN) return true;
    if (field === 'Not Selected') return true;
    if (field === 0) return true;
    return false;
}

export default isEmpty;
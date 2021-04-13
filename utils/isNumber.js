const isNumber = (field) => {
    const pattern = /^\d+$/;
    return pattern.test(field);
}

export default isNumber;
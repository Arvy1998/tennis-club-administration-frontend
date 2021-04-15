const areDatesSame = (from, to) => {
    if (Date.parse(from) === Date.parse(to)) return true;
    return false;
}

export default areDatesSame;
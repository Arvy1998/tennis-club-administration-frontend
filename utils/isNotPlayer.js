const isNotPlayer = () => {
    return localStorage.getItem('role') && 
        localStorage.getItem('role') !== 'null' && 
        localStorage.getItem('role') !== 'PLAYER' &&
        localStorage.getItem('role') !== 'UNDEFINED';
}

export default isNotPlayer;
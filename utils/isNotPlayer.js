const isNotPlayer = () => {
    return localStorage.getItem('role') !== 'null' && localStorage.getItem('role') !== 'PLAYER';
}

export default isNotPlayer;
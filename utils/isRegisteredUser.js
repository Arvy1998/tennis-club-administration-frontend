const isRegisteredUser = () => {
    return localStorage.getItem('role') && localStorage.getItem('role') !== 'null'
}

export default isRegisteredUser;
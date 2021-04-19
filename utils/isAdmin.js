const isAdmin = () => {
    return localStorage.getItem('role') === 'ADMIN';
}

export default isAdmin;
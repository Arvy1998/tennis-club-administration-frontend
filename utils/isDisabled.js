const isDisabled = () => localStorage.getItem('role') !== 'ADMIN';

export default isDisabled;
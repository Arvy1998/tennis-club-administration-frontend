const isDisabled = () => localStorage.getItem('role') === 'null' || localStorage.getItem('role') === 'PLAYER';

export default isDisabled;
import isNumber from './isNumber';

const isPaymentInformationCorrect = ({ IBAN, CVC, YYMM }) => {
    if (IBAN === '') return false;
    if (!isNumber(CVC)) return false;
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(YYMM)) return false;
    return true;
}

export default isPaymentInformationCorrect;
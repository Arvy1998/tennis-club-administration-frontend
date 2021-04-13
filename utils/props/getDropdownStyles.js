function getDropdownStyles(element, selectedElement, theme) {
    return {
        fontWeight:
            selectedElement.indexOf(element) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
};

export default getDropdownStyles;
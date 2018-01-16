const debounce = (func, wait, immediate) => {
    let timeout;
    return function debounced(...args) {
        const context = this;
        const later = function delayed() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};

export {
    // eslint-disable-next-line
    debounce,
};

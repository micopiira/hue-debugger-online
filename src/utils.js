/**
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV#Interconversion
 */
export function HSVtoHSL({H, S, V}) {
    const L = V - V * S / 2;
    return {H, S: (L === 0 || L === 1) ? 0 : (V - L) / Math.min(L, 1 - L), L};
}

/**
 * @template T
 * @param {Object.<string, T>} object
 * @param keyProp
 * @returns {Array<T>}
 */
export function objectToArray(object, keyProp = 'id') {
    return Object.keys(object).map(key => ({...object[key], [keyProp]: key}));
}



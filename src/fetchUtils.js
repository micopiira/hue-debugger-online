/**
 * 
 * @param {Response} res 
 */
const checkStatus = res => {
    if (res.status >= 200 && res.status < 300) {
        return res
    } else {
        let err = new Error(res.statusText)
        err.response = res
        throw err
    }
}

/**
 * 
 * @param {Response} res 
 */
export function handleJsonResponse(res) {
    return checkStatus(res).json();
}
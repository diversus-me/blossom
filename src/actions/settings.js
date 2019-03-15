export const CHANGE_METHOD = 'CHANGE_METHOD'

export const METHODS = [
    "CALCULATED",
    "NAIVE",
    "FIXED",
    "TREE",
    "TREE COMPLEX"
]

export function changeMethod(method) {
    return {
        type: CHANGE_METHOD,
        method,
    }
}
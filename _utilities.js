export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle(arr) {
    for (let j = arr.length - 1; j >= 0; j--) {
        const randIndex = randInt(0, j - 1);
        [arr[randIndex], arr[j]] = [arr[j], arr[randIndex]];
    }
}

export function shuffled(arr) {
    for (let j = arr.length - 1; j >= 0; j--) {
        const randIndex = randInt(0, j - 1);
        [arr[randIndex], arr[j]] = [arr[j], arr[randIndex]];
    }
    return arr;
}

export function isSorted(arr, comparator) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (!comparator(arr[i], arr[i + 1])) {
            return false;
        }
    }
    return true;
}

export function range(limit) {
    const arr = [];
    for (let i = 1; i <= limit; i++) {
        arr.push(i);
    }
    return arr;

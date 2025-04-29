import { shuffle, isSorted } from './_utilities.js';

const colors = {
    NEON_RED: '#FF073A',
    NEON_GREEN: '#39FF14',
    NEON_BLUE: '#3A0FFF',
};

Object.freeze(colors);

function* __verify(arr, comparator) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (!comparator(arr[i], arr[i + 1])) {
            throw new Error('Verification failed. Data is not sorted based on the comparator given.');
        }
        yield {
            arr,
            binColorMapper: binIndex => (binIndex <= i + 1 ? colors.NEON_GREEN : 'white')
        };
    }
}

export function* bogoSort(arr) {
    while (!isSorted(arr, (a, b) => a <= b)) {
        shuffle(arr);
        yield {
            arr,
            binColorMapper: (binIndex) => 'white'
        };
    }
    yield* __verify(arr, (a, b) => a <= b);
}

export function* radixSortLSD(arr) {
    const intermediateResults = [];
    const maxDigitLength = String(Math.max(...arr)).length;
    let buckets = Array.from({ length: 10 }, () => []);
    let digitPlace = 1;

    for (let i = 0; i < maxDigitLength; i++) {
        for (let j = 0; j < arr.length; j++) {
            const digit = Math.floor(arr[j] / digitPlace) % 10;
            buckets[digit].push(arr[j]);

            intermediateResults.push({
                arr: [...arr],
                binColorMapper: binIndex => (binIndex === j ? 'red' : 'white')
            });
        }

        collectFromBuckets(buckets, arr);
        buckets = Array.from({ length: 10 }, () => []);
        digitPlace *= 10;
    }

    function collectFromBuckets(buckets, arr) {
        let i = 0;
        for (const bucket of buckets) {
            for (const item of bucket) {
                arr[i++] = item;
                const frozenI = i;
                intermediateResults.push({
                    arr: [...arr],
                    binColorMapper: binIndex => (binIndex === frozenI ? 'red' : 'white')
                });
            }
        }
    }

    yield* intermediateResults;
    yield* __verify(arr, (a, b) => a <= b);
}

export function* heapSort(arr) {
    const intermediateResults = [];

    function buildMaxHeap() {
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            heapify(i, arr.length);
        }
    }

    function heapify(index, heapSize) {
        let parentIndex = index;
        let childIndex = 2 * (parentIndex + 1) - 1;

        while (childIndex < heapSize) {
            const rightChild = childIndex + 1;
            const greatestChildIndex = (rightChild < heapSize && arr[rightChild] > arr[childIndex])
                ? rightChild
                : childIndex;

            if (arr[greatestChildIndex] > arr[parentIndex]) {
                [arr[parentIndex], arr[greatestChildIndex]] = [arr[greatestChildIndex], arr[parentIndex]];
            }

            const frozenParent = parentIndex;
            const frozenChild = childIndex;
            intermediateResults.push({
                arr: [...arr],
                binColorMapper: binIndex =>
                    (binIndex === frozenParent || binIndex === frozenChild) ? colors.NEON_RED : 'white'
            });

            parentIndex = greatestChildIndex;
            childIndex = 2 * (parentIndex + 1) - 1;
        }
    }

    buildMaxHeap();
    for (let i = arr.length - 1; i >= 0; i--) {
        [arr[i], arr[0]] = [arr[0], arr[i]];
        heapify(0, i);
    }

    yield* intermediateResults;
    yield* __verify(arr, (a, b) => a <= b);
}

export function* quickSort(arr) {
    const intermediateResults = [];

    function divide(arr, start, end) {
        if (start >= end) return;
        const pivotIndex = partition(arr, start, end);
        divide(arr, start, pivotIndex - 1);
        divide(arr, pivotIndex + 1, end);
    }

    function partition(arr, start, end) {
        let i = start - 1;
        const pivot = arr[end];

        for (let j = start; j < end; j++) {
            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }

            const frozenI = i;
            intermediateResults.push({
                arr: [...arr],
                binColorMapper: binIndex =>
                    (binIndex === frozenI || binIndex === j) ? colors.NEON_RED
                        : (binIndex === end) ? colors.NEON_BLUE
                        : 'white'
            });
        }

        i++;
        [arr[i], arr[end]] = [pivot, arr[i]];
        return i;
    }

    divide(arr, 0, arr.length - 1);
    yield* intermediateResults;
    yield* __verify(arr, (a, b) => a <= b);
}

export function* mergeSort(arr) {
    const intermediateResults = [];

    function divide(data, start, end) {
        if (start >= end - 1) return;

        const mid = Math.floor((start + end) / 2);
        divide(data, start, mid);
        divide(data, mid, end);
        merge(data, start, mid, end);
    }

    function merge(data, start, mid, end) {
        let i = 0, j = 0, k = start;
        const left = data.slice(start, mid);
        const right = data.slice(mid, end);

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                data[k++] = left[i++];
            } else {
                data[k++] = right[j++];
            }

            intermediateResults.push({
                arr: [...data],
                binColorMapper: binIndex =>
                    (binIndex === start + i || binIndex === mid + j) ? colors.NEON_RED
                        : (binIndex === mid) ? colors.NEON_BLUE
                        : 'white'
            });
        }

        while (i < left.length) {
            data[k++] = left[i++];
            intermediateResults.push({
                arr: [...data],
                binColorMapper: binIndex =>
                    (binIndex === start + i || binIndex === mid + j) ? colors.NEON_RED
                        : (binIndex === mid) ? colors.NEON_BLUE
                        : 'white'
            });
        }

        while (j < right.length) {
            data[k++] = right[j++];
            intermediateResults.push({
                arr: [...data],
                binColorMapper: binIndex =>
                    (binIndex === start + i || binIndex === mid + j) ? colors.NEON_RED
                        : (binIndex === mid) ? colors.NEON_BLUE
                        : 'white'
            });
        }
    }

    divide(arr, 0, arr.length);
    yield* intermediateResults;
    yield* __verify(arr, (a, b) => a <= b);
}

export function* bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
            yield {
                arr: [...arr],
                binColorMapper: binIndex =>
                    (binIndex === j || binIndex === j + 1) ? colors.NEON_RED : 'white'
            };
        }
    }
    yield* __verify(arr, (a, b) => a <= b);
}

export function* selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let curMin = arr[i];
        let curMinIndex = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < curMin) {
                curMin = arr[j];
                curMinIndex = j;
            }
            yield {
                arr: [...arr],
                binColorMapper: binIndex =>
                    (binIndex === i || binIndex === j) ? colors.NEON_RED
                        : (binIndex === curMinIndex) ? colors.NEON_BLUE
                        : 'white'
            };
        }

        [arr[i], arr[curMinIndex]] = [curMin, arr[i]];
    }
    yield* __verify(arr, (a, b) => a <= b);
}

export function* insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1;
        let cur = arr[i];

        while (j >= 0 && cur < arr[j]) {
            arr[j + 1] = arr[j];
            j--;

            yield {
                arr: [...arr],
                binColorMapper: binIndex =>
                    (binIndex === i || binOndex === j) ? colors.NEON_RED : 'white'
            };
        }

        arr[j + 1] = cur;
    }
    yield* __verify(arr, (a, b) => a <= b);
}

export function sorterFactory(sorterName) {
    switch (sorterName) {
        case 'bubble sort': return bubbleSort;
        case 'selection sort': return selectionSort;
        case 'insertion sort': return insertionSort;
        case 'merge sort': return mergeSort;
        case 'quick sort': return quickSort;
        case 'heap sort': return heapSort;
        case 'radix sort(LSD)': return radixSortLSD;
        case 'bogo sort': return bogoSort;
        default:
            return function* (arr) {
                while (true) {
                    yield {
                        arr,
                        binColorMapper: binIndex => 'white'
                    };
                }
            };
    }
                                     

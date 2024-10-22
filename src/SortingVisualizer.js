import React, { useState } from 'react';
import './SortingVisualizer.css';

const SortingVisualizer = () => {
    const [array, setArray] = useState([5, 3, 0, 2, 1, 4]);
    const [originalArray, setOriginalArray] = useState(array);
    const [swappingIndices, setSwappingIndices] = useState([]);
    const [isAscending, setIsAscending] = useState(true);
    const [isSorting, setIsSorting] = useState(false);
    const [sortingAnimations, setSortingAnimations] = useState([]);

    const swap = (i, j) => {
        setArray((prevArray) => {
            const newArray = prevArray.slice();
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            return newArray;
        });
    };

    const bubbleSort = (array, isAscending) => {
        let arr = array.slice();
        let animations = [];
        let n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (isAscending ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1]) {
                    animations.push([j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }

        return animations;
    };

    const animateSwaps = (animations, onComplete) => {
        for (let i = 0; i <= animations.length; i++) {
            if (i === animations.length) {
                setTimeout(() => {
                    setSwappingIndices([]);
                    onComplete();
                }, i * 1500);
                break;
            }

            const [firstIndex, secondIndex] = animations[i];
            setTimeout(() => {
                setSwappingIndices([firstIndex, secondIndex]);

                setTimeout(() => {
                    swap(firstIndex, secondIndex);
                    setSwappingIndices([]);
                }, 1000);
            }, i * 1500);
        }
    };

    const startSort = () => {
        if (isSorting) return;
        setIsSorting(true);
        const animations = bubbleSort(array, isAscending);
        setSortingAnimations(animations);
        animateSwaps(animations, () => setIsSorting(false));
    };

    const reverseArray = () => {
        if (isSorting || sortingAnimations.length === 0) return;
        setIsSorting(true);
        const reversedAnimations = [...sortingAnimations].reverse();
        animateSwaps(reversedAnimations, () => {
            setIsSorting(false);
            setArray(originalArray);
        });
    };

    const generateNewArray = () => {
        if (isSorting) return;
        const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
        setArray(newArray);
        setOriginalArray(newArray);
        setSortingAnimations([]);
    };

    const isArraySorted = () => {
        for (let i = 0; i < array.length - 1; i++) {
            if (isAscending) {
                if (array[i] > array[i + 1]) {
                    return false;
                }
            } else {
                if (array[i] < array[i + 1]) {
                    return false;
                }
            }
        }
        return true;
    };

    const isArrayOriginal = () => {
        return JSON.stringify(array) === JSON.stringify(originalArray);
    };


    return (
        <div className='container'>
            <div className="array-container">
                {array.map((value, idx) => {
                    const isSwapping = swappingIndices.includes(idx);
                    let animationClass = '';
                    let direction = 0;

                    if (isSwapping && swappingIndices.length === 2) {
                        const [firstIndex, secondIndex] = swappingIndices;
                        const distance = (secondIndex - firstIndex) * (50 + 10);
                        if (idx === firstIndex) {
                            animationClass = 'move-first-box';
                            direction = distance;
                        } else if (idx === secondIndex) {
                            animationClass = 'move-second-box';
                            direction = -distance;
                        }
                    }

                    return (
                        <div
                            className={`array-box ${animationClass}`}
                            key={idx}
                            style={{ '--direction': `${direction}px` }}
                        >
                            {value}
                        </div>
                    );
                })}
            </div>
            <div className="controls">
                <button onClick={generateNewArray} disabled={isSorting}>
                    New Array
                </button>
                <button onClick={() => setIsAscending(!isAscending)} disabled={isSorting}>
                    Order: {isAscending ? 'Ascending' : 'Descending'}
                </button>
                <button onClick={startSort} disabled={isSorting || isArraySorted()}>
                    Sort
                </button>
                <button
                    onClick={reverseArray}
                    disabled={isSorting || sortingAnimations.length === 0 || isArrayOriginal()}
                >
                    Original
                </button>
            </div>
        </div>
    );
};

export default SortingVisualizer;

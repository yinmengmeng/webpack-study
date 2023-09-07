import sum from '@/A';

export let name = 'B';
export function average(...params) {
    let total = sum(...params);
    return (total / params.length).toFixed(2);
};
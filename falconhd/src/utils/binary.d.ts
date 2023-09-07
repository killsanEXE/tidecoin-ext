export declare function search<T, K>(items: T[], key: K, compare: (item: T, key: K) => number, insert?: boolean): number;
export declare function insert<T>(items: T[], item: T, compare: (item1: T, item2: T) => number, uniq?: boolean): number;
export declare function remove<T, K>(items: T[], item: K, compare: (item: T, key: K) => number): boolean;

declare const EventEmitter: any;
declare class TimeData extends EventEmitter {
    samples: number[];
    known: Map<string, number>;
    offset: number;
    checked: boolean;
    constructor(limit?: number);
    add(id: string, time: number): void;
    now(): number;
    adjust(time: number): number;
    local(time: number): number;
    ms(): number;
}
export default TimeData;

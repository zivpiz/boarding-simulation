
export interface IPerson {
    isSeated: boolean;
    xSpeed: number;
    ySpeed: number;
    luggageDelay: number;
    ticket: {
        row: number;
        seatInRow: number;
    };
    target: {row: number, column: number} | string;
};

export class Person implements IPerson {
    isSeated: boolean;
    xSpeed: number;
    ySpeed: number;
    luggageDelay: number;
    ticket: {
        row: number;
        seatInRow: number;
    };
    target: {row: number, column: number} | string;
}
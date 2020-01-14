import {AisleBlock, EmptyAisleBlock, Person} from './types';

export interface IPlane {
    rows: number;
    columns: number;
    spaceBetweenRows: number;
    aisle: Array<AisleBlock | EmptyAisleBlock>;
    stepPassanger(passanger: Person): void;
}

export class Plane implements IPlane {
    rows: number;
    columns: number;
    spaceBetweenRows: number;
    aisle: (AisleBlock | EmptyAisleBlock)[];
    stepPassanger(passanger: Person): void {
        passanger.
        throw new Error("Method not implemented.");
    }
}
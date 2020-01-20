import {IInactivePersonsSet, IPerson, IPlane} from './interfaces';

export class InactivePersonsSet implements IInactivePersonsSet {
    
    private passangers: Set<IPerson>;
    length: number;

    constructor() {
        this.passangers = new Set();
    }

    getAllPersons(): Set<IPerson> {
        return this.passangers;
    }

    getAllBlockersOfPerson(person: IPerson): IPerson[] {
        let blockers: IPerson[] = [];
        const {row, column} = person.getPosition();
        const ticketColumn = person.getTicket().column;
        this.passangers.forEach((sittingPerson: IPerson) => {
            let sittingRow = sittingPerson.getPosition().row;
            let sittingColumn = sittingPerson.getPosition().column;
            if (sittingRow === row) {
                if ((ticketColumn > column && sittingColumn > column) || (ticketColumn < column && sittingColumn < column)) {
                    blockers.push(sittingPerson);
                }
            }
        });
        const mult = ticketColumn > column ? 1 : -1;
        blockers.sort((a: IPerson, b: IPerson) => {
            return (a.getPosition().column - b.getPosition().column) * mult;
        })
        return blockers;
    }

    isPersonBlocked(person: IPerson): boolean {
        const {row, column} = person.getPosition();
        const ticketColumn = person.getTicket().column;
        return Array.from(this.passangers).some((sittingPerson: IPerson) => {
            let sittingRow = sittingPerson.getPosition().row;
            let sittingColumn = sittingPerson.getPosition().column;
            return (sittingRow === row && ((ticketColumn > column && sittingColumn > column) || (ticketColumn < column && sittingColumn < column)));
        })
    }

    add(person: IPerson) {
       this.passangers.add(person);
    }

    remove(person: IPerson) {
        this.passangers.delete(person);
    }

    forEach(lambda: (element: IPerson) => void) {
        this.passangers.forEach(lambda);
    }
}
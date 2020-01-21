import { IInactivePersonsSet, IPerson, IPlane } from "./interfaces";
import { Direction } from "./types";
import Passengers from "./passengers";

export class InactivePersonsSet implements IInactivePersonsSet {
  private passengers: Set<IPerson>;
  length: number;

  constructor() {
    this.passengers = new Set();
  }

  getAllPersons(): Set<IPerson> {
    return this.passengers;
  }

  getAllBlockersOfPerson(person: IPerson): IPerson[] {
    let passengers = Array.from(this.passengers);
    const { row, column } = person.getPosition();
    const ticketColumn = person.getTicket().column;
    let blockers = passengers.filter((sittingPerson: IPerson) => {
      let sittingRow = sittingPerson.getPosition().row;
      let sittingColumn = sittingPerson.getPosition().column;
      let isOther = sittingPerson !== person;
      let rightBlock = ticketColumn > column && sittingColumn < ticketColumn;
      let leftBlock = ticketColumn < column && sittingColumn > ticketColumn;
      return isOther && sittingRow === row && (rightBlock || leftBlock);
    });
    const mult = ticketColumn > column ? 1 : -1;
    blockers.sort((a: IPerson, b: IPerson) => {
      return (a.getPosition().column - b.getPosition().column) * mult;
    });
    return blockers;
  }

  isPersonBlocked(person: IPerson): boolean {
    const { row, column } = person.getPosition();
    const ticketColumn = person.getTicket().column;
    return Array.from(this.passengers).some((sittingPerson: IPerson) => {
      let sittingRow = sittingPerson.getPosition().row;
      let sittingColumn = sittingPerson.getPosition().column;
      let isOther = sittingPerson !== person;
      let rightBlock = ticketColumn > column && sittingColumn < ticketColumn;
      let leaverBlock =
        sittingColumn === ticketColumn &&
        person.getDirection() === Direction.LEAVE;
      let leftBlock = ticketColumn < column && sittingColumn > ticketColumn;
      return isOther && sittingRow === row && (rightBlock || leftBlock);
    });
  }

  add(person: IPerson) {
    if (!this.passengers.has(person)) this.passengers.add(person);
  }

  remove(person: IPerson) {
    this.passengers.delete(person);
  }

  forEach(lambda: (element: IPerson) => void) {
    this.passengers.forEach(lambda);
  }
}

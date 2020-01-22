import { IActivePersonsQueue, IPerson } from "./interfaces";
import { Direction } from "./types";

export default class ActivePersonsQueue implements IActivePersonsQueue {
  private passengers: IPerson[];
  length: number;

  constructor(arrayOfPassangers: IPerson[]) {
    arrayOfPassangers.forEach((p, index) => {
      if (index !== 0) p.frontPerson = arrayOfPassangers[index - 1];
      if (index !== arrayOfPassangers.length - 1)
        p.backPerson = arrayOfPassangers[index + 1];
    });
    this.passengers = arrayOfPassangers;
    this.length = this.passengers.length;
  }

  getQueueAsArray(): IPerson[] {
    return this.passengers;
  }

  addToQueueBefore(personToAdd: IPerson, before: IPerson) {
    if (!this.passengers.includes(personToAdd)) {
      personToAdd.setBackPerson(before);
      personToAdd.setFrontPerson(before.getFrontPerson());
      before.setFrontPerson(personToAdd);
      let index = this.getPersonIndex(before);
      if (index < 0) throw '"before" person is not in Active Queue passengers';
      // personToAdd.setFrontPerson(this.passengers[index + 1]);
      this.passengers.splice(index, 0, personToAdd);
      this.length++;
    }
  }

  remove(personToRemove: IPerson) {
    if (this.passengers.includes(personToRemove)) {
      if (personToRemove.getBackPerson()) {
        personToRemove
          .getBackPerson()
          .setFrontPerson(personToRemove.getFrontPerson());
      }

      if (personToRemove.getFrontPerson()) {
        personToRemove
          .getFrontPerson()
          .setBackPerson(personToRemove.getBackPerson());
      }

      let index = this.getPersonIndex(personToRemove);
      this.passengers.splice(index, 1);
      this.length--;
    }
  }

  isPersonBlocked(person: IPerson): boolean {
    const { row, column } = person.getPosition();
    const ticketColumn = person.getTicket().column;
    return Array.from(this.passengers).some((activePerson: IPerson) => {
      let activeRow = activePerson.getPosition().row;
      let activeColumn = activePerson.getPosition().column;
      let isOther = activePerson !== person;
      let rightBlock = ticketColumn > column && activeColumn < ticketColumn;
      let leaverBlock =
        activeColumn === ticketColumn &&
        person.getDirection() === Direction.LEAVE;
      let leftBlock = ticketColumn < column && activeColumn > ticketColumn;
      return (
        isOther && activeRow === row && (rightBlock || leaverBlock || leftBlock)
      );
    });
  }

  getAllBlockersOfPerson(person: IPerson): IPerson[] {
    let blockers: IPerson[] = [];
    const { row, column } = person.getPosition();
    const ticketColumn = person.getTicket().column;
    blockers = this.passengers.filter((activePerson: IPerson) => {
      let activeRow = activePerson.getPosition().row;
      let activeColumn = activePerson.getPosition().column;
      let isOther = activePerson !== person;
      let rightBlock = ticketColumn > column && activeColumn < ticketColumn;
      let leaverBlock =
        activeColumn === ticketColumn &&
        person.getDirection() === Direction.LEAVE;
      let leftBlock = ticketColumn < column && activeColumn > ticketColumn;
      return (
        isOther && activeRow === row && (rightBlock || leaverBlock || leftBlock)
      );
    });
    const mult = ticketColumn > column ? 1 : -1;
    blockers.sort((a: IPerson, b: IPerson) => {
      return (a.getPosition().column - b.getPosition().column) * mult;
    });
    return blockers;
  }

  forEach(lambda: (element: IPerson) => void) {
    this.passengers.forEach(lambda);
  }

  private getPersonIndex(person: IPerson) {
    return this.passengers.findIndex(element => element === person);
  }

  print() {
    let printedPassengers = [];
    this.passengers.forEach(({ id, position, ticket, target }, _p, _) =>
      printedPassengers.push(
        `[${id}] position {${position.row}, ${position.column}} ticket {${ticket.row},${ticket.column}} target {${target.row},${target.column}}`
      )
    );

    console.log(`ActivePassengersQueue:`);
    console.log(printedPassengers.join("\n"));
  }
}

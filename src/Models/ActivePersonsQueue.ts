import { IActivePersonsQueue, IPerson } from "./interfaces";

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
    personToAdd.setBackPerson(before);
    personToAdd.setFrontPerson(before.getFrontPerson());
    before.setFrontPerson(personToAdd);
    let index = this.getPersonIndex(before);
    if (index < 0) throw '"before" person is not in Active Queue passengers';
    // personToAdd.setFrontPerson(this.passengers[index + 1]);
    this.passengers.splice(index, 0, personToAdd);
    this.length++;
  }

  remove(personToRemove: IPerson) {
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

  forEach(lambda: (element: IPerson) => void) {
    this.passengers.forEach(lambda);
  }

  private getPersonIndex(person: IPerson) {
    return this.passengers.findIndex(element => element === person);
  }
}

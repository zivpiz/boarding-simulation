import {IActivePersonsQueue, IPerson} from './interfaces';

export class ActivePersonsQueue implements IActivePersonsQueue {
    private passangers: IPerson[];
    length: number;

    constructor(arrayOfPassangers: IPerson[]) {
        this.passangers = arrayOfPassangers;
        this.length = this.passangers.length;
    }

    getQueueAsArray(): IPerson[] {
        return this.passangers;
    }

    addToQueueBefore(personToAdd: IPerson, before: IPerson) {
        personToAdd.setBackPerson(before);
        let index = this.getPersonIndex(personToAdd);
        personToAdd.setFrontPerson(this.passangers[index+1]);
        this.passangers.splice(index, 0, personToAdd);       
        this.length++;         
    }

    remove(personToRemove: IPerson) {
        personToRemove.getBackPerson().setFrontPerson(personToRemove.getFrontPerson());
        personToRemove.getFrontPerson().setBackPerson(personToRemove.getBackPerson());
        let index = this.getPersonIndex(personToRemove);
        this.passangers.splice(index, 1);
        this.length--;
    }

    forEach(lambda: (element: IPerson) => void) {
        this.passangers.forEach(lambda);
    }

    private getPersonIndex(person: IPerson) {
        return this.passangers.findIndex((element) => element === person);
    }
}
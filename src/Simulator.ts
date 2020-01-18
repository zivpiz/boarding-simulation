import Plane from "./Models/plane";
import Person from "./Models/Person";
import Passengers from "./Models/passengers";
import { ISimulator, IPlane, IActivePersonsQueue, IInactivePersonsSet, IPerson } from './Models/interfaces';
import {Direction, Position} from './Models/types';
import { InactivePersonsSet } from "./Models/InactivePersonsSet";

/*
loop until everyone seat:
  iterate over the queue of persons, for every person:
    cases:
      1.  person walk forward -> walk until he can't
      2.  person walk backward in aisle:
        1.  someone blocks him -> ask this person to walk backward one step
        2.  no one blocks -> walk one step backward
      3.  person in his row target
        1.  his row target is not his row ticket -> change the person's target to his ticket
        2.  his row target is his row ticket:  put the luggage //add new function in Person
          1.  someone blocks him in his row -> changes his target to one step back and gives new target to persons in the row who block him
          2.  no one blocks him in the row -> walk to his seat (Direction.IN)
      4.  person in his seat, walk out until he can't
      


    simulator cases:
      foreach person in manager.queue do:
        1.
        
    Simulator flow:
      foreach person in manager.queue do:
        1. if direction !== in/ out --> person.aisleStep()
          1. person.aisleStep() === true: person is in his ticket aisle:
            1.put lugguge
            2.if someone block the way to the person seat:
                ask those persons to exit the row.
              else:
                person.rowStepToSeat();
          2. person.aisleStep() === false: do nothing
        2. direction === in/ out: person.rowStepToSeat();
*/
export class Simulator implements ISimulator {
  private plane: IPlane;
  private activePersons: IActivePersonsQueue;
  private inactivePersons: IInactivePersonsSet;
  private iterations: number;

  constructor(plane: IPlane, queue: IActivePersonsQueue) {
    this.plane = plane;
    this.activePersons = queue;
    this.inactivePersons = new InactivePersonsSet();
    this.iterations = 0;
  }

  simulate(): number {
    while (this.activePersons.length > 0) { //while there is someone who is not sitting
      this.iterations++;
      
      this.activePersons.forEach((person: IPerson) => {
        person.initPercentage();

        if (person.atSeatAisle() && this.isPersonInAisle(person)) {
          this.handlePersonInHisRowButInAisle(person);
        } else {
          if (this.isPersonInAisle(person)) {
            this.walkInAilse(person);
          } else {
            this.walkInRow(person);
          }
        }        
      });
    }
    return this.iterations;
  }

  private handlePersonInHisRowButInAisle(person) {
    let isPersonBlocked = this.isPersonBlockedInRow(person);
    if (isPersonBlocked) {
      this.notifyAllSittingBlockersOfPerson(person);
    }
    if (person.hasMoreLuggage()) {
      person.putLuggage();
    }
    if (isPersonBlocked && !person.hasMoreLuggage()) {
      this.tellPersonToWalkOneStepBack(person);
    }
    if (!isPersonBlocked && !person.hasMoreLuggage()) {
      person.updateDirectionAccordinToTarget();
      if (person.getDirection() === Direction.FORWARD) { //person in his way out (trying to empty the row)
        this.walkInAilse(person);
      } else { //person in his way in
        this.walkInRow(person);
      }
    }
  }

  private walkInAilse(person: IPerson) {
    let arrivedHisRow = person.aisleStep();
    if (arrivedHisRow) {
      this.handlePersonInHisRowButInAisle(person);
    }
  } 

  private walkInRow(person: IPerson) {
    let arrivedHisSeat = person.rowStepToSeat();
    if (arrivedHisSeat) {
      this.activePersons.remove(person);
      this.inactivePersons.add(person);
    }
    else if (this.isPersonInAisle(person)) {
      this.handlePersonInHisRowButInAisle(person);
    }
  }

  private tellPersonToWalkOneStepBack(person: IPerson) {
    person.setTarget({row: person.getPosition().row-1, column: person.getPosition().column});
  }

  // private changeDirectionToEnterRow(person: IPerson): void {
  //   person.setDirection(Direction.ENTER);
  // }
  //
  // private changeDirectionToForward(person: IPerson): void {
  //   person.setDirection(Direction.FORWARD);
  // }

  private isPersonBlockedInRow(person: IPerson): boolean {
    return this.inactivePersons.isPersonBlocked(person);
  }

  private isPersonInAisle(person: IPerson): boolean {
    return person.getPosition().column === this.plane.getCenter();
  }

  private changePersonToBeInactive(person: IPerson) {
    this.activePersons.remove(person);
    this.inactivePersons.add(person);
  }

  //tell the blockers in the row to empty the row.
  private notifyAllSittingBlockersOfPerson(person: IPerson) {
    let blockers: Array<IPerson> = this.inactivePersons.getAllBlockersOfPerson(person);
    let numOfBlockers: number = blockers.length;
    let rowNumber: number = blockers[0].getPosition().row;
    let aisleColumnNum: number = this.plane.getCenter();
    for (let i=0; i< numOfBlockers; i++) {
      let blocker: IPerson = blockers[i];
      blocker.setTarget({column: aisleColumnNum, row: rowNumber+i+1})
      this.activePersons.addToQueueBefore(blocker, person);
    }    
  }

  getPlane(): IPlane {
    return this.plane;
  }
  getIterations(): number {
    return this.iterations;
  }
}
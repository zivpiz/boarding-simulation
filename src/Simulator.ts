import * as _ from "lodash";
import Plane from "./Models/plane";
import Person from "./Models/Person";
import Passengers from "./Models/passengers";
import { ISimulator, IPlane, IActivePersonsQueue, IInactivePersonsSet, IPerson } from './Models/interfaces';
import {Direction, Position} from './Models/types';

const simulateBoarding = (plane: Plane, queue: Array<Person>): number => {
  let iterations = 0;

  while (_.some(queue, person => person.isSeated)) {
    iterations++;
  }

  return iterations;
};


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
  plane: IPlane;
  activePersons: IActivePersonsQueue;
  inactivePersons: IInactivePersonsSet;
  iterations: number;

  constructor(plane, queue, set) {
    this.plane = plane;
    this.activePersons = queue;
    this.inactivePersons = set;
    this.iterations = 0;
  }

  simulate(): number {

    while (this.inactivePersons.length > 0) {
      this.iterations++;
      this.activePersons.forEach(person => {
        person.initPercentage();
        if (person.getDirection() === Direction.FORWARD) {
          let arrivedHisRow = person.aisleStep();
          if (arrivedHisRow) {
            if (person.putLuggage()) {
              let blockers: Array<IPerson> = this.inactivePersons.getAllBlockersOfPerson(person);
              if (blockers.length > 0) {
                this.notifyAllSittingBlockersOfPerson(blockers, person);
              } else {
                person.setDirection(Direction.ENTER);
              }
              
            }
          }
        }
        
      });

    }

    return this.iterations;
  }

  


  


  //tell the blockers in the row to empty the row.
  notifyAllSittingBlockersOfPerson(blockers: Array<IPerson>, person: IPerson) {
    let numOfBlockers: number = blockers.length;
    let rowNumber: number = blockers[0].getPosition().row;
    let aisleColumnNum: number = this.plane.getCenter();
    for (let i=0; i< numOfBlockers; i++) {
      let blocker: IPerson = blockers[i];
      blocker.setTarget({column: aisleColumnNum, row: rowNumber+i+1})
      this.activePersons.addToQueueBefore(blocker, person);
    }    
  }

  seatBlockedBy(person: IPerson): Set<IPerson> {
    throw new Error("Method not implemented.");
  }
  askToClearSeatWay(group: Set<IPerson>): IPerson[] {
    throw new Error("Method not implemented.");
  }

}
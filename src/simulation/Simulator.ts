import Plane from "../Models/plane";
import Person from "../Models/Person";
import Passengers from "../Models/passengers";
import {
  ISimulator,
  IPlane,
  IActivePersonsQueue,
  IInactivePersonsSet,
  IPerson
} from "../Models/interfaces";
import { Direction, Position } from "../Models/types";
import { InactivePersonsSet } from "../Models/InactivePersonsSet";
import * as _ from "lodash";

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
  private snapshot: any;

  constructor(plane: IPlane, queue: IActivePersonsQueue, snapshot: any) {
    this.plane = plane;
    this.activePersons = queue;
    this.inactivePersons = new InactivePersonsSet();
    this.iterations = 0;
    this.snapshot = snapshot;
  }

  simulate(): number {
    // this.toSnapshot();
    while (this.activePersons.length > 0) {
      //while there is someone who is not sitting
      this.iterations++;
      this.toSnapshot();
      let personsToIterate = this.activePersons.getQueueAsArray().slice(0);
      personsToIterate.forEach((person: IPerson) => {
        person.initPercentage();

        if (person.atSeatAisle()) {
          this.handlePersonInHisRowButInAisle(person);
        } else {
          if (this.isPersonInAisle(person)) {
            this.walkInAilse(person);
          } else {
            this.walkInRow(person);
          }
        }
        this.toSnapshot();
      });
    }
    this.toSnapshot();
    return this.iterations;
  }

  // private debugg() {
  //   this.printCurrentPositions();
  //   const positionsList = this.activePersons
  //     .getQueueAsArray()
  //     .map(person => person.getPosition());
  //   positionsList.forEach((position, currIndex) => {
  //     if (
  //       _.slice(positionsList, currIndex + 1).find(position2 =>
  //         _.isEqual(position2, position)
  //       )
  //     ) {
  //       throw Error("Same positions!~!");
  //     }
  //   });
  // }
  private printCurrentPositions() {
    //   this.inactivePersons.forEach(person => {
    //     console.log(
    //       `inactive person ${person.id} position`,
    //       person.getPosition()
    //     );
    //     console.log(`inactive person ${person.id} ticket`, person.getTicket());
    //     console.log(`inactive person ${person.id} target`, person.getTarget());
    //     console.log("");
    //   });
    //   this.activePersons.forEach(person => {
    //     console.log(`active person ${person.id} position`, person.getPosition());
    //     console.log(`active person ${person.id} ticket`, person.getTicket());
    //     console.log(`active person ${person.id} target`, person.getTarget());
    //     console.log("");
    //   });
  }

  //this function handle the case of person in the aisle and in his ticket row number
  private handlePersonInHisRowButInAisle(person) {
    let isPersonBlocked = this.isPersonBlockedInRow(person);
    let blockOther = person.getBlockedPerson();
    if (isPersonBlocked && !blockOther) {
      this.notifyAllSittingBlockersOfPerson(person);
    }
    if (person.hasMoreLuggage()) {
      person.putLuggage();
    }
    if (isPersonBlocked && !person.hasMoreLuggage() && !blockOther) {
      //person needs to walk one step back
      if (person.getDirection() != Direction.BACKWARD) {
        this.tellPersonToWalkOneStepBack(person);
      }
      if (person.canMakeStep()) this.walkInAilse(person);
    }
    if (blockOther || (!isPersonBlocked && !person.hasMoreLuggage())) {
      //person finished with his luggage and no one blocks him.
      //person can be here in 3 cases:
      //1. person start walk into his seat from the aisle.
      //2. person empty the row for someone
      //3. person returns to his seat after he empty the row for someone
      person.updateDirectionAccordinToTarget();
      if (
        person.getDirection() === Direction.FORWARD ||
        person.getDirection() === Direction.BACKWARD
      ) {
        //person in his way out (trying to empty the row)
        // this.backToAisleSetPointers(person);
        this.walkInAilse(person);
      } else {
        //person in his way in
        this.personGetsIntoHisRow(person);
      }
    }
  }

  private backToAisleSetPointers(person: IPerson): void {
    let actives = this.activePersons.getQueueAsArray();
    let frontPerson = actives
      .filter(
        p =>
          p.position.column === this.plane.getCenter() &&
          p.position.row > person.position.row
      )
      .reverse()[0];
    let backPerson = actives.filter(
      p =>
        p.position.column === this.plane.getCenter() &&
        p.position.row < person.position.row
    )[0];
    if (frontPerson && backPerson) {
      frontPerson.setBackPerson(person);
      backPerson.setFrontPerson(person);
    } else if (frontPerson) {
      frontPerson.setBackPerson(person);
    } else if (backPerson) {
      backPerson.setFrontPerson(person);
    }
    person.setFrontPerson(frontPerson);
    person.setBackPerson(backPerson);
  }

  private walkInAilse(person: IPerson) {
    let oldPos = person.position;
    let arrivedHisRow = person.aisleStep();
    let newPos = person.position;
    let isSamePos =
      oldPos.column === newPos.column && oldPos.row === newPos.row;
    if (arrivedHisRow && !isSamePos) {
      this.handlePersonInHisRowButInAisle(person);
    }
  }

  //return true if person in the row
  private walkInRow(person: IPerson): boolean {
    let arrivedHisSeat = person.rowStep();
    if (arrivedHisSeat && person.getDirection() !== Direction.LEAVE) {
      this.changePersonToBeInactive(person);
    } else if (this.isPersonInAisle(person)) {
      person.updateDirectionAccordinToTarget();
      if (person.getDirection() === Direction.FORWARD)
        this.backToAisleSetPointers(person);
      if (person.canMakeStep()) this.handlePersonInHisRowButInAisle(person);
    }
    return this.isPersonInAisle(person);
  }

  private personGetsIntoHisRow(person: IPerson) {
    if (!this.walkInRow(person)) {
      let frontPerson = person.getFrontPerson();
      let backPerson = person.getBackPerson();
      if (frontPerson && backPerson) {
        backPerson.setFrontPerson(frontPerson);
        frontPerson.setBackPerson(backPerson);
      } else if (frontPerson) frontPerson.setBackPerson(null);
      else if (backPerson) backPerson.setFrontPerson(null);
      person.setFrontPerson(null);
      person.setBackPerson(null);
      person.setBlockedPerson(null);
    }
  }

  private tellPersonToWalkOneStepBack(person: IPerson) {
    person.setTarget({
      row: person.getPosition().row - 1,
      column: person.getPosition().column
    });
  }

  private isPersonBlockedInRow(person: IPerson): boolean {
    let sittings = this.inactivePersons.isPersonBlocked(person);
    let actives = this.activePersons.isPersonBlocked(person);
    return sittings || actives;
  }

  private isPersonInAisle(person: IPerson): boolean {
    return person.getPosition().column === this.plane.getCenter();
  }

  private changePersonToBeInactive(person: IPerson) {
    this.activePersons.remove(person);
    this.inactivePersons.add(person);
  }

  private getAllBlockersOfPerson(person: IPerson): Array<IPerson> {
    const mult = person.ticket.column > person.position.column ? 1 : -1;
    let sittings = this.inactivePersons.getAllBlockersOfPerson(person);
    let actives = this.activePersons.getAllBlockersOfPerson(person);
    return sittings.concat(actives).sort((a: IPerson, b: IPerson) => {
      return (a.getPosition().column - b.getPosition().column) * mult;
    });
  }

  private addToActiveBefore(toAdd: IPerson, before: IPerson): void {
    this.inactivePersons.remove(toAdd);
    this.activePersons.addToQueueBefore(toAdd, before);
  }

  //if there is person in newTarget, set this person to newTarget + 1
  // private setPersonTargetInBlock(person: IPerson, newTarget: Position): void {
  //   let personInNewTarget = this.activePersons.getPersonInTarget(newTarget);
  //   if (personInNewTarget) {
  //     let nextTarget: Position = {
  //       row: newTarget.row + 1,
  //       column: newTarget.column
  //     };
  //     this.setPersonTargetInBlock(personInNewTarget, nextTarget);
  //   }
  //   person.setTarget(newTarget);
  // }
  //tell the blockers in the row to empty the row.
  private notifyAllSittingBlockersOfPerson(person: IPerson) {
    let blockers: Array<IPerson> = this.getAllBlockersOfPerson(
      person
    ).reverse();
    let numOfBlockers: number = blockers.length;
    let rowNumber: number = blockers[0].getPosition().row;
    let aisleColumnNum: number = this.plane.getCenter();
    for (let i = 0; i < numOfBlockers; i++) {
      let blocker: IPerson = blockers[i];
      let newTarget = { column: aisleColumnNum, row: rowNumber + i + 1 };
      blocker.setTarget(newTarget);
      blocker.setBlockedPerson(person);
      let beforePerson = i === 0 ? person : blockers[i - 1];
      this.addToActiveBefore(blocker, beforePerson);
    }
  }

  getPlane(): IPlane {
    return this.plane;
  }
  getIterations(): number {
    return this.iterations;
  }

  cleanSnapshot() {
    for (let i = 0; i < this.snapshot.length; i++) {
      for (let j = 0; j < this.snapshot[0].length; j++) {
        this.snapshot[i][j] = { row: i, column: j, person: null };
      }
    }
  }

  toSnapshot() {
    let outsideGuys = [];

    this.cleanSnapshot();
    this.activePersons.forEach(person => {
      const position = person.getPosition();
      if (
        position.row >= 0 &&
        position.column >= 0 &&
        position.row < this.snapshot.length &&
        position.column < this.snapshot[0].length
      ) {
        if (
          this.snapshot[position.row][position.column].person !== null &&
          this.snapshot[position.row][position.column].person !== person.id
        ) {
          this.snapshot[position.row][position.column].otherPerson = person.id;
        } else {
          this.snapshot[position.row][position.column].person = person.id;
        }
      } else {
        outsideGuys.push(
          `${person.id} <${person.position.row}, ${person.position.column}> [${person.target.row}, ${person.target.column}]`
        );
      }
    });

    this.inactivePersons.forEach(person => {
      const position = person.getPosition();
      if (
        position.row >= 0 &&
        position.column >= 0 &&
        position.row < this.snapshot.length &&
        position.column < this.snapshot[0].length
      ) {
        if (
          this.snapshot[position.row][position.column].person !== null &&
          this.snapshot[position.row][position.column].person !== person.id
        ) {
          this.snapshot[position.row][position.column].otherPerson = person.id;
        } else {
          this.snapshot[position.row][position.column].person = person.id;
        }
      } else {
        outsideGuys.push(
          `${person.id} <${person.position.row}, ${person.position.column}> [${person.target.row}, ${person.target.column}]`
        );
      }
    });

    let iterateSnap = this.snapshot.reduce(
      (acc, curr) =>
        `${acc}\n${curr
          .map(({ row, column, person, otherPerson }) => {
            const isLegalRow =
              column === this.plane.centerColumn ||
              this.plane.aisle[row].hasRows;
            // (row !== 0 &&
            //   row <= this.plane.rows &&
            //   row % this.plane.spaceBetweenRows === 0);

            return isLegalRow
              ? `<${row},${column}> [${person !== null ? person : " "}] ${
                  otherPerson ? `[${otherPerson}]` : ""
                }`
              : "        ";
          })
          .join("\t")}`,
      ""
    );

    // console.log(iterateSnap);
    this.activePersons.print();
    this.inactivePersons.print();
  }
}

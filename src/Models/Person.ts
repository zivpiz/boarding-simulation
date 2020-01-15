import { Position, Person_Mode } from "./types";
import { IPerson } from "./interfaces";

class Person implements IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  position: Position; //current position
  target: Position; //next positon to be at
  ticket: Position | null;
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  asked: IPerson; //save the person who asked to change target
  direction: Person_Mode; //person movement direction

  setFrontPerson(person: IPerson): void {
    throw "implementation";
  }
  setBackPerson(person: IPerson): void {
    throw "implementation";
  }

  //Step to the target. Ask frontPerson/ backPerson to change target if needed
  //called by simulator
  //return true if at this seat aisle
  step(): boolean {
    throw "implementation";
  }
  //ask blocker to change his target
  askToChangeTarget(blocker: IPerson, newTarget: Position): void {
    throw "implementation";
  }
  //set this target to newTarget;
  setTarget(newTarget: Position): boolean {
    throw "implementation";
  }
  //change this person target to his ticket position
  backToSeat(): void {
    throw "implementation";
  }
  //return true if this person at target
  atTarget(): boolean {
    throw "implementation";
  }
}

export default Person;

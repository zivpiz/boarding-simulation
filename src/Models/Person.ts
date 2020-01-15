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
    {
      throw "implementation";
    }
  }

  step(): boolean {
    throw "implementation";
  }

  askToChangeTarget(blocker: IPerson, newTarget: Position): void {
    throw "implementation";
  }

  answerTargetChanging(newTarget: Position): boolean {
    throw "implementation";
  }

  backToSeat(): void {
    throw "implementation";
  }

  atTarget(): boolean {
    throw "implementation";
  }
}

export default Person;

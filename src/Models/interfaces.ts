import { Person_Mode, AisleBlock, EmptyAisleBlock, Position } from "./types";

export interface IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  ticket: Position | null;
  target: Position; //next positon to be at
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  asked: IPerson; //save the person who asked to change target
  direction: Person_Mode; //person movement direction

  setFrontPerson(person: IPerson): void;
  setBackPerson(person: IPerson): void;

  //Step to the target. Ask frontPerson/ backPerson to change target if needed
  //called by simulator
  step(): void;
  //ask blocker to change his target
  askToChangeTarget(blocker: IPerson, newTarget: Position): void;
  //change this target to newTarget;
  answerTargetChanging(newTarget: Position): boolean;
  //change this person target to his ticket position
  backToSeat(): void;
  //return true if this person at target
  atTarget(): boolean;
}

export interface IPlane {
  rows: number;
  columns: number;
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
}

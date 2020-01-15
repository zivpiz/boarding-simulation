export interface IPerson {
  atTarget: boolean;
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; // iterations for luggage
  ticket: Position | null;
  target: Position; //next positon to be at
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; // the person behind this

  setFrontPerson(person: IPerson): void;
  setBackPerson(person: IPerson): void;
  reachedTarget(): boolean; //return this.atTarget

  //Step to the target. Ask frontPerson/ backPerson to change target if needed
  //called by simulator
  step(): void;
  //ask blocker to change his target
  askToChangeTarget(blocker: IPerson, newTarget: Position): void;
  //change this target to newTarget;
  answerTargetChanging(newTarget: Position): boolean;
}

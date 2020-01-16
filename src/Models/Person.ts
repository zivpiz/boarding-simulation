import { Position, Direction, Speed, isEqualPos } from "./types";
import { generateRandomSpeed } from "../utils";
import { IPerson } from "./interfaces";

export default class Person implements IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  position: Position; //current position
  target: Position; //next positon to be at
  ticket: Position | null;
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  direction: Direction; //person movement direction

  constructor(spaceBetweenRows: number, position: Position) {
    this.xSpeed = generateRandomSpeed(Speed.X, spaceBetweenRows);
    this.ySpeed = generateRandomSpeed(Speed.Y);
    this.luggageDelay = generateRandomSpeed(Speed.LUGGADE);
    this.position = position;
    this.frontPerson = null;
    this.backPerson = null;
    this.direction = Direction.FORWARD;
    this.ticket = null;
  }

  getTicket(): Position {
    return this.ticket;
  }
  getPosition(): Position {
    return this.position;
  }
  getDirection(): Direction {
    return this.direction;
  }
  setTicket(ticket: Position): void {
    this.ticket = ticket;
  }
  setPosition(position: Position): void {
    this.position = position;
  }
  setFrontPerson(person: IPerson): void {
    this.frontPerson = person;
  }
  setBackPerson(person: IPerson): void {
    this.backPerson = person;
  }
  setTarget(newTarget: Position): void {
    let currTarget = this.target;
    let newDir =
      currTarget.row > newTarget.row ? Direction.BACKWARD : Direction.FORWARD;
    this.target = newTarget;
    this.direction = newDir;
  }
  //return true if this person at target
  atTarget(): boolean {
    return isEqualPos(this.position, this.target);
  }
  //ask blocker to change his target
  //apply and return true if this person dir === backward
  askToChangeTarget(blocker: IPerson, newTarget: Position): boolean {
    let isBackward = this.direction === Direction.BACKWARD;
    if (isBackward) blocker.setTarget(newTarget);
    return isBackward;
  }
  //set this person target to his ticket position
  backToSeat(): void {
    this.setTarget(this.ticket);
  }
  //return true if this person at his seat aisle
  atSeatAisle(): boolean {
    return this.position.row === this.ticket.row;
  }
  //return the number of aisleBlocks to move forward
  //depend on this position, target, frontPerson and ySpeed
  getForwardYSteps(): number {
    let farAsPossible = this.frontPerson
      ? this.target.row >= this.frontPerson.position.row
        ? this.frontPerson.position.row - 1
        : this.target.row
      : this.target.row;
    return Math.min(farAsPossible, this.ySpeed);
  }
  //return the number of aisleBlocks to move backward
  //depend on this position, target, backPerson and ySpeed
  getBackwardYSteps(): number {
    let farAsPossible = this.backPerson
      ? this.target.row <= this.backPerson.position.row
        ? this.backPerson.position.row - 1
        : this.target.row
      : this.target.row;
    return Math.min(farAsPossible, this.ySpeed);
  }
  //return true if direction = backward and backPerson
  //block this from step steps back in current iteration
  isBackBlocked(steps: number, newPosition: Position): boolean {
    return (
      this.direction === Direction.BACKWARD &&
      newPosition.row === this.backPerson.position.row + 1 &&
      !isEqualPos(this.target, newPosition)
    );
  }

  private newRowPositionByDir(steps: number, dir: Direction): Position {
    return dir === Direction.FORWARD
      ? { row: this.position.row + steps, column: this.position.column }
      : { row: this.position.row - steps, column: this.position.column };
  }
  //Step to the row target in the aisle.
  //Ask backPerson to change target if needed
  //back to seat if at target
  //return true if at this seat aisle
  aisleStep(): boolean {
    if (this.atTarget) this.backToSeat;
    let stepsToRow: number =
      this.direction === Direction.FORWARD
        ? this.getForwardYSteps()
        : this.getBackwardYSteps();
    let newPosition: Position = this.newRowPositionByDir(
      stepsToRow,
      this.direction
    );
    let backBlock: boolean = this.isBackBlocked(stepsToRow, newPosition);
    if (backBlock)
      this.askToChangeTarget(
        this.backPerson,
        this.newRowPositionByDir(1, Direction.BACKWARD)
      );
    this.position = newPosition;
    if (this.atTarget()) this.backToSeat;

    return this.position.row === this.ticket.row;
  }

  //assume that no one blocks the way to the seat
  //step inside this ticket.row if at right row
  //and target === ticket, else, return false
  rowStepToSeat(): boolean {
    if (isEqualPos(this.target, this.ticket) && this.atSeatAisle()) {
      this.setPosition(this.ticket);
      return true;
    } else return false;
  }
}

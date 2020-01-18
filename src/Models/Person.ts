import { Position, Direction, Speed, isEqualPos } from "./types";
import { generateRandomSpeed, generateRandomNatNumber } from "../utils";
import { IPerson } from "./interfaces";

export default class Person implements IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  luggageCount: number; //the number of luggage to store
  position: Position; //current position
  target: Position; //next positon to be at
  ticket: Position | null;
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  blockedPerson: IPerson; //the person who blocked by me in the row
  direction: Direction; //person movement direction
  percentage: number; //the percentage this iteration left

  constructor(spaceBetweenRows: number, position: Position) {
    this.xSpeed = generateRandomSpeed(Speed.X, spaceBetweenRows);
    this.ySpeed = generateRandomSpeed(Speed.Y);
    this.luggageDelay = generateRandomSpeed(Speed.LUGGADE);
    this.luggageCount = generateRandomNatNumber(0, 3);
    this.position = position;
    this.frontPerson = null;
    this.backPerson = null;
    this.blockedPerson = null;
    this.direction = Direction.FORWARD;
    this.ticket = null;
    this.percentage = 0;
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
  getLuggageCount(): number {
    return this.luggageCount;
  }
  getSpeed(type: Speed): number {
    switch (type) {
      case Speed.X:
        return this.xSpeed;
      case Speed.Y:
        return this.ySpeed;
      case Speed.LUGGADE:
        return this.luggageDelay;
      default:
        return this.xSpeed;
    }
  }
  getPercentage(): number {
    return this.percentage;
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
  setBlockedPerson(person: IPerson): void {
    this.blockedPerson = person;
  }
  setTarget(newTarget: Position): void {
    let currDir: Direction = this.direction;
    let currPos: Position = this.position;
    let newDir: Direction;
    if (currDir === Direction.FORWARD || currDir === Direction.BACKWARD)
      newDir =
        currPos.row > newTarget.row ? Direction.BACKWARD : Direction.FORWARD;
    else
      newDir = this.target === this.ticket ? Direction.ENTER : Direction.LEAVE;
    this.target = newTarget;
    this.direction = newDir;
  }
  setDirection(dir: Direction): void {
    this.direction = dir;
  }

  decreasePercentageBy(percentage: number): void {
    this.percentage -= percentage;
  }

  initPercentage(): void {
    this.percentage = 100;
  }

  private getValuePerPrecentage(percentage: number, value: number): number {
    return Math.floor((percentage * value) / 100);
  }

  private getPrecentagePerValue(full: number, used: number): number {
    return (used * 100) / full;
  }
  getFronPerson(): IPerson {
    return this.frontPerson;
  }
  getBackPerson(): IPerson {
    return this.backPerson;
  }

  getBlockedPerson(): IPerson {
    return this.blockedPerson;
  }

  //return the speed used - "value" in precentage of
  //the speed wich could be used by this person
  private precentagePerSpeedValue(value: number, type: Speed): number {
    switch (type) {
      case Speed.X:
        return this.getPrecentagePerValue(this.xSpeed, value);
      case Speed.Y:
        return this.getPrecentagePerValue(this.ySpeed, value);
      case Speed.LUGGADE:
        return this.getPrecentagePerValue(this.luggageDelay, value);
      default:
        throw `There is no ${type} Speed type`;
    }
  }

  //put Speed.LUGGAGE in storage if atSeatAisle
  //return true if this luggage === 0
  //else return false
  putLuggage(): boolean {
    if (this.luggageCount === 0) return true;
    let possible = this.getValuePerPrecentage(
      this.percentage,
      this.luggageDelay
    );
    let luggageToStore = Math.min(possible, this.luggageCount);
    this.luggageCount -= luggageToStore;
    this.decreasePercentageBy(
      this.precentagePerSpeedValue(luggageToStore, Speed.LUGGADE)
    );
    return this.luggageCount === 0;
  }
  //return true if this person at target
  atTarget(): boolean {
    return isEqualPos(this.position, this.target);
  }
  //ask blocker to change his target
  //apply and return true if this person dir === backward
  askOtherToChangeTarget(blocker: IPerson, newTarget: Position): boolean {
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
  //depend on this position, target, frontPerson, ySpeed
  //and precentage
  getForwardYSteps(): number {
    let farAsPossible = this.frontPerson
      ? this.target.row >= this.frontPerson.position.row
        ? this.frontPerson.position.row - 1
        : this.target.row
      : this.target.row;
    farAsPossible = Math.min(farAsPossible, this.ySpeed);
    return this.getValuePerPrecentage(this.percentage, farAsPossible);
  }
  //return the number of aisleBlocks to move backward
  //depend on this position, target, backPerson and ySpeed
  //and precentage
  getBackwardYSteps(): number {
    let farAsPossible = this.backPerson
      ? this.target.row <= this.backPerson.position.row
        ? this.backPerson.position.row - 1
        : this.target.row
      : this.target.row;
    farAsPossible = Math.min(farAsPossible, this.ySpeed);
    return this.getValuePerPrecentage(this.percentage, farAsPossible);
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
    let aisleSteps: number =
      this.direction === Direction.FORWARD
        ? this.getForwardYSteps()
        : this.getBackwardYSteps();
    let newPosition: Position = this.newRowPositionByDir(
      aisleSteps,
      this.direction
    );
    let backBlock: boolean = this.isBackBlocked(aisleSteps, newPosition);
    if (backBlock)
      this.askOtherToChangeTarget(
        this.backPerson,
        this.newRowPositionByDir(1, Direction.BACKWARD)
      );
    this.decreasePercentageBy(
      this.precentagePerSpeedValue(aisleSteps, Speed.Y)
    );
    this.position = newPosition;
    if (this.atTarget()) this.backToSeat();

    return this.position.row === this.ticket.row;
  }

  //Step to the column target in the row.
  //Ask blocked to change target if needed
  //return true if at this seat column
  rowStep(): boolean {
    // let rowSteps: number =
    //   this.direction === Direction.FORWARD
    //     ? this.getForwardYSteps()
    //     : this.getBackwardYSteps();
    // let newPosition: Position = this.newRowPositionByDir(
    //   aisleSteps,
    //   this.direction
    // );
    // let backBlock: boolean = this.isBackBlocked(aisleSteps, newPosition);
    // if (backBlock)
    //   this.askOtherToChangeTarget(
    //     this.backPerson,
    //     this.newRowPositionByDir(1, Direction.BACKWARD)
    //   );
    // this.decreasePercentageBy(
    //   this.precentagePerSpeedValue(aisleSteps, Speed.Y)
    // );
    // this.position = newPosition;
    // if (this.atTarget()) this.backToSeat;

    return this.position.column === this.ticket.column;
  }

  hasMoreLuggage(): boolean {
    return this.luggageCount !== 0;
  }
  //this.position === this.ticket aisle center
  updateDirectionAccordinToTarget(): Direction {
    let newDir: Direction;
    let centerPos: Position = this.position;
    let target: Position = this.target;
    if (centerPos.row < target.row && centerPos.column === target.column) {
      newDir = Direction.FORWARD;
      this.setBlockedPerson(null);
    } else if (centerPos.row > target.row && centerPos.column === target.column)
      newDir = Direction.BACKWARD;
    else if (centerPos.row === target.row && centerPos.column !== target.column)
      newDir = Direction.ENTER;
    else throw "This Person is not in the middle of his seat ticket aisle";
    this.direction = newDir;
    return newDir;
  }
}

import { Position, Direction, Speed, isEqualPos } from "./types";
import { generateRandomSpeed, generateRandomNatNumber } from "../utils";
import { IPerson } from "./interfaces";

export default class Person implements IPerson {
  id: number;
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
  centerPlaneCol: number;

  constructor(spaceBetweenRows: number, position: Position, id: number) {
    this.id = id;
    this.xSpeed = 1;
    this.ySpeed = generateRandomSpeed(Speed.Y, spaceBetweenRows * 2);
    this.luggageDelay = generateRandomSpeed(Speed.LUGGADE);
    this.luggageCount = generateRandomNatNumber(0, 3);
    this.position = position;
    this.frontPerson = null;
    this.backPerson = null;
    this.blockedPerson = null;
    this.direction = Direction.FORWARD;
    this.ticket = null;
    this.percentage = 0;
    this.centerPlaneCol = position.column;
  }

  static createTestPerson(spaceBetweenRows: number, position: Position, id: number, ticket, ySpeed, luggageDel) : IPerson{
    let person = new Person(spaceBetweenRows, position, id);
    person.ySpeed = ySpeed;
    person.luggageDelay = luggageDel;
    person.ticket = ticket;
    return person;
  }

  getTicket(): Position {
    return this.ticket;
  }
  getTarget(): Position {
    return this.target;
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
    else newDir = newTarget === this.ticket ? Direction.ENTER : Direction.LEAVE;
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

  consumePrecentage(): void {
    this.percentage = 0;
  }

  private getValuePerPrecentage(percentage: number, value: number): number {
    return Math.floor((percentage * value) / 100);
  }

  private getPrecentagePerValue(full: number, used: number): number {
    return (used * 100) / full;
  }
  getFrontPerson(): IPerson {
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
    return (
      this.position.column === this.centerPlaneCol &&
      this.position.row === this.ticket.row
    );
  }
  //return true if this person at his seat aisle of after
  atSeatAisleOrAfter(): boolean {
    return (
      this.position.column === this.centerPlaneCol &&
      this.position.row >= this.ticket.row
    );
  }
  private getMaxStepsOfCurrPrecentage(steps: number, speed: Speed): number {
    const hasEnough = (steps: number): boolean =>
      this.precentagePerSpeedValue(steps, speed) <= this.percentage;
    while (steps > 0 && !hasEnough(steps)) {
      steps--;
    }
    return steps;
  }

  private hasSameBlockedPersonAs(other: IPerson): boolean {
    let otherBlocked;
    let thisBlocked = this.getBlockedPerson();
    if (!other) return false;
    otherBlocked = other.getBlockedPerson();
    return thisBlocked === otherBlocked && thisBlocked !== null;
  }
  //return the number of aisleBlocks to move forward
  //depend on this position, target, frontPerson, ySpeed
  //and precentage
  private getForwardYSteps(): number {
    let frontPerson = this.getFrontPerson();
    let isSameBlocked = this.hasSameBlockedPersonAs(frontPerson);
    let farthestRowTarget = frontPerson
      ? frontPerson.atSeatAisleOrAfter() &&
        !this.hasSameBlockedPersonAs(frontPerson) &&
        frontPerson.getBlockedPerson() !== this
        ? Math.min(frontPerson.getTicket().row - 2, this.target.row)
        : this.target.row >= this.frontPerson.position.row
        ? frontPerson.getPosition().row - 1
        : this.target.row
      : this.target.row;
    let steps = Math.abs(farthestRowTarget - this.position.row);
    steps = Math.min(steps, this.ySpeed);
    return this.getMaxStepsOfCurrPrecentage(steps, Speed.Y);
  }

  private getBackwardYSteps(): number {
    let blockedPerson = this.getBlockedPerson();
    let backPerson = this.getBackPerson();
    let farthestRowTarget = !backPerson
      ? this.target.row
      : blockedPerson
        ? !blockedPerson.atSeatRow()
          ? blockedPerson.position.row >= backPerson.position.row
            ? Math.max(this.target.row, blockedPerson.position.row + 1)
            : this.position.row
          : Math.max(this.target.row, backPerson.position.row + 1)
        : Math.max(this.target.row, backPerson.position.row + 1)

    let steps = Math.abs(farthestRowTarget - this.position.row);
    steps = Math.min(steps, this.ySpeed);
    return this.getMaxStepsOfCurrPrecentage(steps, Speed.Y);
  }
  private getEnterXSteps(): number {
    return this.getMaxStepsOfCurrPrecentage(this.xSpeed, Speed.X);
  }
  //return true if this person at his seat row but not in the aisle
  atSeatRow(): boolean {
    let { row, column } = this.position;
    return row === this.ticket.row && column !== this.centerPlaneCol;
  }

  private getLeaveXSteps(): number {
    const isOneStep = (first: Position, second: Position): boolean => {
      return (
        first.row === second.row && Math.abs(first.column - second.column) === 1
      );
    };
    let blocker = isOneStep(this.blockedPerson.position, this.position)
      ? this.blockedPerson
      : this.frontPerson;
    let step =
      blocker && this.position.row === blocker.position.row
        ? Math.abs(this.position.column - blocker.position.column) > 1
          ? 1
          : 0
        : 1;
    return this.getMaxStepsOfCurrPrecentage(step, Speed.X);
  }

  isBackBlocked(steps: number, newPosition: Position): boolean {
    return (
      this.direction === Direction.BACKWARD &&
      this.backPerson &&
      newPosition.row === this.backPerson.position.row + 1 &&
      !isEqualPos(this.target, newPosition)
    );
  }

  private newPositionByDir(steps: number, dir: Direction): Position {
    let newColumnPos =
      this.target.column < this.position.column
        ? this.position.column - steps
        : this.position.column + steps;
    switch (dir) {
      case Direction.FORWARD:
        return { row: this.position.row + steps, column: this.position.column };
      case Direction.BACKWARD:
        return { row: this.position.row - steps, column: this.position.column };
      case Direction.ENTER:
        return { row: this.position.row, column: newColumnPos };
      case Direction.LEAVE:
        return { row: this.position.row, column: newColumnPos };
    }
  }
  //Step to the row target in the aisle.
  //Ask backPerson to change target if needed
  //back to seat if at target
  //return true if at this seat aisle
  aisleStep(): boolean {
    if (this.atTarget()) this.backToSeat;
    let aisleSteps: number =
      this.direction === Direction.FORWARD
        ? this.getForwardYSteps()
        : this.getBackwardYSteps();
    let newPosition: Position = this.newPositionByDir(
      aisleSteps,
      this.direction
    );

    this.decreasePercentageBy(
      this.precentagePerSpeedValue(aisleSteps, Speed.Y)
    );
    this.position = newPosition;
    if (this.atTarget()) this.backToSeat(); //consumePresentage if has call to walk again

    return this.position.row === this.ticket.row;
  }

  //Step to the column target in the row.
  //return true if at this seat column
  rowStep(): boolean {
    let rowSteps: number =
      this.direction === Direction.ENTER
        ? this.getEnterXSteps()
        : this.getLeaveXSteps();
    let newPosition: Position = this.newPositionByDir(rowSteps, this.direction);
    this.decreasePercentageBy(this.precentagePerSpeedValue(rowSteps, Speed.X));
    this.position = newPosition;
    return this.position.column === this.ticket.column;
  }

  hasMoreLuggage(): boolean {
    return this.luggageCount !== 0;
  }
  //this.position === this.ticket center of aisle
  updateDirectionAccordinToTarget(): Direction {
    let newDir: Direction;
    let centerPos: Position = this.position;
    let target: Position = this.target;
    if (centerPos.row < target.row && centerPos.column === target.column)
      newDir = Direction.FORWARD;
    else if (centerPos.row > target.row && centerPos.column === target.column)
      newDir = Direction.BACKWARD;
    else if (
      centerPos.row === target.row &&
      centerPos.column !== target.column
    ) {
      newDir = Direction.ENTER;
      this.setBlockedPerson(null);
    } else {
      throw "This Person is not in the middle of his seat ticket aisle";
    }
    this.direction = newDir;
    return newDir;
  }

  canMakeStep(): boolean {
    let canWalk = (steps: number): boolean => steps > 0;
    switch (this.direction) {
      case Direction.FORWARD:
      case Direction.BACKWARD:
        return canWalk(
          this.getValuePerPrecentage(this.percentage, this.ySpeed)
        );
      case Direction.ENTER:
      case Direction.LEAVE:
        return canWalk(
          this.getValuePerPrecentage(this.percentage, this.xSpeed)
        );
      default:
        throw "This person have no Direction";
    }
  }

  toString(): string {
    return `id: ${this.id}, 
    xSpeed: ${this.xSpeed},
    ySpeed: ${this.ySpeed},
    luggageDelay: ${this.luggageDelay},
    luggageCount: ${this.luggageCount},
    position: ${this.position},
    frontPerson: ${this.frontPerson ? this.frontPerson.id : null},
    backPerson: ${this.backPerson ? this.backPerson.id : null},
    blockedPerson: ${this.blockedPerson ? this.blockedPerson.id : null},
    direction: ${this.direction},
    ticket: ${this.ticket},
    percentage: ${this.percentage}`;
  }
}

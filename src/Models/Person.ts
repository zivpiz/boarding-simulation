import { Position, Direction, Speed, isEqualPos } from "./types";
import { IPerson } from "./interfaces";
import * as ticketingMethods from "../Strategies/ticketing-methods";
import Plane from "./Plane";

class Person implements IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  position: Position; //current position
  target: Position; //next positon to be at
  ticket: Position | null;
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  direction: Direction; //person movement direction

  constructor(plane: Plane, position: Position) {
    this.xSpeed = ticketingMethods.generateRandom(
      Speed.X,
      plane.spaceBetweenRows
    );
    this.ySpeed = ticketingMethods.generateRandom(Speed.Y);
    this.luggageDelay = ticketingMethods.generateRandom(Speed.LUGGADE);
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
    this.target = newTarget;
  }
  //return true if this person at target
  atTarget(): boolean {
    return isEqualPos(this.position, this.target);
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
  //change this person target to his ticket position
  backToSeat(): void {
    throw "implementation";
  }
}

export default Person;

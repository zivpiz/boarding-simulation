import {
  Direction,
  AisleBlock,
  EmptyAisleBlock,
  Position,
  SeatingMode,
  TicketAssignmetMode,
  Speed
} from "./types";

export interface IPerson {
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

  setFrontPerson(person: IPerson): void;
  setBackPerson(person: IPerson): void;
  setTicket(ticket: Position): void;
  setPosition(position: Position): void;
  setTarget(newTarget: Position): void;
  setDirection(dir: Direction): void;
  setBlockedPerson(person: IPerson): void;

  getTicket(): Position;
  getTarget(): Position;
  getPosition(): Position;
  getDirection(): Direction;
  getLuggageCount(): number;
  getSpeed(type: Speed): number;
  getPercentage(): number;
  getFrontPerson(): IPerson;
  getBackPerson(): IPerson;
  getBlockedPerson(): IPerson;

  hasMoreLuggage(): boolean;

  initPercentage(): void;
  consumePrecentage(): void;
  decreasePercentageBy(precentage: number): void;
  //put Speed.LUGGAGE in storage if atSeatAisle
  //depend on precentage
  //return true if this luggage === 0
  //else return false
  putLuggage(): boolean;
  //ask blocker to change his target
  //apply and return true if this person dir === backward
  askOtherToChangeTarget(blocker: IPerson, newTarget: Position): boolean;
  //change this person target to his ticket position
  backToSeat(): void;
  //return true if this person at target
  atTarget(): boolean;
  //return true if this person at his seat aisle
  atSeatAisle(): boolean;
  //return true if this person at his seat row but not in the aisle
  atSeatRow(): boolean;
  //return true if direction = backward and backPerson
  //block this from step steps back
  isBackBlocked(steps: number, newPosition: Position): boolean;
  //Step to the row target in the aisle.
  //Ask backPerson to change target if needed
  //back to seat if at target
  //return true if at this seat aisle
  aisleStep(): boolean;
  //assume that no one block the way to the seat
  //step inside this ticket.row if at right row
  //and target === ticket, else, return false
  rowStep(): boolean;
  updateDirectionAccordinToTarget(): Direction;
  canMakeStep(): boolean;
  toString(): String;
}

export interface IPlane {
  rows: number; //includes AisleBlock and EmptyAisleBlock
  seatsRows: number;
  columns: number; // includes the aisle/center column
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
  centerColumn: number; // center column index
  numberOfSeats: number;

  getAisle(): Array<AisleBlock | EmptyAisleBlock>;
  getCenter(): number;
  getNumberOfSeats(): number;
  initSeats(): void;
}

export interface IActivePersonsQueue {
  length: number;
  getQueueAsArray(): Array<IPerson>;
  addToQueueBefore(personToAdd: IPerson, before: IPerson);
  remove(personToRemove: IPerson);
  isPersonBlocked(person: IPerson): boolean;
  getAllBlockersOfPerson(person: IPerson): Array<IPerson>;
  forEach(lambda: (element: IPerson) => void);
  print: () => void;
}

export interface IInactivePersonsSet {
  length: number;
  getAllPersons(): Set<IPerson>;
  //get all persons between the person to his seat (order: the closet blocker to the person is first)
  getAllBlockersOfPerson(person: IPerson): Array<IPerson>;
  isPersonBlocked(person: IPerson): boolean;
  add(person: IPerson);
  remove(person: IPerson);
  forEach(lambda: (element: IPerson) => void);
  print: () => void;
}

export interface IPassengers {
  passengers: Array<IPerson>;
  plane: IPlane;

  getPassengers(): Array<IPerson>;
  initPersons(plane: IPlane, numOfPassengers: number): Array<IPerson>;

  //assign tickets to passengers by mode
  //return passengers
  assignTicketsBy(mode: TicketAssignmetMode): Array<IPerson>;

  //create sort queue by mode.
  //set Persons frontPerson and BackPerson by mode
  boardingBy(mode: SeatingMode): Array<IPerson>;
}

export interface ISimulator {
  getPlane(): IPlane;
  // passangers: IPassengers;
  getIterations(): number;
  //while not all passengers sitting
  //foreach manager.queue: person, person.aisleStep()
  //if person.aisleStep() === true && seatBlockedBy(person) --> askToChangeTargets
  //iterations++
  //returns iterations
  simulate(): number;
  toSnapshot(): void;
}

import Passengers from "./Passengers";
import Plane from "./plane";
import {
  Direction,
  AisleBlock,
  EmptyAisleBlock,
  Position,
  SeatingMode,
  TicketAssignmetMode
} from "./types";

export interface IPerson {
  xSpeed: number; //row speed
  ySpeed: number; //aisle speed
  luggageDelay: number; //iterations for luggage
  position: Position; //current position
  target: Position; //next positon to be at
  ticket: Position | null;
  frontPerson: IPerson; //the person in front of this
  backPerson: IPerson; //the person behind this
  //   asked: IPerson; //save the person who asked to change target
  direction: Direction; //person movement direction

  setFrontPerson(person: IPerson): void;
  setBackPerson(person: IPerson): void;
  setTicket(ticket: Position): void;
  setPosition(position: Position): void;
  setTarget(newTarget: Position): void;

  getTicket(): Position;
  getPosition(): Position;

  //Step to the target. Ask frontPerson/ backPerson to change target if needed
  //called by simulator
  //return true if at this seat aisle
  step(): boolean;
  //ask blocker to change his target
  askToChangeTarget(blocker: IPerson, newTarget: Position): void;
  //change this person target to his ticket position
  backToSeat(): void;
  //return true if this person at target
  atTarget(): boolean;
}

export interface IPlane {
  rows: number; //includes AisleBlock and EmptyAisleBlock
  columns: number; // includes the aisle/center column
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
  centerColumn: number; // center column index

  getAisle(): Array<AisleBlock | EmptyAisleBlock>;
  initSeats(): void;
}

export interface IManager {
  queueMode: SeatingMode;
  passengers: Passengers;
  queue: Array<IPerson>;
  sitting: Set<IPerson>;

  getQueue(): Array<IPerson>;
  getSitiing(): Set<IPerson>;

  //return set of persons that blocking person from sitting
  seatBlockedBy(person: IPerson): Set<IPerson>;

  //remove passenger from sitting set and
  //push person to queue after "after" position
  //and set his frontPerson and backPerson
  //return queue
  addToQueue(passenger: IPerson, after: number): Array<IPerson>;

  //remove persons set from queue,
  //set others frontPerson and backPerson
  //and add person to sitting set
  //return queue
  removeFromQueue(passengers: Set<IPerson>): Array<IPerson>;
}

export interface IPassengers {
  passengers: Array<IPerson>;
  plane: Plane;

  getPassengers(): Array<IPerson>;

  //assign tickets to passengers by mode
  //return passengers
  assignTicketsBy(mode: TicketAssignmetMode): Array<IPerson>;

  //create sort queue by mode.
  //set Persons frontPerson and BackPerson by mode
  boardingBy(plane: IPlane, passengers: IPassengers): Array<IPerson>;
}

export interface ISimulator {
  plane: Plane;
  passangers: Passengers;
  manager: IManager;
  iterations: number;

  //return set of persons that blocking person from sitting
  seatBlockedBy(person: IPerson): Set<IPerson>;

  //ask all group members to set their target
  //the group new target = seat.y+group.size
  //adds all group members to manager.queue for the next iteration
  askToClearSeatWay(group: Set<IPerson>): Array<IPerson>;

  //while not all passengers sitting
  //foreach manager.queue: person, person.step()
  //if person.step() === true && seatBlockedBy(person) --> askToChangeTargets
  //iterations++
  //returns iterations
  simulate(): number;
}

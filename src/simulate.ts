import * as _ from "lodash";
import { Person, Plane } from "./types";
import Passengers from './passengers';


const simulateBoarding = (plane: Plane, queue: Array<Person>): number => {
  let iterations = 0;

  while (_.some(queue, person => person.isSeated)) {
    
    iterations++;
  }

  return iterations;
};

export interface ISimulator {
  plane: Plane;
  passangers: Passengers;
  runSimulator(): number;
}

export class Simulator implements ISimulator {
  plane: Plane;
  passangers: Passengers;
  runSimulator(): number {
    throw new Error("Method not implemented.");
  }
}
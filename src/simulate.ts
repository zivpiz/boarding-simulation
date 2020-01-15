import * as _ from "lodash";
import { Plane } from "./Models/types";
import { Person } from "./Models/Person";
import Passengers from "./Models/passengers";

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

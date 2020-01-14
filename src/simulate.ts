import * as _ from "lodash";
import { Person, Plane } from "./types";

const simulateBoarding = (plane: Plane, queue: Array<Person>): number => {
  let iterations = 0;

  while (_.some(queue, person => person.isSeated)) {
    
    iterations++;
  }

  return iterations;
};

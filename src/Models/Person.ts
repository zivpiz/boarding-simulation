import { Position } from "./types";
import { IPerson } from "./interfaces";

export class Person implements IPerson {
  private atTarget: boolean;
  private xSpeed: number;
  private ySpeed: number;
  private luggageDelay: number;
  private ticket: Position | null;
  private target: Position;
  private frontPerson: IPerson;
  private backPerson: IPerson;
}

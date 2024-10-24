export type PseudoSocketModel = StopAction | GenerateList

type StopAction = {
  action: PseudoSocketActionType.Stop,
}

type GenerateList = {
  action: PseudoSocketActionType.GenerateList,
  options: PseudoSocketOptions
}

export enum PseudoSocketActionType {
  Stop,
  GenerateList,
}

export interface PseudoSocketOptions {
  interval: number;
  size: number;
}

export interface PseudoSocketDataItem {
  id: number;
  int: number;
  float: number;
  color: string;
  child: {
    id: number;
    color: string;
  };
}

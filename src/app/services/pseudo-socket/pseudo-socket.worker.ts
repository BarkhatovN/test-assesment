/// <reference lib="webworker" />

import { Subscription, map, timer } from "rxjs";
import { PseudoSocketModel, PseudoSocketActionType, PseudoSocketDataItem } from "./pseudo-socket.model";

let timer$: Subscription | null = null;

addEventListener('message', ({ data }: { data: PseudoSocketModel }) => {
  switch (data.action) {
    case PseudoSocketActionType.Stop:
      cleanSubscription();
      break;

    case PseudoSocketActionType.GenerateList:
      const { size, interval } = data.options;

      cleanSubscription();

      if (!size) {
        postMessage([]);
        break;
      }

      timer$ = timer(0, interval).pipe(
        map(() => generateList(size)),
      ).subscribe(items => postMessage(items));
      break;

    default:
      break;
  }
});

const generateList = (size: number): PseudoSocketDataItem[] => {
  return Array.from({ length: size }, (_, idx) => createRandomListItem(idx));
}

const createRandomListItem = (idx: number): PseudoSocketDataItem => {
  return {
    id: idx,
    int: getRandomInt(),
    float: getRandomFloat(),
    color: getRandomColor(),
    child: {
      id: getRandomInt(),
      color: getRandomColor()
    }
  };
}

const cleanSubscription = () => {
  timer$?.unsubscribe();
  timer$ = null;
};

const getRandomInt = (): number => Math.floor(Math.random() * 100000);

const getRandomFloat = (): number => parseFloat((Math.random() * 100).toFixed(18));

const getRandomColor = (): string => {
  return COLORS[Math.floor(Math.random() * (COLORS.length - 1))];
}

const COLORS =
  [
    'black',
    'silver',
    'gray',
    'white',
    'maroon',
    'red',
    'purple',
    'fuchsia',
    'green',
    'lime',
    'olive',
    'yellow',
    'navy',
    'blue',
    'teal',
    'aqua'
  ]

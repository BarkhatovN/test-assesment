import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject, tap } from 'rxjs';
import {
  PseudoSocketActionType,
  PseudoSocketDataItem,
  PseudoSocketModel,
  PseudoSocketOptions
} from '../pseudo-socket/pseudo-socket.model';


const DEFAULT_SIZE = 10;

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private worker!: Worker;

  private readonly specifiedIdsSubject$ = new BehaviorSubject<number[]>([]);
  private readonly data$ = new Subject<PseudoSocketDataItem[]>();

  filteredData$: Observable<PseudoSocketDataItem[]> = combineLatest(
    { data: this.data$, specifiedIds: this.specifiedIdsSubject$ }
  ).pipe(
    map(({ data, specifiedIds }) => {
      const filteredValues = specifiedIds.map(id => data.find(v => v.id === id))
        .filter(Boolean) as PseudoSocketDataItem[];

      const restValues = data.filter(v => !specifiedIds.includes(v.id));
      return [...filteredValues, ...restValues].slice(0, DEFAULT_SIZE);
    }),
  );

  constructor() {
    this.worker = this.createWorker();
    this.worker.onmessage = ({ data }: { data: PseudoSocketDataItem[] }) => this.data$.next(data);
  }

  stopListProcessing(): void {
    const socketAction: PseudoSocketModel = {
      action: PseudoSocketActionType.Stop,
    };

    this.worker.postMessage(socketAction);
    this.worker.terminate();
  }

  changeSpecifiedIds(values: number[]): void {
    this.specifiedIdsSubject$.next(values);
  }

  generateNewList(options: PseudoSocketOptions): void {
    const socketAction: PseudoSocketModel = {
      action: PseudoSocketActionType.GenerateList,
      options: options,
    };

    this.worker.postMessage(socketAction);
  }

  private createWorker(): Worker {
    return new Worker(new URL('../pseudo-socket/pseudo-socket.worker.ts', import.meta.url));
  }
}

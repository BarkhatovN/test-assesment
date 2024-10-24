import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DisplayItem } from '../display-item';
import { map, Observable } from "rxjs";
import { PseudoSocketDataItem, PseudoSocketOptions } from "../services/pseudo-socket/pseudo-socket.model";
import { ManagerService } from "../services/manager/manager.service";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy {
  list$: Observable<DisplayItem[]> = this.manager.filteredData$.pipe(
    map(list => list.map((item: PseudoSocketDataItem) => this.mapListItemToDisplayItem(item)))
  );

  readonly defaultIntervalMs = 1000;
  readonly defaultSize = 1000;

  constructor(private readonly manager: ManagerService) {
  }

  ngOnInit() {
    this.manager.generateNewList({ size: this.defaultSize, interval: this.defaultIntervalMs })
  }

  ngOnDestroy() {
    this.manager.stopListProcessing();
  }

  private mapListItemToDisplayItem(item: PseudoSocketDataItem): DisplayItem {
    return new DisplayItem(
      item.id,
      item.int,
      item.color,
      item.float,
      item.child.id,
      item.child.color
    );
  };

  filterChanged({ options, specifiedIds }: { options?: PseudoSocketOptions; specifiedIds?: number[] }) {
    if (options) {
      this.manager.generateNewList(options);
    }
    if (specifiedIds) {
      this.manager.changeSpecifiedIds(specifiedIds);
    }
  }
}


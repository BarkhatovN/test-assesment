import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input,
  OnDestroy,
  OnInit, Output,
} from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup,
} from '@angular/forms';
import { Subject, debounceTime, filter, map, takeUntil, combineLatest, startWith } from 'rxjs';
import { arraySizeValidator, specifiedIdsValidator, timerValidator } from "./filter.validator";
import { PseudoSocketOptions } from "../../../services/pseudo-socket/pseudo-socket.model";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() defaultIntervalMs: number = 0;
  @Input() defaultSize: number = 0;

  @Output() filterChanged = new EventEmitter<{ options?: PseudoSocketOptions, specifiedIds?: number[] }>

  private readonly destroy$ = new Subject<void>();
  filterForm?: FormGroup<{
    interval: FormControl<number | null>,
    size: FormControl<number | null>,
    specifiedIds: FormControl<string | null>,
  }>;

  constructor(private readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      interval: new FormControl<number | null>(this.defaultIntervalMs, [timerValidator()]),
      size: new FormControl<number | null>(this.defaultSize, [arraySizeValidator()]),
      specifiedIds: new FormControl<string | null>('', [specifiedIdsValidator()]),
    });

    const timeChanged$ = this.filterForm.controls.interval.valueChanges.pipe(
      startWith(this.defaultIntervalMs),
      filter((value: number | null): value is number => !!this.filterForm?.controls.interval.valid && value !== null),
      debounceTime(200),
    );

    const sizeChanged$ = this.filterForm.controls.size.valueChanges.pipe(
      startWith(this.defaultSize),
      filter((value: number | null): value is number => !!this.filterForm?.controls.size.valid && value !== null),
      debounceTime(200),
    )

    combineLatest({ size: sizeChanged$, interval: timeChanged$ })
      .subscribe((options) => this.filterChanged.emit({ options }));

    this.filterForm.controls.specifiedIds.valueChanges.pipe(
      debounceTime(200),
      filter((value: string | null): value is string => !!this.filterForm?.controls.specifiedIds.valid && !!value),
      map(value => this.mapSpecifiedIdsFromStringToArray(value)),
      takeUntil(this.destroy$),
    ).subscribe((specifiedIds: number[]) => this.filterChanged.emit({ specifiedIds }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapSpecifiedIdsFromStringToArray(value: string): number[] {
    return value.split(',').map(Number);
  }
}

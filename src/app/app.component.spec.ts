import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FilterComponent } from './table/components/filter/filter.component';
import { TableComponent } from './table/table.component';
import { ManagerService } from './services/manager/manager.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let listService: ManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FilterComponent,
        TableComponent,
      ],
      providers: [ManagerService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    listService = TestBed.inject(ManagerService);
  });

  it('should call generateNewList() on ngOnInit', () => {
    const generateNewListSpy = spyOn(listService, 'generateNewList');
    component.ngOnInit();

    expect(generateNewListSpy).toHaveBeenCalled();
  });

  it('should call stopListProcessing() on ngOnDestroy', () => {
    const stopListProcessingSpy = spyOn(listService, 'stopListProcessing');
    component.ngOnDestroy();

    expect(stopListProcessingSpy).toHaveBeenCalled();
  });

  it('should call changeInterval() with the correct value', () => {
    const changeIntervalSpy = spyOn(listService, 'changeInterval');
    const value = 500;
    component.changeTimer(value);

    expect(changeIntervalSpy).toHaveBeenCalledWith(value);
  });

  it('should call changeListSize() with the correct value', () => {
    const changeListSizeSpy = spyOn(listService, 'changeListSize');
    const value = 1000;
    component.changeArraySize(value);

    expect(changeListSizeSpy).toHaveBeenCalledWith(value);
  });

  it('should call changeSpecifiedIds() with the correct value', () => {
    const changeSpecifiedIdsSpy = spyOn(listService, 'changeSpecifiedIds');
    const value = [1, 2, 3];
    component.changeSpecifiedIds(value);

    expect(changeSpecifiedIdsSpy).toHaveBeenCalledWith(value);
  });
});

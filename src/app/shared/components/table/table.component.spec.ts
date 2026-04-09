import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumn, TableComponent } from './table.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface SimpleTableData {
  name: string;
  age: number;
  items?: { product: string }[];
}

const mockData: SimpleTableData[] = [
  { name: 'Alice', age: 30, items: [{ product: 'Book' }] },
  { name: 'Bob', age: 25, items: [{ product: 'Pen' }] },
  { name: 'Charlie', age: 35, items: [] }
];

const mockColumns: TableColumn<SimpleTableData>[] = [
  { key: 'name', label: 'Name', sortable: true, width: '50' },
  { key: 'age', label: 'Age', sortable: true, width: '50' }
];

describe('TableComponent', () => {
  let component: TableComponent<SimpleTableData>;
  let fixture: ComponentFixture<TableComponent<SimpleTableData>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableComponent<SimpleTableData>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rows based on input data', () => {
    component.data = mockData;
    component.columns = mockColumns;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should display correct values in the columns', () => {
    component.columns = mockColumns;
    component.data = mockData;
    fixture.detectChanges();

    const firstCell = fixture.nativeElement.querySelector('tbody tr td');
    expect(firstCell.textContent).toContain('Alice');
  });

  it('should sort column in asc order', () => {
    component.data = mockData;
    component.columns = mockColumns;
    // component.sort(mockColumns[1]);
    fixture.detectChanges();

    const headerCells = fixture.nativeElement.querySelectorAll('th');
    headerCells[1].click();
    fixture.detectChanges();

    expect(component.displayedData[0].age).toBe(25);
  });

  it('should toggle sort to desc', () => {
    component.data = mockData;
    component.columns = mockColumns;

    fixture.detectChanges();

    const headerCells = fixture.nativeElement.querySelectorAll('th');
    headerCells[1].click();
    fixture.detectChanges();
    headerCells[1].click();
    fixture.detectChanges();

    // component.sort(mockColumns[1]);
    // component.sort(mockColumns[1]);
    expect(component.displayedData[0].age).toBe(35);
  });

  it('should not sort if column is not sortable', () => {
    component.data = mockData;
    component.columns = mockColumns.map(c =>
      ({ ...c, sortable: false })
    );
    fixture.detectChanges();

    const headerCells = fixture.nativeElement.querySelectorAll('th');
    headerCells[1].click();
    fixture.detectChanges();

    expect(component.sortKey).toBeNull();
  })

  it('should calculate total Pages correctly', () => {
    component.data = mockData;
    component.pageSize = 2;
    component.columns = mockColumns;

    fixture.detectChanges();

    expect(component.totalPages).toBe(2);
  });

  it('should go to the next page on Next button click', () => {
    component.data = mockData;
    component.pageSize = 1;
    fixture.detectChanges();

    const paginationButtons: HTMLElement[] = fixture.nativeElement.querySelectorAll('.pagination button');
    paginationButtons[2].click();

    fixture.detectChanges();

    expect(component.currentPage).toBe(2);
  });

  it('should disable the previous page button when at first page', () => {
    component.data = mockData;
    component.pageSize = 2;
    fixture.detectChanges();

    const prevButton = fixture.nativeElement.querySelector('.pagination button');
    expect(prevButton.disabled).toBe(true);
  });

  it('should disable the next page button when at last page', () => {
    component.data = mockData;
    component.pageSize = 2;

    fixture.detectChanges();
    const paginationButtons = fixture.nativeElement.querySelectorAll('.pagination button');
    paginationButtons[paginationButtons.length - 2].click();
    fixture.detectChanges();
    const nextButton = paginationButtons[paginationButtons.length - 1];

    expect(nextButton.disabled).toBe(true);
  });

  it('should show expand and collapse row on button click', () => {
    component.data = mockData;
    component.columns = mockColumns;
    component.expandable = true;
    component.nestedKey = 'items';
    component.nestedColumns = [{ key: 'product', label: 'Product' }];

    fixture.detectChanges();

    const expandButton = fixture.nativeElement.querySelector('[data-test-id="expand-btn-0"]');
    expandButton.click();

    fixture.detectChanges();

    expect(component.expandedRow).toBe(0);

    const nestedTable = fixture.nativeElement.querySelector('.nested-table');
    expect(nestedTable).toBeTruthy();

    expandButton.click();
    fixture.detectChanges();

    expect(component.expandedRow).toBe(-1);
    const nestedAfterCollapse = fixture.nativeElement.querySelector('.nested-table');
    expect(nestedAfterCollapse).toBeFalsy();

  });

  it('should collapse expanded row when page changes via UI', () => {
    component.data = mockData;
    component.columns = mockColumns;
    component.expandable = true;
    component.pageSize = 1;
    component.nestedKey = 'items';
    component.nestedColumns = [{ key: 'product', label: 'Product' }];

    fixture.detectChanges();

    const expandButton = fixture.nativeElement.querySelector('[data-test-id="expand-btn-0"]');
    expandButton.click();
    fixture.detectChanges();

    expect(component.expandedRow).toBe(0);

    const paginationButtons = fixture.nativeElement.querySelectorAll('.pagination button');
    const nextBtn = paginationButtons[paginationButtons.length - 1];
    nextBtn.click();
    fixture.detectChanges();

    expect(component.expandedRow).toBe(-1);
  });

  it('should reorder columns on drop', () => {
    component.columns = [...mockColumns];

    component.dropColumn({
      previousIndex: 0,
      currentIndex: 1
    } as CdkDragDrop<TableColumn<SimpleTableData>[]>);

    expect(component.columns[0].key).toBe('age');
  });

  it('should update column width on resize', () => {
    component.columns = [...mockColumns];

    component.onColumnResize({ colIndex: 0, newWidthPercent: 60 });

    expect(component.columns[0].width).toBe('60%');
  });

});

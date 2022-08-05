import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent implements OnInit, OnChanges {
  @Input() totalCount: number;
  @Input() pageSize: number;
  @Output() pageChanged = new EventEmitter<number>();

  pageNumber = 1; //currently clicked page number
  pageCount = 0; // No of pages productCount/pageSize
  pageCounts: number[]; //array to hold the page number for looping
  bDisablePrev = false; //Whether to enable/disable the previous page button
  bDisableNext = false; //Whether to enable/disable the next page button
  bShowPaging = true; // Whether to show the paging control or not

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    // Implemented in ngOnChange inplace of ngOnInit
    // because ngOnChange will be called whenever there
    // is a change in parent, which is what happens when
    // we fetch products
    this.pageNumber = 1; //Start with the first page
    this.setPageCountArray();
    this.setEnableDisablePrimaryPageButtons();
  }

  ngOnInit(): void {}

  onPageClicked(page: number) {
    this.pageNumber = page;
    this.pageChanged.emit(page);
    this.setEnableDisablePrimaryPageButtons();
  }
  setPageCountArray() {
    this.pageCounts = new Array();
    this.pageCount = Math.ceil(this.totalCount / this.pageSize);

    this.pageCounts.length = this.pageCount;
    this.bShowPaging = this.pageCount > 1 ? true : false;
    for (let i = 0; i < this.pageCount; i++) {
      this.pageCounts[i] = i + 1;
    }
  }
  onPagePrimaryButtonClicked(type: string) {
    if (type == 'I') {
      if (this.pageNumber < this.pageCount) {
        this.pageNumber++;
      }
    }
    if (type == 'D') {
      if (this.pageNumber >= 2) {
        this.pageNumber--;
      }
    }
    this.pageChanged.emit(this.pageNumber);
    this.setEnableDisablePrimaryPageButtons();
  }
  setEnableDisablePrimaryPageButtons() {
    if (this.pageNumber == 1) {
      this.bDisablePrev = true;
    } else {
      this.bDisablePrev = false;
    }
    if (this.pageNumber == this.pageCount) {
      this.bDisableNext = true;
    } else {
      this.bDisableNext = false;
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';

@NgModule({
  declarations: [PagerComponent, PagingHeaderComponent],
  imports: [CommonModule, CarouselModule.forRoot()],
  exports: [PagingHeaderComponent, PagerComponent, CarouselModule],
})
export class SharedModule {}

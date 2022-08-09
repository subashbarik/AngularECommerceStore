import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { TestErrorComponent } from './components/test-error/test-error.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    NavBarComponent,
    NotFoundComponent,
    SectionHeaderComponent,
    ServerErrorComponent,
    TestErrorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  exports: [NavBarComponent, SectionHeaderComponent],
})
export class CoreModule {}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb';
import { BreadcrumbService } from '../../services/breadcrumb.service';
// import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
  breadcrumb$: Observable<IBreadcrumb[]>;
  constructor(private bcService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }
}

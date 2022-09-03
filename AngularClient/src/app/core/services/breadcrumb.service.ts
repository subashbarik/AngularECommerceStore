import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  Data,
} from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { IBreadcrumb } from 'src/app/shared/models/breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  bMap = new Map();

  constructor(private router: Router) {
    this.router.events
      .pipe(
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        // Construct the breadcrumb hierarchy
        this.bMap = new Map();
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs: IBreadcrumb[] = [];
        this.addBreadcrumb(root, [], breadcrumbs);
        // Emit the new hierarchy
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: IBreadcrumb[]
  ) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));

      // Add an element for the current route part
      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/'),
        };

        if (!this.bMap.get('Home')) {
          const breadcrumb = {
            label: 'Home',
            url: '',
          };
          breadcrumbs.push(breadcrumb);
          this.bMap.set('Home', true);
        }
        // to remove duplicates , not sure why routes such as 'shop' comes twice
        if (!this.bMap.get(this.getLabel(route.data))) {
          breadcrumbs.push(breadcrumb);
        }
        this.bMap.set(this.getLabel(route.data), true);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data.breadcrumb === 'function'
      ? data.breadcrumb(data)
      : data.breadcrumb;
  }
}

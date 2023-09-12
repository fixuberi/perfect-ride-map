import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * `NavigationService` primary role is to ensure that certain routes are only accessible
 * through specific user actions within the application, such as clicking a button,
 * rather than direct URL navigation or URL manipulation by users.
 *
 * Usage:
 * - To initiate navigation to a restricted route, use `navigateByUrl(url: string)`.
 * - The `isNavigationAllowed` getter checks if the navigation is permitted
 *   and immediately resets its state to prevent consecutive unauthorized accesses.
 *
 * This service works in tandem with the `CustomGuard` to implement the desired system behavior.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteNavigationService {
  private _isProgrammaticNav = false;

  constructor(private router: Router) {}

  get isProgrammaticNav(): boolean {
    const currentState = this._isProgrammaticNav;
    this._isProgrammaticNav = false;

    return currentState;
  }

  navigateByUrl(url: string): void {
    this._isProgrammaticNav = true;
    this.router.navigateByUrl(url);
  }
}

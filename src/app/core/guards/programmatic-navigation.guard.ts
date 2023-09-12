import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouteNavigationService } from '../services/route-navigation.service';

export const programmaticNavigationGuard: CanActivateFn = (route, state) => {
  const navServcie = inject(RouteNavigationService);

  return navServcie.isProgrammaticNav;
};

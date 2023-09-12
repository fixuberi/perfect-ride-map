import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { programmaticNavigationGuard } from '@app/core/guards/programmatic-navigation.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    canMatch: [programmaticNavigationGuard],
    children: [
      {
        path: 'ride',
        loadChildren: () =>
          import('./features/ride/ride.module').then((m) => m.RideModule),
      },
    ],
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

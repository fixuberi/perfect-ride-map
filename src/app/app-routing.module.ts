import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/ride', pathMatch: 'full' },
  {
    path: 'ride',
    loadChildren: () =>
      import('./features/ride/ride.module').then((m) => m.RideModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

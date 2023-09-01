import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideComponent } from './components/ride/ride.component';

const routes: Routes = [{ path: '', component: RideComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RideRoutingModule {}

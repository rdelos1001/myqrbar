import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaresPage } from './bares.page';

const routes: Routes = [
  {
    path: '',
    component: BaresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaresPageRoutingModule {}

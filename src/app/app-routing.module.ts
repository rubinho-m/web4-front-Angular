import {NgModule} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {PointsListComponent} from "./points-list/points-list.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {MainComponent} from "./main/main.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
    {path: 'home', component: HomePageComponent},
    {path: 'points', component: MainComponent, canActivate: [AuthGuard]},
    // {path: 'points', component:MainComponent},
    {path: 'auth', component: AuthComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

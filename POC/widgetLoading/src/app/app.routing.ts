import { Routes, RouterModule } from '@angular/router';

import { WatchlistComponent } from './Components/WatchlistComponent/watchlist-component';
import { OrderTicketComponent } from './Components/OrderTicketComponent/order-ticket-component';
import { NewsComponent } from './Components/NewsComponent/news-component';
import { HomeComponent} from './Components/HomeComponent/home-component';
import { TradeComponent } from './Components/TradeComponent/trade-component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path : 'wl',
        component: WatchlistComponent,
      },
      {
        path : 'ot',
        component: OrderTicketComponent,
      },
      {
        path : 'nws',
        component: NewsComponent,
      },
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path : 'wl',
    component: WatchlistComponent,
  },
  {
    path : 'ot',
    component: OrderTicketComponent,
  },
  {
    path : 'nws',
    component: NewsComponent,
  },
  {
    path : 'trade',
    component: TradeComponent,
  }
];

export const appRoutingProviders: any[] = [
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: false });



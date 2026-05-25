import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  sidenavOpen = signal(false);

  private readonly routerSub: Subscription = this.router.events
    .pipe(filter((e) => e instanceof NavigationEnd))
    .subscribe(() => this.sidenavOpen.set(false));

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  toggleSidenav(): void {
    this.sidenavOpen.update((v) => !v);
  }

  closeSidenav(): void {
    this.sidenavOpen.set(false);
  }
}

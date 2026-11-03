import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { ApiService } from '#core/services/api.service';
import { WsService } from '#core/services/ws.service';
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly api = inject(ApiService);
  private readonly ws = inject(WsService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly statusResource = rxResource({
    stream: () => this.api.getStatus(),
  });

  protected apiOnline = computed(
    () => !!this.statusResource.value() && !this.statusResource.error(),
  );
  protected activeCount = computed(() => {
    const s = this.statusResource.value();
    return s ? s.active + s.queue_size : 0;
  });
  protected wsLive = signal(false);

  constructor() {
    interval(10_000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.statusResource.reload());

    this.ws
      .watchQueue()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => this.wsLive.set(true),
        error: () => this.wsLive.set(false),
      });
  }

  protected logout(): void {
    this.ws.closeQueue();
    this.auth.logout().subscribe(() => void this.router.navigate(['/login']));
  }
}

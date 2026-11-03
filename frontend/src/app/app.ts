import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '#shared/components/sidebar/sidebar.component';
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen flex">
      @if (auth.authenticated()) {
        <app-sidebar />
      }
      <div [class.ml-52]="auth.authenticated()" class="flex-1 flex flex-col">
        <router-outlet />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly auth = inject(AuthService);
}

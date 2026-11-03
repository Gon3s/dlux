import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '#core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <main class="min-h-screen flex items-center justify-center px-6">
      <form
        class="w-full max-w-sm p-8 rounded border"
        style="background:#0a0a0a;border-color:#2d351b"
        (ngSubmit)="submit()"
      >
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-9 h-9 rounded-sm flex items-center justify-center text-black font-black text-sm"
            style="background:var(--lime)"
          >
            DL
          </div>
          <div>
            <h1 class="text-sm font-black tracking-widest uppercase">MediaBot</h1>
            <p class="text-[10px] tracking-wider" style="color:#6b7a4a">AUTHENTIFICATION</p>
          </div>
        </div>

        <label for="api-token" class="block text-[10px] tracking-widest mb-2" style="color:#8a9a62">
          API TOKEN
        </label>
        <input
          id="api-token"
          name="api-token"
          type="password"
          autocomplete="current-password"
          required
          [(ngModel)]="token"
          class="w-full px-3 py-2 rounded border bg-black text-sm outline-none"
          style="border-color:#2d351b"
        />

        @if (error()) {
          <p class="mt-3 text-xs" style="color:#ef6461">Token invalide ou service indisponible.</p>
        }

        <button
          type="submit"
          [disabled]="loading() || !token"
          class="mt-6 w-full py-2 rounded text-xs font-black tracking-widest disabled:opacity-50"
          style="background:var(--lime);color:#000"
        >
          {{ loading() ? 'CONNEXION…' : 'SE CONNECTER' }}
        </button>
      </form>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected token = '';
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected submit(): void {
    this.loading.set(true);
    this.error.set(false);
    this.auth
      .login(this.token)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/search']),
        error: () => this.error.set(true),
      });
  }
}

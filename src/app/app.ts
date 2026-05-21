import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly apiService = inject(ApiService);

  apiMessage = signal<string | null>(null);
  apiError = signal(false);
  isLoading = signal(true);

  ngOnInit() {
    this.apiService.getHealth().subscribe({
      next: (res) => {
        this.apiMessage.set(res.message);
        this.isLoading.set(false);
      },
      error: () => {
        this.apiError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}

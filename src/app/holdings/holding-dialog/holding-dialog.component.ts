import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiService, Holding, Stock } from '../../services/api.service';

@Component({
  selector: 'app-holding-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './holding-dialog.component.html',
  styleUrl: './holding-dialog.component.scss',
})
export class HoldingDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  readonly dialogRef = inject(MatDialogRef<HoldingDialogComponent>);
  readonly data: Holding | null = inject(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    ticker_code: [this.data?.ticker_code ?? '', Validators.required],
    purchase_date: [this.data?.purchase_date ?? '', Validators.required],
    purchase_price: [this.data?.purchase_price ?? null, [Validators.required, Validators.min(0)]],
    quantity: [this.data?.quantity ?? null, [Validators.required, Validators.min(1)]],
    note: [this.data?.note ?? ''],
  });

  private readonly allStocks = signal<Stock[]>([]);
  private readonly tickerQuery = signal<string>(this.data?.ticker_code ?? '');

  readonly filteredStocks = computed(() => {
    const query = this.tickerQuery().toLowerCase();
    if (!query) return this.allStocks();
    return this.allStocks().filter(s =>
      s.ticker_code.toLowerCase().includes(query) ||
      s.company_name.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.api.getStocks().subscribe(stocks => this.allStocks.set(stocks));
    this.form.controls.ticker_code.valueChanges.subscribe(val => {
      this.tickerQuery.set(val ?? '');
    });
  }

  selectStock(stock: Stock) {
    this.form.controls.ticker_code.setValue(stock.ticker_code);
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.dialogRef.close({
      ticker_code: value.ticker_code,
      purchase_date: value.purchase_date,
      purchase_price: value.purchase_price,
      quantity: value.quantity,
      note: value.note || undefined,
    });
  }
}

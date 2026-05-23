import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StockCreate } from '../../services/api.service';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './stock-dialog.component.html',
  styleUrl: './stock-dialog.component.scss',
})
export class StockDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<StockDialogComponent>);

  form = this.fb.group({
    ticker_code: ['', Validators.required],
    company_name: ['', Validators.required],
    sector: [''],
  });

  save() {
    if (this.form.invalid) return;
    const value = this.form.value;
    const result: StockCreate = {
      ticker_code: value.ticker_code!.trim(),
      company_name: value.company_name!.trim(),
      ...(value.sector?.trim() ? { sector: value.sector.trim() } : {}),
    };
    this.dialogRef.close(result);
  }
}

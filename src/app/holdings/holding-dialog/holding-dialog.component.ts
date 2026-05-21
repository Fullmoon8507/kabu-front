import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Holding } from '../../services/api.service';

@Component({
  selector: 'app-holding-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './holding-dialog.component.html',
  styleUrl: './holding-dialog.component.scss',
})
export class HoldingDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<HoldingDialogComponent>);
  readonly data: Holding | null = inject(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    ticker_code: [this.data?.ticker_code ?? '', Validators.required],
    purchase_date: [this.data?.purchase_date ?? '', Validators.required],
    purchase_price: [this.data?.purchase_price ?? null, [Validators.required, Validators.min(0)]],
    quantity: [this.data?.quantity ?? null, [Validators.required, Validators.min(1)]],
    note: [this.data?.note ?? ''],
  });

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

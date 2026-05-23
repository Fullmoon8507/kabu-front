import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Holding } from '../../services/api.service';

@Component({
  selector: 'app-holding-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, DecimalPipe, DatePipe],
  templateUrl: './holding-detail-dialog.component.html',
  styleUrl: './holding-detail-dialog.component.scss',
})
export class HoldingDetailDialogComponent {
  readonly dialogRef = inject(MatDialogRef<HoldingDetailDialogComponent>);
  readonly data: Holding = inject(MAT_DIALOG_DATA);

  totalValue(): number {
    return this.data.purchase_price * this.data.quantity;
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button color="warn" (click)="onYesClick()" cdkFocusInitial>Delete</button>
    </div>
  `,
    styles: [`
    h1 {
      margin: 0;
    }
    
    div[mat-dialog-content] {
      margin: 20px 0;
    }
    
    div[mat-dialog-actions] {
      margin: 0;
      padding: 8px 0;
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }
}

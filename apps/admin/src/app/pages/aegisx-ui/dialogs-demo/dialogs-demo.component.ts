import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AxDialogService } from '@aegisx/ui';

// Example dialog components
import { SimpleDialogComponent } from './examples/simple-dialog.component';
import { FormDialogComponent } from './examples/form-dialog.component';
import { ConfirmDialogComponent } from './examples/confirm-dialog.component';

@Component({
  selector: 'app-dialogs-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
  ],
  templateUrl: './dialogs-demo.component.html',
  styleUrl: './dialogs-demo.component.scss',
})
export class DialogsDemoComponent {
  private dialog = inject(MatDialog);
  private axDialog = inject(AxDialogService);

  // Code examples for display
  codeExamples = {
    basicConfirm: `this.axDialog.confirm({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Proceed',
  cancelText: 'Cancel',
}).subscribe(confirmed => {
  if (confirmed) {
    // Handle confirmation
  }
});`,
    dangerConfirm: `this.axDialog.confirm({
  title: 'Delete Confirmation',
  message: 'This action cannot be undone...',
  confirmText: 'Delete',
  isDangerous: true,
}).subscribe(confirmed => {
  // Handle deletion
});`,
    confirmDelete: `this.axDialog
  .confirmDelete('User Account')
  .subscribe(confirmed => {
    if (confirmed) {
      this.deleteUser(userId);
    }
  });`,
    bulkDelete: `this.axDialog
  .confirmBulkDelete(5, 'items')
  .subscribe(confirmed => {
    if (confirmed) {
      this.deleteItems(selectedIds);
    }
  });`,
    simpleDialog: `<h2 mat-dialog-title class="flex items-center gap-3">
  <mat-icon>info</mat-icon>
  Dialog Title
</h2>
<mat-dialog-content>
  Content here
</mat-dialog-content>
<div mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Close</button>
</div>`,
  };

  // Dialog opening methods
  openSimpleDialog(): void {
    this.dialog.open(SimpleDialogComponent, {
      width: '400px',
    });
  }

  openFormDialog(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form data:', result);
      }
    });
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log('Confirmed:', confirmed);
    });
  }

  // AxDialogService examples
  openAxConfirmBasic(): void {
    this.axDialog
      .confirm({
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this action?',
        confirmText: 'Proceed',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        console.log('Confirmed:', confirmed);
      });
  }

  openAxConfirmDanger(): void {
    this.axDialog
      .confirm({
        title: 'Delete Confirmation',
        message:
          'This action cannot be undone. Are you sure you want to delete this item?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDangerous: true,
      })
      .subscribe((confirmed) => {
        console.log('Confirmed:', confirmed);
      });
  }

  openAxConfirmDelete(): void {
    this.axDialog.confirmDelete('User Account').subscribe((confirmed) => {
      console.log('Delete confirmed:', confirmed);
    });
  }

  openAxConfirmBulkDelete(): void {
    this.axDialog.confirmBulkDelete(5, 'items').subscribe((confirmed) => {
      console.log('Bulk delete confirmed:', confirmed);
    });
  }

  // Size variants
  openSmallDialog(): void {
    this.dialog.open(SimpleDialogComponent, {
      panelClass: 'dialog-sm',
    });
  }

  openMediumDialog(): void {
    this.dialog.open(FormDialogComponent, {
      panelClass: 'dialog-md',
    });
  }

  openLargeDialog(): void {
    this.dialog.open(FormDialogComponent, {
      panelClass: 'dialog-lg',
    });
  }

  openExtraLargeDialog(): void {
    this.dialog.open(FormDialogComponent, {
      panelClass: 'dialog-xl',
    });
  }

  openFullscreenDialog(): void {
    this.dialog.open(FormDialogComponent, {
      panelClass: 'dialog-fullscreen',
      disableClose: true, // Recommended for fullscreen
    });
  }
}

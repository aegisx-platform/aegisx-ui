import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AegisxCardComponent } from '@aegisx/ui';
import { UserService } from '../services/user.service';

export interface UserSession {
  id: string;
  ipAddress: string;
  userAgent?: string;
  startedAt: string;
  lastActivityAt: string;
  expiresAt?: string;
}

@Component({
  selector: 'ax-sessions-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    AegisxCardComponent,
  ],
  template: `
    <ax-card [appearance]="'elevated'" class="mt-6">
      <h3 class="text-lg font-semibold mb-4">Active Sessions</h3>

      @if (loading()) {
        <div class="flex items-center justify-center h-64">
          <mat-spinner [diameter]="40"></mat-spinner>
        </div>
      } @else if (sessions().length === 0) {
        <div class="text-center py-8">
          <mat-icon class="text-6xl text-gray-400">devices</mat-icon>
          <p class="text-gray-600 dark:text-gray-400 mt-4">
            No active sessions
          </p>
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="sessions()" class="w-full">
            <!-- IP Address Column -->
            <ng-container matColumnDef="ipAddress">
              <th mat-header-cell>IP Address</th>
              <td mat-cell *matCellDef="let element">
                <code class="text-sm">{{ element.ipAddress }}</code>
              </td>
            </ng-container>

            <!-- Started At Column -->
            <ng-container matColumnDef="startedAt">
              <th mat-header-cell>Started At</th>
              <td mat-cell *matCellDef="let element">
                {{ element.startedAt | date: 'short' }}
              </td>
            </ng-container>

            <!-- Last Activity Column -->
            <ng-container matColumnDef="lastActivityAt">
              <th mat-header-cell>Last Activity</th>
              <td mat-cell *matCellDef="let element">
                {{ element.lastActivityAt | date: 'short' }}
              </td>
            </ng-container>

            <!-- Expires At Column -->
            <ng-container matColumnDef="expiresAt">
              <th mat-header-cell>Expires At</th>
              <td mat-cell *matCellDef="let element">
                @if (element.expiresAt) {
                  {{ element.expiresAt | date: 'short' }}
                } @else {
                  <span class="text-gray-400">No expiry</span>
                }
              </td>
            </ng-container>

            <tr
              mat-header-row
              *matHeaderRowDef="[
                'ipAddress',
                'startedAt',
                'lastActivityAt',
                'expiresAt',
              ]"
            ></tr>
            <tr
              mat-row
              *matRowDef="
                let row;
                columns: [
                  'ipAddress',
                  'startedAt',
                  'lastActivityAt',
                  'expiresAt',
                ]
              "
            ></tr>
          </table>
        </div>
      }
    </ax-card>
  `,
  styles: [
    `
      table {
        width: 100%;
      }

      th {
        font-weight: 600;
        color: #666;
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      td {
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
      }

      tr:last-child td {
        border-bottom: none;
      }

      code {
        padding: 2px 6px;
        background: #f5f5f5;
        border-radius: 3px;
        font-family: monospace;
      }
    `,
  ],
})
export class SessionsTabComponent implements OnInit {
  @Input() userId!: string;

  private userService = inject(UserService);

  sessions = signal<UserSession[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadSessions();
  }

  private loadSessions() {
    this.loading.set(true);

    // Use HttpClient to fetch user sessions from the API
    const http = inject(HttpClient);
    http
      .get<any>(`/api/profile/activity/sessions`, {
        params: { page: '1', limit: '10' },
      })
      .toPromise()
      .then(
        (response: any) => {
          if (response && response.data) {
            if (response.data.sessions) {
              this.sessions.set(response.data.sessions);
            }
          }
          this.loading.set(false);
        },
        () => {
          this.sessions.set([]);
          this.loading.set(false);
        },
      );
  }
}

import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AegisxCardComponent } from '@aegisx/ui';

export interface UserSession {
  id: string;
  ip_address: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
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
            <ng-container matColumnDef="ip_address">
              <th mat-header-cell>IP Address</th>
              <td mat-cell *matCellDef="let element">
                <code class="text-sm">{{ element.ip_address }}</code>
              </td>
            </ng-container>

            <!-- Started At Column -->
            <ng-container matColumnDef="created_at">
              <th mat-header-cell>Started At</th>
              <td mat-cell *matCellDef="let element">
                {{ element.created_at | date: 'short' }}
              </td>
            </ng-container>

            <!-- Last Activity Column -->
            <ng-container matColumnDef="updated_at">
              <th mat-header-cell>Last Activity</th>
              <td mat-cell *matCellDef="let element">
                {{ element.updated_at | date: 'short' }}
              </td>
            </ng-container>

            <!-- Expires At Column -->
            <ng-container matColumnDef="expires_at">
              <th mat-header-cell>Expires At</th>
              <td mat-cell *matCellDef="let element">
                @if (element.expires_at) {
                  {{ element.expires_at | date: 'short' }}
                } @else {
                  <span class="text-gray-400">No expiry</span>
                }
              </td>
            </ng-container>

            <tr
              mat-header-row
              *matHeaderRowDef="[
                'ip_address',
                'created_at',
                'updated_at',
                'expires_at',
              ]"
            ></tr>
            <tr
              mat-row
              *matRowDef="
                let row;
                columns: [
                  'ip_address',
                  'created_at',
                  'updated_at',
                  'expires_at',
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

  private http = inject(HttpClient);

  sessions = signal<UserSession[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadSessions();
  }

  private loadSessions(page: number = 1, limit: number = 10) {
    this.loading.set(true);

    // Build query params - proxy will add /api prefix
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Fetch user sessions from /profile/activity/sessions endpoint
    // The Angular proxy will add /api prefix automatically
    this.http
      .get<any>('/profile/activity/sessions', { params })
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

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    <div class="profile-page">
      <!-- Header with Cover -->
      <div class="profile-page__header">
        <div class="profile-page__cover">
          <img
            src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&h=300&fit=crop"
            alt="Cover"
          />
          <button mat-icon-button class="profile-page__cover-edit">
            <mat-icon>photo_camera</mat-icon>
          </button>
        </div>

        <div class="profile-page__avatar-section">
          <div class="profile-page__avatar">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="Avatar"
            />
            <button mat-icon-button class="profile-page__avatar-edit">
              <mat-icon>photo_camera</mat-icon>
            </button>
          </div>

          <div class="profile-page__info">
            <h1>{{ user().name }}</h1>
            <p class="profile-page__role">{{ user().role }}</p>
            <p class="profile-page__location">
              <mat-icon>location_on</mat-icon>
              {{ user().location }}
            </p>
          </div>

          <div class="profile-page__actions">
            <button mat-stroked-button>
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <button mat-flat-button color="primary">
              <mat-icon>share</mat-icon>
              Share
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="profile-page__content">
        <!-- Sidebar -->
        <aside class="profile-page__sidebar">
          <!-- About Card -->
          <div class="profile-page__card">
            <h3>About</h3>
            <p class="profile-page__bio">{{ user().bio }}</p>

            <div class="profile-page__details">
              <div class="profile-page__detail">
                <mat-icon>work</mat-icon>
                <span>{{ user().company }}</span>
              </div>
              <div class="profile-page__detail">
                <mat-icon>school</mat-icon>
                <span>{{ user().education }}</span>
              </div>
              <div class="profile-page__detail">
                <mat-icon>link</mat-icon>
                <a href="#">{{ user().website }}</a>
              </div>
              <div class="profile-page__detail">
                <mat-icon>calendar_today</mat-icon>
                <span>Joined {{ user().joinDate }}</span>
              </div>
            </div>
          </div>

          <!-- Skills Card -->
          <div class="profile-page__card">
            <h3>Skills</h3>
            <div class="profile-page__skills">
              @for (skill of user().skills; track skill) {
                <mat-chip>{{ skill }}</mat-chip>
              }
            </div>
          </div>

          <!-- Stats Card -->
          <div class="profile-page__card">
            <h3>Stats</h3>
            <div class="profile-page__stats">
              <div class="profile-page__stat">
                <span class="profile-page__stat-value">{{
                  user().stats.projects
                }}</span>
                <span class="profile-page__stat-label">Projects</span>
              </div>
              <div class="profile-page__stat">
                <span class="profile-page__stat-value">{{
                  user().stats.followers
                }}</span>
                <span class="profile-page__stat-label">Followers</span>
              </div>
              <div class="profile-page__stat">
                <span class="profile-page__stat-value">{{
                  user().stats.following
                }}</span>
                <span class="profile-page__stat-label">Following</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="profile-page__main">
          <mat-tab-group>
            <mat-tab label="Activity">
              <div class="profile-page__tab-content">
                @for (activity of activities; track activity.id) {
                  <div class="profile-page__activity">
                    <div
                      class="profile-page__activity-icon"
                      [class]="activity.type"
                    >
                      <mat-icon>{{ activity.icon }}</mat-icon>
                    </div>
                    <div class="profile-page__activity-content">
                      <p>{{ activity.text }}</p>
                      <span class="profile-page__activity-time">{{
                        activity.time
                      }}</span>
                    </div>
                  </div>
                }
              </div>
            </mat-tab>

            <mat-tab label="Projects">
              <div class="profile-page__tab-content">
                <div class="profile-page__projects">
                  @for (project of projects; track project.id) {
                    <div class="profile-page__project">
                      <div
                        class="profile-page__project-image"
                        [style.background-color]="project.color"
                      >
                        <mat-icon>{{ project.icon }}</mat-icon>
                      </div>
                      <div class="profile-page__project-info">
                        <h4>{{ project.name }}</h4>
                        <p>{{ project.description }}</p>
                        <div class="profile-page__project-meta">
                          <span>
                            <mat-icon>star</mat-icon>
                            {{ project.stars }}
                          </span>
                          <span>
                            <mat-icon>call_split</mat-icon>
                            {{ project.forks }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Connections">
              <div class="profile-page__tab-content">
                <div class="profile-page__connections">
                  @for (connection of connections; track connection.id) {
                    <div class="profile-page__connection">
                      <img [src]="connection.avatar" [alt]="connection.name" />
                      <div class="profile-page__connection-info">
                        <h4>{{ connection.name }}</h4>
                        <p>{{ connection.role }}</p>
                      </div>
                      <button mat-stroked-button size="small">
                        {{ connection.isFollowing ? 'Following' : 'Follow' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-page {
        min-height: 100vh;
        background: var(--ax-background-default);
      }

      /* Header */
      .profile-page__header {
        position: relative;
      }

      .profile-page__cover {
        position: relative;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .profile-page__cover-edit {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.5) !important;
        color: white !important;
      }

      .profile-page__avatar-section {
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        padding: 0 2rem;
        margin-top: -60px;
        position: relative;
        z-index: 1;
        flex-wrap: wrap;
      }

      .profile-page__avatar {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid var(--ax-background-default);
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .profile-page__avatar-edit {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: var(--ax-brand-default) !important;
        color: white !important;
        width: 32px !important;
        height: 32px !important;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .profile-page__info {
        flex: 1;
        min-width: 200px;
        padding-bottom: 1rem;

        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ax-text-heading);
          margin: 0;
        }
      }

      .profile-page__role {
        color: var(--ax-text-secondary);
        margin: 0.25rem 0;
      }

      .profile-page__location {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--ax-text-subtle);
        font-size: 0.875rem;
        margin: 0;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }

      .profile-page__actions {
        display: flex;
        gap: 0.75rem;
        padding-bottom: 1rem;

        button mat-icon {
          margin-right: 0.5rem;
        }
      }

      /* Content */
      .profile-page__content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1.5rem;
        padding: 1.5rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      @media (max-width: 900px) {
        .profile-page__content {
          grid-template-columns: 1fr;
        }
      }

      /* Sidebar */
      .profile-page__sidebar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .profile-page__card {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        padding: 1.25rem;

        h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--ax-text-heading);
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .profile-page__bio {
        color: var(--ax-text-secondary);
        font-size: 0.875rem;
        line-height: 1.6;
        margin: 0 0 1rem 0;
      }

      .profile-page__details {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .profile-page__detail {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        color: var(--ax-text-secondary);

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--ax-text-subtle);
        }

        a {
          color: var(--ax-brand-default);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .profile-page__skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .profile-page__stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        text-align: center;
      }

      .profile-page__stat {
        display: flex;
        flex-direction: column;
      }

      .profile-page__stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--ax-text-heading);
      }

      .profile-page__stat-label {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Main Content */
      .profile-page__main {
        background: var(--ax-background-default);
        border: 1px solid var(--ax-border-default);
        border-radius: var(--ax-radius-lg);
        overflow: hidden;
      }

      .profile-page__tab-content {
        padding: 1.5rem;
      }

      /* Activity */
      .profile-page__activity {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid var(--ax-border-default);

        &:last-child {
          border-bottom: none;
        }
      }

      .profile-page__activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &.commit {
          background: var(--ax-success-subtle);
          color: var(--ax-success-default);
        }

        &.comment {
          background: var(--ax-info-subtle);
          color: var(--ax-info-default);
        }

        &.star {
          background: var(--ax-warning-subtle);
          color: var(--ax-warning-default);
        }

        &.fork {
          background: var(--ax-brand-subtle);
          color: var(--ax-brand-default);
        }
      }

      .profile-page__activity-content {
        flex: 1;

        p {
          margin: 0;
          color: var(--ax-text-primary);
          font-size: 0.875rem;
        }
      }

      .profile-page__activity-time {
        font-size: 0.75rem;
        color: var(--ax-text-subtle);
      }

      /* Projects */
      .profile-page__projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }

      .profile-page__project {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--ax-background-subtle);
        border-radius: var(--ax-radius-md);
        transition:
          transform 0.2s,
          box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--ax-shadow-md);
        }
      }

      .profile-page__project-image {
        width: 48px;
        height: 48px;
        border-radius: var(--ax-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          color: white;
        }
      }

      .profile-page__project-info {
        flex: 1;

        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0.25rem 0 0.5rem;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      .profile-page__project-meta {
        display: flex;
        gap: 1rem;

        span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--ax-text-subtle);

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      /* Connections */
      .profile-page__connections {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .profile-page__connection {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: var(--ax-radius-md);
        transition: background 0.2s;

        &:hover {
          background: var(--ax-background-subtle);
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .profile-page__connection-info {
        flex: 1;

        h4 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--ax-text-heading);
        }

        p {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--ax-text-secondary);
        }
      }

      /* Responsive */
      @media (max-width: 640px) {
        .profile-page__avatar-section {
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1rem;
        }

        .profile-page__info {
          text-align: center;
        }

        .profile-page__content {
          padding: 1rem;
        }

        .profile-page__projects {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProfileExampleComponent {
  user = signal({
    name: 'Alex Johnson',
    role: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate developer with 8+ years of experience building web applications. Love open source and contributing to the community.',
    company: 'TechCorp Inc.',
    education: 'Stanford University',
    website: 'alexjohnson.dev',
    joinDate: 'March 2020',
    skills: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    stats: {
      projects: 42,
      followers: '1.2k',
      following: 156,
    },
  });

  activities = [
    {
      id: 1,
      type: 'commit',
      icon: 'code',
      text: 'Pushed 3 commits to aegisx-ui/main',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'comment',
      icon: 'chat_bubble',
      text: 'Commented on issue #234 in dashboard-project',
      time: '5 hours ago',
    },
    {
      id: 3,
      type: 'star',
      icon: 'star',
      text: 'Starred angular/angular repository',
      time: '1 day ago',
    },
    {
      id: 4,
      type: 'fork',
      icon: 'call_split',
      text: 'Forked tailwindlabs/tailwindcss',
      time: '2 days ago',
    },
    {
      id: 5,
      type: 'commit',
      icon: 'code',
      text: 'Merged pull request #89 in api-gateway',
      time: '3 days ago',
    },
  ];

  projects = [
    {
      id: 1,
      name: 'AegisX UI',
      description: 'Enterprise Angular component library',
      icon: 'widgets',
      color: '#6366f1',
      stars: 234,
      forks: 45,
    },
    {
      id: 2,
      name: 'API Gateway',
      description: 'Microservices API gateway with Node.js',
      icon: 'api',
      color: '#10b981',
      stars: 128,
      forks: 23,
    },
    {
      id: 3,
      name: 'Dashboard Pro',
      description: 'Analytics dashboard template',
      icon: 'dashboard',
      color: '#f59e0b',
      stars: 456,
      forks: 89,
    },
    {
      id: 4,
      name: 'Auth Service',
      description: 'JWT authentication microservice',
      icon: 'security',
      color: '#ef4444',
      stars: 67,
      forks: 12,
    },
  ];

  connections = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Designer',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      isFollowing: true,
    },
    {
      id: 2,
      name: 'Michael Park',
      role: 'DevOps Engineer',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isFollowing: false,
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Frontend Developer',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isFollowing: true,
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Tech Lead',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isFollowing: false,
    },
  ];
}

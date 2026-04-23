import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from './shared/ui/atoms/button/button.component';
import { BadgeComponent } from './shared/ui/atoms/badge/badge.component';
import { IconComponent } from './shared/ui/atoms/icon/icon.component';
import { SpinnerComponent } from './shared/ui/atoms/spinner/spinner.component';
import { InputComponent } from './shared/ui/atoms/input/input.component';
import { TextareaComponent } from './shared/ui/atoms/textarea/textarea.component';
import { CheckboxComponent } from './shared/ui/atoms/checkbox/checkbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent, BadgeComponent, IconComponent,
    SpinnerComponent, InputComponent, TextareaComponent, CheckboxComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected theme = signal<'dark' | 'light'>('dark');

  protected previewIcons = [
    'check', 'circle-check', 'x', 'circle-x', 'trash-2', 'pencil',
    'plus', 'minus', 'search', 'calendar', 'clock', 'chevron-left',
    'chevron-right', 'chevron-down', 'sun', 'moon', 'circle-alert',
    'info', 'triangle-alert', 'list-checks', 'filter', 'arrow-right',
  ];

  constructor() {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
  }
}

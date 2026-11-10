import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <body class="dx-viewport">
      <app-header />
      <router-outlet />
    </body>
  `,
})
export class App {}

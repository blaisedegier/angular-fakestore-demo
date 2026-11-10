import config from 'devextreme/core/config';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

config({
  licenseKey: import.meta.env['NG_APP_DEVEXTREME_LICENSE'],
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

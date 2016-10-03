import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

/* --------------- PAGES ------------------ */

import { LoginPage } from '../pages/login/login';

/* --------------- PROVIDERS ------------------ */

import { AuthService } from '../providers/auth0';

///JWT Config
import { AuthHttp, AuthConfig} from 'angular2-jwt';
import { Http } from '@angular/http';

 export function getAuthHttp(http) {
     return new AuthHttp(new AuthConfig({
       noJwtError: true
     }), http);
 }


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
  ],
  providers: [
    Storage,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps:[Http]
    }
  ]
})
export class AppModule { }

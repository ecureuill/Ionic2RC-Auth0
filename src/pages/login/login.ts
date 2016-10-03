import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth0'


@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	constructor(public navCtrl: NavController, public auth: AuthService) {
	}

	login() {
		this.auth.lock.show();
	}

	// ionViewDidEnter() {
	// 	this.redirectTo();

	// }

	redirectTo() {
		if (this.auth.authenticated()) {
			// this.navCtrl.setRoot(HomePage);
			//this.navCtrl.push(HomePage,  {"auth": this.auth});
		} else {
			this.auth.lock.on('authenticated', authResult => {
				// this.navCtrl.setRoot(HomePage);
				//this.navCtrl.push(HomePage, {"auth": this.auth});
			});
		}
	}
}

import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth0';
export declare class LoginPage {
    navCtrl: NavController;
    auth: AuthService;
    constructor(navCtrl: NavController, auth: AuthService);
    login(): void;
    ionViewDidEnter(): void;
    redirectTo(): void;
}

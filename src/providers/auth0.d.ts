import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { NgZone } from '@angular/core';
export declare class Auth0Vars {
    static AUTH0_CLIENT_ID: string;
    static AUTH0_DOMAIN: string;
}
export declare class AuthService {
    private authHttp;
    jwtHelper: JwtHelper;
    auth0: any;
    lock: any;
    local: Storage;
    refreshSubscription: any;
    user: Object;
    zoneImpl: NgZone;
    constructor(authHttp: AuthHttp, zone: NgZone, local: Storage);
    authenticated(): boolean;
    login(): void;
    logout(): void;
    scheduleRefresh(): void;
    startupTokenRefresh(): void;
    unscheduleRefresh(): void;
    getNewJwt(): void;
}

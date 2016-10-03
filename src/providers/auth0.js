var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
// declare var faker = require('faker');
export var Auth0Vars = (function () {
    function Auth0Vars() {
    }
    //application's clientId in Auth0.
    Auth0Vars.AUTH0_CLIENT_ID = "AUTH0_CLIENT_ID";
    Auth0Vars.AUTH0_DOMAIN = "ecureuill.auth0.com";
    return Auth0Vars;
}());
export var AuthService = (function () {
    function AuthService(authHttp, zone, local) {
        var _this = this;
        this.authHttp = authHttp;
        this.jwtHelper = new JwtHelper();
        this.auth0 = new Auth0({ clientID: Auth0Vars.AUTH0_CLIENT_ID, domain: Auth0Vars.AUTH0_DOMAIN });
        this.lock = new Auth0Lock(Auth0Vars.AUTH0_CLIENT_ID, Auth0Vars.AUTH0_DOMAIN, {
            redirect: false,
            autoclose: true,
            avatar: null,
            closable: false,
            rememberLastLogin: true,
            // language: 'pt-br',
            theme: {},
            languageDictionary: {
                title: "Teeth"
            },
        });
        this.zoneImpl = zone;
        this.local = local;
        this.lock.show();
        // Check if there is a profile saved in local storage
        this.local.get('profile').then(function (profile) {
            _this.user = JSON.parse(profile);
        }).catch(function (error) {
            console.log(error);
        });
        this.lock.on('authenticated', function (authResult) {
            _this.local.set('id_token', authResult.idToken);
            // Fetch profile information
            _this.lock.getProfile(authResult.idToken, function (error, profile) {
                if (error) {
                    // TODO: tratar erro 
                    console.error("erro ao retornar perfil", error);
                    return;
                }
                profile.user_metadata = profile.user_metadata || {};
                _this.local.set('profile', JSON.stringify(profile));
                _this.user = profile;
            });
            _this.lock.hide();
            _this.local.set('refresh_token', authResult.refreshToken);
            _this.zoneImpl.run(function () { return _this.user = authResult.profile; });
            // Schedule a token refresh
            _this.scheduleRefresh();
        });
    }
    AuthService.prototype.authenticated = function () {
        // Check if there's an unexpired JWT
        return tokenNotExpired();
    };
    AuthService.prototype.login = function () {
        // Show the Auth0 Lock widget
        this.lock.show();
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        this.local.remove('profile');
        this.local.remove('id_token');
        this.local.remove('refresh_token');
        this.zoneImpl.run(function () { return _this.user = null; });
        // Unschedule the token refresh
        this.unscheduleRefresh();
    };
    AuthService.prototype.scheduleRefresh = function () {
        var _this = this;
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        var source = this.authHttp.tokenStream.flatMap(function (token) {
            // The delay to generate in this case is the difference
            // between the expiry time and the issued at time
            var jwtIat = _this.jwtHelper.decodeToken(token).iat;
            var jwtExp = _this.jwtHelper.decodeToken(token).exp;
            var iat = new Date(0);
            var exp = new Date(0);
            var delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
            return Observable.interval(delay);
        });
        this.refreshSubscription = source.subscribe(function () {
            _this.getNewJwt();
        });
    };
    AuthService.prototype.startupTokenRefresh = function () {
        var _this = this;
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (this.authenticated()) {
            var source = this.authHttp.tokenStream.flatMap(function (token) {
                // Get the expiry time to generate
                // a delay in milliseconds
                var now = new Date().valueOf();
                var jwtExp = _this.jwtHelper.decodeToken(token).exp;
                var exp = new Date(0);
                exp.setUTCSeconds(jwtExp);
                var delay = exp.valueOf() - now;
                // Use the delay in a timer to
                // run the refresh at the proper time
                return Observable.timer(delay);
            });
            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(function () {
                _this.getNewJwt();
                _this.scheduleRefresh();
            });
        }
    };
    AuthService.prototype.unscheduleRefresh = function () {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    };
    AuthService.prototype.getNewJwt = function () {
        var _this = this;
        // Get a new JWT from Auth0 using the refresh token saved
        // in local storage
        this.local.get('refresh_token').then(function (token) {
            _this.auth0.refreshToken(token, function (err, delegationRequest) {
                if (err) {
                    alert(err);
                }
                _this.local.set('id_token', delegationRequest.id_token);
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
    AuthService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [AuthHttp, NgZone, Storage])
    ], AuthService);
    return AuthService;
}());

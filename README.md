# Ionic2RC-Auth0
Login page using Ionic2 RC.0 and Auth0

Since angular2-jwt is not exported out as a es2015 module this lead to angular2-jwt module error.
So it was necessary a [different config](https://forum.ionicframework.com/t/angular2-jwt-after-rc0-broken/65043/11?u=ecureuill) to import it modules.

**Issue**

AuthLock lead to blank page after login
https://auth0.com/forum/t/ionic2-rc0-blank-page-after-login/3871

Workaround: open Google Developer Tools > toogle device toolbar > select an android device

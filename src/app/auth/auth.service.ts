import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private auth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackbar: MatSnackBar) {
  }

  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
    }).catch(error => {
      this.snackbar.open(error.message, null, { duration: 3000 });
    });
  }

  login(authData: AuthData) {
    this.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
    }).catch(error => {
      this.snackbar.open(error.message, null, { duration: 3000 });
    });
  }

  logout() {
    this.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}

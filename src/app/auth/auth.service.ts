import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
              private auth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackbar: MatSnackBar,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {
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
    this.store.dispatch(new UI.StartLoading());
    this.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    this.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}

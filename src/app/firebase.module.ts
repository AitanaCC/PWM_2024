// src/app/firebase.module.ts
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  imports: [
    AngularFireAuthModule
  ]
})
export class FirebaseModule {}

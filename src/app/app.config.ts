import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"pwmapp-a480f","appId":"1:154383405024:web:eb24682aee94f055616585","storageBucket":"pwmapp-a480f.appspot.com","apiKey":"AIzaSyC8MhVZ6CcVdQvzl3nR3gdHb8koT1D6gCM","authDomain":"pwmapp-a480f.firebaseapp.com","messagingSenderId":"154383405024"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};

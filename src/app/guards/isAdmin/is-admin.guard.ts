import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const isAdminGuard: CanActivateFn = async () => {
  const { value } = await Preferences.get({ key: 'info' });

  if (value) {
    const { role } = JSON.parse(value);
    return role === true; 
  }
  
  return false; // Si no hay información, deniega el acceso
};

  const GOOGLE_CLIENT_ID = "403312679824-gl44c8ugjfn22vqseihof1ham0if7bt0.apps.googleusercontent.com";

  window._fbUser    = null;
  window._fbSignIn  = null;
  window._fbSignOut = null;

  function gsiHandleCredential(response) {
    // Decodificar el JWT que devuelve Google
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    window._fbUser = {
      displayName: payload.name,
      email:       payload.email,
      photoURL:    payload.picture,
      uid:         payload.sub
    };
    // Guardar sesion en sessionStorage para persistencia dentro de la pestaña
    localStorage.setItem('gsi_user', JSON.stringify(window._fbUser));
    onUserSignedIn(window._fbUser);
  }

  function onUserSignedIn(user) {
    document.getElementById('googleLoginOverlay')?.classList.remove('show');
    document.body.classList.add('auth-ok');
    const nameEl   = document.getElementById('authUserName');
    const avatarEl = document.getElementById('authUserAvatar');
    const accAvatar = document.getElementById('accAvatarImg');
    if(nameEl)   nameEl.textContent = user.displayName || user.email || 'Usuario';
    if(avatarEl && user.photoURL){
      avatarEl.src = user.photoURL;
      avatarEl.style.display = 'block';
    } else if(avatarEl){
      avatarEl.style.display = 'none';
    }
    if(accAvatar && user.photoURL) accAvatar.src = user.photoURL;
  }

  window._fbSignOut = function() {
    window._fbUser = null;
    localStorage.removeItem('gsi_user');
    document.body.classList.remove('auth-ok');
    document.getElementById('googleLoginOverlay')?.classList.add('show');
    // Revocar token de Google si está disponible
    if(window.google?.accounts?.id) google.accounts.id.disableAutoSelect();
  };

  // Restaurar sesion si ya habia iniciado en esta pestaña
  window.addEventListener('load', () => {
    const saved = localStorage.getItem('gsi_user');
    if(saved){
      try {
        window._fbUser = JSON.parse(saved);
        onUserSignedIn(window._fbUser);
      } catch(e){ localStorage.removeItem('gsi_user'); }
    }
  });

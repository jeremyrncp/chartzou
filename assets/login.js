require('firebaseui')
const firebase = require('firebase/app');

var firebaseConfig = {
  apiKey: "AIzaSyC42R4s7Y1-_09YomRBOWJrtkssAg_Zq9c"
};
firebase.default.initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.default.auth());
    ui.start('#firebaseui-auth-container', {
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        authResult.user.getIdToken(true).then((tokenResult) => {
          const myHeaders = new Headers()
          myHeaders.append('auth', tokenResult)

          const myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
          };
          const myRequest = new Request('/auth', myInit);
          fetch(myRequest,myInit).then(() => {
            document.querySelector('#firebaseui-auth-container').innerHTML = "<div class='alert alert-success text-left'>Success, you have redirected to dashboard list</div"
            window.location = "/dashboard"
          });
        })

        return false;
      }, 
    },
    signInSuccessUrl: '/dashboard',
    signInOptions: [{
        provider: firebase.default.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
    }]
});
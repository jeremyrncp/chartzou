var emailValidator = require("email-validator");
const swal = require('sweetalert')

document.querySelectorAll(".btn-sign-up").forEach((elm) => {
    elm.addEventListener('click', (event) => {
        const email = event.target.parentElement.parentElement.querySelector("input[type='email']").value;

        if (emailValidator.validate(email)) {
             const myInit = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: email}), mode: 'cors', cache: 'default' };
              const myRequest = new Request('/api/service/signup', myInit);
              fetch(myRequest,myInit)
              .then((response) => {
                 if (response.status === 200) {
                    swal('Sign up email sent, please consult your mail box')
                 } else {
                  swal('Error :' + response.status)
                 }
              })
              .catch((error) => {
                swal('Error :' + error)
              });
        } else {
            swal({text: "Email isn't valid", buttons: ['close']})
        }
    })
})
var emailValidator = require("email-validator");
const swal = require('sweetalert')

document.querySelector(".btn-contact").addEventListener('click', (event) => {
    const email = document.querySelector("input[type='email']").value;
    const message = document.querySelector("textarea").value;

    if (emailValidator.validate(email) && message !== "") {
            const myInit = { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: email, message: message}), mode: 'cors', cache: 'default' };
            const myRequest = new Request('/api/service/contact', myInit);
            fetch(myRequest,myInit)
            .then((response) => {
                if (response.status === 200) {
                    swal('Your message has been sent, we will respond within 48 hours! ')
                } else {
                    swal('Error :' + response.status)
                }
            })
            .catch((error) => {
            swal('Error :' + error)
            });
    } else {
        swal({text: "Email isn't valid or message is empty", buttons: ['close']})
    }
})
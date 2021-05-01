var emailValidator = require("email-validator");
const swal = require('sweetalert')


document.querySelector("#share-modal .close").addEventListener('click', (event) => {
    document.querySelector("#share-modal").style.display = 'none'
})

/**
 * Share dashboard
 */
document.querySelectorAll(".btn-share-dashboard").forEach((elm) => {
    elm.addEventListener('click', (event) => {
        let dashboardId = event.target.attributes.getNamedItem('data-dashboard-id').value

        document.querySelector("#share-modal .modal-body").innerHTML = "<label for='share-external-dashboard'><b>Public dashboard link</b> <button id='btn-copy-dashboard' class='btn btn-sm btn-secondary'>Copy</button></label>" +
        "<input id='share-external-dashboard' type='text' class='form-control' value='https://chartzou.com/external/dashboard/share/" + dashboardId + "' />" +
        "<br /><br /><h5>Send dashboard link by email</h5>" +
        "<input id='share-external-dashboard-email' type='email' class='form-control' placeholder='Email address' />"

        document.querySelector("#share-modal").style.display = 'block'

        document.querySelector("#btn-copy-dashboard").addEventListener('click', (event) => {
            document.querySelector("#share-external-dashboard").select();
            document.execCommand("copy");
        })

        document.querySelector("#share-modal-submit").addEventListener('click', (event) => {
            const email = document.querySelector("#share-external-dashboard-email").value;

            if (!emailValidator.validate(email)) {
                swal('Email must be valid')
            } else {
                 const myInit = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: email,
                        dashboardId: dashboardId
                     }),
                    mode: 'cors',
                    cache: 'default'
                  };
                  const myRequest = new Request('/api/dashboard/share', myInit);
                  fetch(myRequest,myInit)
                  .then((response) => {
                     if (response.status === 200) {
                        document.querySelector("#share-modal").style.display = 'none'
                        swal('Dashboard shared')
                     } else {
                        swal('Error :' + error)
                     }
                  })
                  .catch((error) => {
                    swal('Error :' + error)
                  });
            }
        })
    })
})

/**
 * Delete dashboard
 */
document.querySelectorAll(".btn-delete-dashboard").forEach((elm) => {
    elm.addEventListener('click', (event) => {
        let dashboardId = event.target.attributes.getNamedItem('data-dashboard-id').value

        swal({
            title: "Are you sure ?",
            text: "It's not possible to recover it ",
            icon: "warning",
            dangerMode: true,
            buttons: ["No", "Yes"],
          })
          .then(willDelete => {
            if (willDelete) {
                const myInit = {
                    method: 'DELETE',
                    mode: 'cors',
                    cache: 'default'
                  };
                  const myRequest = new Request('/api/dashboard/' + dashboardId, myInit);
                  fetch(myRequest,myInit)
                  .then((response) => {
                     if (response.status === 200) {
                        swal('Dashboard deleted')
                        document.location.reload();
                     } else {
                        swal('Error, dashboard isn\'t deleted')
                     }
                  })
                  .catch((error) => {
                    swal('Error :' + error)
                  });
            }
        });
    })
})

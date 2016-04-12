//connect to cloud
var relayr = RELAYR.init({
    // this comes from the api key page on the dashboard
    appId: keys.APP_ID,
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectUri: "http://localhost:8080/browserSDKFullExample/html-dashboard.html"
});

// these could hold the output from various sensors, based on device id for instance,
// so I can do multiple device calls at once and not get confused
var dev1
var dev2

// in order to do anything other than get straight readings, you have to log in
relayr.login({
    // the login function returns success or error, 
    // the token is generated when you log in to your account in that redirect, 
    // and is passed in the local memory of the browser
    success: function(token) {

        //getUserInfo creates a Promise, so call .then on it
        relayr.user().getUserInfo().then(
            //a fulfilled promise returns an object which has user properties, including email
            function fulfilled(msg) {
                //inject this text into the html
                $(".users").text(msg.email);
            },
            //if the promise resolves as rejected it will log this error
            function rejected(err) {
                console.log("error, the promise was rejected")
            }
        );

        //get all the devices asstd with an account, the loop is just to dispay them
        relayr.devices().getAllDevices().then(
            //a fulfilled promise returns an object msg
            function fulfilled(msg) {
                // loops through the object holding the devices, x gives you an index
                for (x in msg) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(msg[x].name).appendTo('.devices');
                }
            },
            //if the promise resolves as rejected it will log this error
            function rejected(err) {
                console.log("error, the promise was rejected")
            }
        );

        // this gets the data from the devices
        relayr.devices().getDeviceData({
            // this is the same token as above
            token: token,
            // identifies one device from another
            deviceId: keys.DEVICE_ID,
            //function that grabs the reading from the data from the device
            incomingData: function(data) {
                dev1 = data.readings[0].value;
                //inserts into html
                $(".reading1").text(dev1);
            }
        });

        // same dance, different device
        relayr.devices().getDeviceData({
            token: token,
            deviceId: keys.DEVICE_ID2,
            incomingData: function(data) {
                dev2 = data.readings[0].value
                $(".reading2").text(dev2);
            }
        });

        // displays all of the user's groups
        //get all the devices asstd with an account, the loop is just to dispay them
        relayr.groups().getAllGroups().then(
            //a fulfilled promise returns an object msg
            function fulfilled(msg) {
                // loops through the object holding the devices, x gives you an index
                for (x in msg) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(msg[x].name).appendTo('.groups');
                }
            },
            //if the promise resolves as rejected it will log this error
            function rejected(err) {
                console.log("error, the promise was rejected")
            }
        );

        // displays models available to the user (including public ones)
        relayr.models().getAllModels().then(
            //a fulfilled promise returns an object msg
            function fulfilled(msg) {
                // loops through the object holding the models, x gives you an index
                for (x in msg) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(msg[x].name).appendTo('.models');
                }
            },
            //if the promise resolves as rejected it will log this error
            function rejected(err) {
                console.log("error, the promise was rejected")
            }
        );

        // displays transmitters
        relayr.transmitters().getTransmitters().then(
            //a fulfilled promise returns an object msg
            function fulfilled(msg) {
                // loops through the object holding the transmitters, x gives you an index
                for (x in msg) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(msg[x].name + " : " + msg[x].id).appendTo('.transmitterlist');
                }

                //define what happens when you click the delete button
                $("#delete").click(function() {
                    var deleteId = String(msg[0].id);
                    //give the command to actually delete it
                    relayr.transmitters().delete(deleteId).then(
                        function fulfilled(msg) {
                            location.reload();
                        },
                        function rejected(err) {
                            console.log("error, the promise was rejected")
                        }
                    );
                });

                //define what happens when you click the "update name" button
                $("#updateName").click(function() {
                    //get the ID of the transmitter at the top of the list
                    var updateId = String(msg[0].id);
                    var name = $('.status-box').val()
                        //give the command to update the name of the transmitter with the top ID with the text from the input box
                    relayr.transmitters().update(updateId, name).then(
                        function fulfilled(msg) {
                            location.reload();
                        },
                        function rejected(err) {
                            console.log("error, the promise was rejected")
                        });
                });

            },

            //if the promise resolves as rejected it will log this error
            function rejected(err) {
                console.log("error, the promise was rejected")
            }
        );

    } //end of success
}); //end of login
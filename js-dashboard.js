//connect to cloud
var relayr = RELAYR.init({
    // this comes from the api key page on the dashboard
    appId: keys.APP_ID,
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectUri: "http://localhost:8080/browserSDK/html-dashboard.html"
});

// these could hold the output from various sensors, based on device id for instance,
// so I can do multiple device calls at once and not get confused
var dev1
var dev2

deleteButton = $('<button />').addClass('deleteButton').text('x');

$(".deleteMe").on("click", function() {
    $(this).closest("li").remove();
});

// in order to do anything other than get straight readings, you have to log in
relayr.login({
    // the login function returns success or error, 
    // the token is generated when you log in to your account in that redirect, 
    // and is passed in the local memory of the browser
    success: function(token) {

        // displays the email address associatd with the logged in user
        var userEmail = relayr.user().getUserInfo().email;
        // fills it into the HTML
        $(".users").text(userEmail);

        //get all the devices asstd with an account, the loop is just to dispay them
        relayr.devices().getAllDevices(
            function(devices) {
                // loops through the object holding the devices, x gives you an index
                for (x in devices) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(devices[x].name).appendTo('.devices');
                }
            },
            // it either returns a list of devices, or an error
            function(err) {
                console.log("err", err)
            })

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
        relayr.groups().getAllGroups(function(group) {
                // loops through the object holding the groups, x gives you an index
                for (x in group) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(group[x].name).appendTo('.groups');
                }
            },
            function(err) {
                console.log("err", err)
            }
        );

        // displays models available to the user (including public ones)
        relayr.models().getAllModels(function(model) {
                // loops through the object holding the models, x gives you an index
                for (x in model) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(model[x].name).appendTo('.models');
                }
            },
            function(err) {
                console.log("err", err)
            }
        );

        // displays transmitters
        relayr.transmitters().getTransmitters(function(transmitters) {
                // loops through the object holding the transmitters, x gives you an index
                for (x in transmitters) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(transmitters[x].name + " : " + transmitters[x].id).appendTo('.transmitterlist');
                }
            },
            function(err) {
                console.log("err", err)
            }
        );

        //define what happens when you click the delete button
        $("#delete").click(function() {
            //get the ID of the transmitter at the top of the list
            relayr.transmitters().getTransmitters(function(transmitters) {
                var deleteId = String(transmitters[0].id);
                //give the command to actually delete it
                relayr.transmitters().delete({
                        id: deleteId
                    },
                    //if it works, reload the page
                    function(success) {
                        location.reload();
                    },
                    //if not, log the error
                    function(err) {
                        console.log(err)
                    })
            }, function(err) {
                console.log("err", err)
            });
        });

        //define what happens when you click the "update name" button
        $("#updateName").click(function() {
            //get the ID of the transmitter at the top of the list
            relayr.transmitters().getTransmitters(function(transmitters) {
                var updateId = String(transmitters[0].id);
                //give the command to update the name of the transmitter with the top ID with the text from the input box
                relayr.transmitters().update({
                        id: updateId
                    }, {
                        name: $('.status-box').val()
                    },
                    //reload if successful
                    function(success) {
                        location.reload();
                    },
                    //log the error if not
                    function(err) {
                        console.log(err)
                    })
            }, function(err) {
                console.log("err", err)
            });
        });

    }
});
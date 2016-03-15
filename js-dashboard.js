// $( document ).ready(function () {

//init some variables

//connect to cloud
var relayr = RELAYR.init({
    // this comes from the api key page on the dashboard
    appId: keys.APP_ID,
    // this identifies my website as a 'trusted user' basically- it expects me to show up and ask for access to stuff
    redirectUri: "http://localhost:8080/html-dashboard.html"
});

// these could hold the output from various sensors, based on device id for instance, so I can do multiple device calls at once and not get confused
var dev1
var dev2

// in order to do anything other than get straight readings, you have to log in
relayr.login({
    // the login function returns a few options: success or error (I think?)
    // the token is generated when you log in to your account in that redirect, and is passed in the local memory of the browser
    success: function(token) {

        // displays the email address associatd with the logged in user
        var userEmail = relayr.user().getUserInfo().email;
        $(".users").text(userEmail);

        // this will list all the devices associated with an account
        relayr.devices().getDevice({
            deviceId: keys.DEVICE_ID
        }, function(foundDevice) {
            foundDevice.delete()
        }, function(err) {})

        relayr.devices().getAllDevices(function(devices) {
                // loops through the object holding the devices, x gives you an index
                for (x in devices) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(devices[x].name).appendTo('.devices');
                    devices[x].delete()
                }
                // console.log(devices)
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

            // this is an item in the function, which is actually a function, you can nest them like that
            incomingData: function(data) {
                //console.log("data from device", data.deviceId, data);
                dev1 = data.readings[0].value;
                $(".reading1").text(dev1);
            }

        });

        // same dance, different device
        relayr.devices().getDeviceData({
            token: token,
            deviceId: keys.DEVICE_ID2,
            incomingData: function(data) {
                // console.log("data from device", data.deviceId, data)
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

        // displays models belonging to the user
        relayr.models().getAllModels(function(group) {
                // loops through the object holding the groups, x gives you an index
                for (x in group) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(group[x].name).appendTo('.models');
                }
            },
            function(err) {
                console.log("err", err)
            }
        );

        // displays transmitters
        relayr.transmitters().getTransmitters(function(transmitters) {
                // loops through the object holding the groups, x gives you an index
                for (x in transmitters) {
                    // tack the object[index].name on to the list displayed in the html
                    $('<ul>').text(transmitters[x].name).appendTo('.transmitters');
                }
            },
            function(err) {
                console.log("err", err)
            }
        );

    } //end of the success parameter in the login sequence. Why is there no error option?
});
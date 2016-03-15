// variables can be objects
var a = {}

// now you can define an item in the object and give it a value
a.hi = true;

// this seems like you're running the function before you define it?
test("hi", {
    // you can also pass in a function as a parameter to a function call
    done: function(data) {
        // this does nothing with the data?
    }
}); // end of the function call

// definition of the function "test", which takes parameters string and options
function test(string, options) {
    // are all parameters optional? error seems to be a lot of the time, so if it doesn't get a string, will it hang here? or just print undefined?
    console.log(string)

    // jquery "get"s the data from an api, then passes the result from it into a function to further process
    $.get("http://twitter", function(data, err, body) {
        if (err) {
            errCb(err)
            return;
        }

        options.done(data)


    });
    console.log("now here")
}
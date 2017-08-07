var shell = require('shelljs');
var child_process = require('child_process');
var appium_started_successfully='Appium REST http interface listener started';
//To start the appium server for a given device
exports.start_appium=function(appium_port,webkit_port,callback){
			//to start appium we need device port and webkit port , though that may not be necessary
            var shell_cmd_app = "lsof -ti:" + appium_port + " | xargs kill";
            console.log("shell_cmd : "+shell_cmd_app);
            //to check and kill any appium running on the same port 
            shell.exec(shell_cmd_app, function (err, output) {
                if (err != 0) {
                    console.log("Issue in stopping appium, Error Code: " + err);
                    callback(err,null);
                }
                else {
                    console.log("Existing Appium port got killed");
                    startAppiumfunc(appium_port,webkit_port, function (err) {
                        if (err) {
                            console.log("Invoking appium failed: " + err);
                            callback(err, null);
                        }
                        else {
                            console.log("Appium started sucessfully");
                            callback(null, {appium_port:appium_port});
                        }
                    });
                }
            });
}
// to start the web kit - used for browser automation 
exports.start_webkit=function(webkit_port,device_udid,callback){

                    var shell_cmd_wda = "lsof -ti:" + webkit_port + " | xargs kill";
                    //checking if process is running on webkit port and kill if it is running
                    shell.exec(shell_cmd_wda, function (err, output) {
                        if (err != 0) {
                             console.log("Issue in stopping wdaLocalPort, Error Code: " + err);
                        }
                        else {
                            console.log("Existing wdaLocal port got killed");
                            startWebkitport(device_udid,webkit_port, function (err, result) {
                                if (err) {
                                    console.log("Invoking wdaLocal failed: " + err);
                                    callback(err, null);
                                }
                                else {
                                    console.log("Invoking wdaLocal Succeed");
                                    callback(null, {wda_port:webkit_port} );
                                  
                                }
                            });
                        }
                      
                     });
}
exports.stop_appium_port=function(appium_port,callback){
        var shell_cmd_app = "lsof -ti:" + appium_port + " | xargs kill";
        console.log("shell_cmd : "+shell_cmd_app);

        shell.exec(shell_cmd_app, function (err, output) {
            if (err != 0) {
                console.log("Issue in stopping appium, Error Code: " + err);
                callback(err,null);
            }
            else {
                console.log("Existing Appium port got killed");
                callback(null,appium_port);
               
            }
        });
}
exports.stop_webkit_port=function(webkit_port,callback){
	var shell_cmd_wda = "lsof -ti:" + webkit_port + " | xargs kill";
    shell.exec(shell_cmd_wda, function (err, output) {
        if (err != 0) {
             console.log("Issue in stopping wdaLocalPort, Error Code: " + err);
        }
        else {
            console.log("Existing wdaLocal port got killed");
             callback(null, webkit_port);       
        }
      
     });
}

function startAppiumfunc(appiumport,webkitport, callback) {
	try {
		var shell_app_cmd="appium";var parameters=[];
	    if(webkitport){
	    	// shell_app_cmd = "appium -p " + appiumport + " --webkit-debug-proxy-port " + webkitport;
	    	parameters=['-p',appiumport,'--webkit-debug-proxy-port',webkitport]
	    }else{
	    	// shell_app_cmd = "appium -p " + appiumport;
	    	parameters=['-p',appiumport]
	    }
	    console.log("Appium start:"+ shell_app_cmd,parameters);
	    // console.log("Appium started");
	    // callback(null);
	    var options={'shell':true,'detached':true};
        var appium_start=child_process.spawn(shell_app_cmd,parameters,options);
	    var callback_timer=setTimeout(function(){callback("Appium took too long to start");appium_start.kill();},20000)
	    appium_start.stdout.on('data',(data)=>{
	    	 // console.log(`stdout: ${data}`);
	  	 //now i need to parse the output looking for 'Appium REST http interface listener started'	    	
	    	 if(data.indexOf(appium_started_successfully)>0){
  				console.log('Appium started')
  				clearTimeout(callback_timer);
  				callback(null);
  			}
	    })
	    appium_start.stderr.on('data', (data) => {
  		console.log(`stderr: ${data}`);
		});
		appium_start.on('close', (code) => {
		  console.log(`appium child process exited with code ${code}`);
		});
	}
	catch (ex) {
	    console.log("Error start appium  : " + ex);
	    // callback(ex);
	}
}

function startWebkitport(udid, webkitport,callback) {
    try {
        var shell_webkit_cmd = "ios_webkit_debug_proxy";
        var parameters=['-c',udid + ":" + webkitport,'-d'];
        console.log("WDA start:"+ shell_webkit_cmd);
        callback(null);
        var options={'shell':true,'detached':true};
        var webkit_start=child_process.spawn(shell_webkit_cmd,parameters,options);
        webkit_start.stdout.on('data',(data)=>{

        });
    }
    catch (ex) {
        console.log("Error Wda appium: " + ex);
        callback(ex)
    }
}
var appium=require('./appium');
var async = require('async');
//start_appium_for_ios(udid,desired_port,[webkit],callback)
exports.start_appium=function(appium_port,webkit_port,udid,callback){
	//function(required,required,optional,required)
		var args=[];
		for (var i = 0; i < arguments.length; i++) {
		    args.push(arguments[i]);
		}
		var appium_port=args.shift();
		var callback=args.pop();
		var webkit_port=null;var udid=null;
		if(args.length>0) {webkit_port=args.shift();console.log('setting webkit_port')}
		else webkit_port=null;
		if(args.length>0) {udid=args.shift(); console.log('setting udid');}
		else webkit_port=null;

		//now you dont need to call here 
		var functions=[];

		functions.push(
			function(async_callback){
				appium.start_appium(appium_port,webkit_port,function(err,result){
					async_callback(err,result);

				})

			});

		if(webkit_port&&udid){
		//then browser automation 
		console.log('Trying to start appium for browser automation');
		functions.push(
			function(async_callback){
				appium.start_webkit(webkit_port,udid,function(err,result){
					async_callback(err,result);
				})
			});
		// appium.start_appium_for_ios_device()
		}

	try{
		async.parallel(functions,
		function(err,results){
			
			if(err){
				console.log('Error Occured in Starting Appium')
				callback(err,null);
			}
			else{
				var appium_details={
					udid:udid,
		            appium_port: results[0].appium_port,
		            wda_port:  (results[1])?results[1].wda_port:null
				}
		        console.log("All Task Completed Successfully! Appium and webkit port started");
				callback(null,appium_details);
			}
		}
		);
		}
		catch (ex) {
                console.log("catch Error : " + ex);
            }


}

exports.stop_appium=function(appium_port,webkit_port,callback){
		var args=[];
		for (var i = 0; i < arguments.length; i++) {
		    args.push(arguments[i]);
		}
		var appium_port=args.shift();
		var callback=args.pop();
		var webkit_port=null;
		if(args.length>0) webkit_port=args.shift(); else webkit_port=null;

		var functions=[];
		functions.push(
			function(async_callback){
				appium.stop_appium_port(appium_port,function(err,result){async_callback(err,result);})
			});
		if(webkit_port){
			functions.push(
				function(async_callback){
					appium.stop_webkit_port(webkit_port,function(err,result){async_callback(err,result)});
				});
		}
		try{
		async.parallel(functions,
			function(err,results){
				
				if(err){
					callback(err,null);
				}else{
					var stop_appium_details={
						appium_port: results[0],
		            	wda_port:  (results[1])?results[1]:null
					}
					callback(null,stop_appium_details);
				}
			});
		}
		catch (ex) {
                console.log("catch Error : " + ex);
            }

}

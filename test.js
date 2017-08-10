var appium=require('./index')

//Sample Use of the Module 
	appium.stop_appium('5555',function(err,details){
		console.log(details);
		return;
	});

appium.start_appium(,,'',function(err,details){
	if(err){
		console.log('Error occured')
		return
	}
	console.log(details);
	// return;
});
// console.log('hello world')


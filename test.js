var appium=require('./index')

//Sample Use of the Module 
appium.stop_appium('5555',function(err,details){
	console.log(details);
	return;
});

appium.start_appium(6666,5555,'62ce4aa43eeed9b95656bfafd8b6b861156a6b7f',function(err,details){
	if(err){
		console.log('Error occured')
		return
	}
	console.log(details);
	// return;
});
// console.log('hello world')


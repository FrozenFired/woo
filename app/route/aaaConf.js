module.exports = function(app){
	require('./aaAderRouter')(app);
	require('./aaMgerRouter')(app);

	require('./authRouter')(app);
	require('./userRouter')(app);
};
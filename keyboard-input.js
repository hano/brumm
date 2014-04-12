var stdin = process.stdin;

stdin.setEncoding( 'utf8' );
// does not work
//stdin.setRawMode(true);
stdin.resume();
stdin.on( 'data', function( key ){
    //  	 ctrl-c ( end of text )
    console.log('input was: ', key);
});

// don't kill the process
setInterval(function(){},1000000);
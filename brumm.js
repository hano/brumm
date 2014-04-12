#!/usr/bin/env node
var colors = require('colors');
var Car = function() {
};
Car.prototype.pos = 5;
Car.prototype.form = 'x'.white;
Car.prototype.draw = function() {
    var car = '';
    car += '[]--[]';
    car += '|    |';
    car += '| 0  |';
    car += '[]--[]';
    return this.form;
};

var Brumm = (function() {

    var car = new Car();
    if( typeof process !== 'undefined' && process.stdin && process.stdin.setRawMode && process.stdin.on ) {

        var stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');


        stdin.on('data', function( key ) {
            //  	 ctrl-c ( end of text )
            if( key === '\u0003' ) {
                process.exit();
            }
            if( key === 'm' ) {
                car.pos = car.pos + 1;
                //car.form = '<';
            } else if( key === 'n' ) {
                car.pos = car.pos - 1;
                //car.form = '>';
            }
        });
    }

    var border = '[]'.yellow;
    var asphalt = '-'.grey;
    var gras = '#'.green;
    var lastAsphaltCount = 20;
    var grid = [];

    var initializeGrid = function() {

        for( var i = 0; i <= 30; i++ ) {
            grid.push(drawLine(i));
        }
    };

    var drawLine = function( line ) {
        var output = [];
        for( var a = 0; a <= lastAsphaltCount; a++ ) {
            output.push(gras);
        }
        if( Math.ceil(Math.random() * 10) > 5 && lastAsphaltCount <= 20 ) {
            lastAsphaltCount = lastAsphaltCount + 1;
        } else if( lastAsphaltCount >= 0 ) {
            lastAsphaltCount = lastAsphaltCount - 1;
        }

        output.push(border);
        for( var a = 0; a <= lastAsphaltCount; a++ ) {
            if( a === car.pos && line && line === 15 ) {
                output.push(car.draw());
            } else {
                output.push(asphalt);
            }

        }
        if( Math.ceil(Math.random() * 10) > 5 && lastAsphaltCount <= 40 ) {
            lastAsphaltCount = lastAsphaltCount + 1;
        } else if( lastAsphaltCount >= 10 ) {
            lastAsphaltCount = lastAsphaltCount - 1;
        }

        output.push(border);
        for( var i = output.length; i <= 45; i++ ) {
            output.push(gras);
        }
        //output.push('\n');
        return output;

    };

    var draw = function() {
        grid.shift();
        //var lastPos = grid[14].join('').indexOf(car.form);
        grid[14][car.pos - 1] = asphalt.black;
        grid[14][car.pos + 1] = asphalt.black;
        grid[14][car.pos] = asphalt.black;
        if( grid[15][car.pos] === gras ) {
            if( car.form === 'x'.blue ) {
                car.form = 'x'.yellow
            } else if( car.form === 'x'.yellow ) {
                car.form = 'x'.red
            } else if( car.form === 'x'.red ) {
                car.form = 'x'.magenta
            } else if( car.form === 'x'.magenta ) {
                car.form = 'x'.rainbow
            }
        } else {
            car.form = 'x'.white
        }
        grid[15][car.pos] = car.draw();

        grid.push(drawLine());
        drawGrid();

    };

    var drawGrid = function() {

        for( var i = 0; i < grid.length; i++ ) {
            console.log(grid[i].join(''));
        }
    };

    var _start = function() {
        initializeGrid();
        drawGrid();

        setInterval(function() {
            draw();
        }, 90);
    };


    return{
        start: _start
    };
})();

Brumm.start();

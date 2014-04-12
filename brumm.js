#!/usr/bin/env node
var colors = require('colors');
var Car = function() {
};
Car.prototype.posX = 20;
Car.prototype.posY = 1;
Car.prototype.form = 'x';
Car.prototype.color = 1;
Car.prototype.COLORS = {
    WHITE: 1,
    BLUE: 2,
    YELLOW: 3,
    RED: 4,
    MAGENTA: 5,
    RAINBOW: 6
};
Car.prototype.setColor = function( color ) {
    this.color = color;
};
Car.prototype.getColor = function() {
    return this.color;
};
Car.prototype._damage = 0

Car.prototype.brake = function( strength ) {
    this.posY -= strength;
    if(this.posY < 0){
        this.posY = 0;
    }
};

Car.prototype.damage = function() {
    this._damage += 1;
    if( this._damage % 10 !== 0 ) {
        return;
    }
    this.brake(1);
    if( this.getColor() === this.COLORS.WHITE ) {
        this.setColor(this.COLORS.BLUE);
    } else if( this.getColor() === this.COLORS.BLUE ) {
        this.setColor(this.COLORS.YELLOW);
    } else if( this.getColor() === this.COLORS.YELLOW ) {
        this.setColor(this.COLORS.RED);
    } else if( this.getColor() === this.COLORS.RED ) {
        this.setColor(this.COLORS.MAGENTA);
    } else if( this.getColor() === this.COLORS.MAGENTA ) {
        this.setColor(this.COLORS.RAINBOW);
    }
};

Car.prototype.draw = function() {
    var car = '';
    car += '[]--[]';
    car += '|    |';
    car += '| 0  |';
    car += '[]--[]';

    if( this.getColor() === this.COLORS.WHITE ) {
        return this.form.white;
    } else if( this.getColor() === this.COLORS.BLUE ) {
        return this.form.blue;
    } else if( this.getColor() === this.COLORS.YELLOW ) {
        return this.form.yellow;
    } else if( this.getColor() === this.COLORS.RED ) {
        return this.form.red;
    } else if( this.getColor() === this.COLORS.MAGENTA ) {
        return this.form.red;
    } else if( this.getColor() === this.COLORS.RAINBOW ) {
        return this.form.rainbow;
    } else {
        return this.form.white;
    }

};

var Brumm = (function() {

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
                car.posX += 1;
                //car.form = '<';
            } else if( key === 'n' ) {
                car.posX -= 1;
                //car.form = '>';
            } else if(key === 's'){
                _start();
            }
        });
    }
    var car = null;
    var border = '[]'.yellow;
    var asphalt = '-'.grey;
    var dust = '-'.grey;
    var gras = '#'.green;
    var lastAsphaltCount = 20;
    var gridWidth = 45;
    var grid = null;
    var intervalID = null;
    var distance = 0;

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
            if( a === car.posX && line && line === car.posY ) {
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
        for( var i = output.length; i <= gridWidth; i++ ) {
            output.push(gras);
        }
        //output.push('\n');
        return output;

    };

    var draw = function() {
        grid.shift();
        //var lastPos = grid[car.posY-1].join('').indexOf(car.form);
        var dustPosY = car.posY - 1 >= 0 ? car.posY - 1 : 0;
        grid[dustPosY][car.posX - 1] = dust.black;
        grid[dustPosY][car.posX + 1] = dust.black;
        grid[dustPosY][car.posX] = dust.black;

        clearLine(0);
        grid[0][0] = 'Distance: ' + distance + ' Damage: ' + car._damage;

        if( grid[car.posY][car.posX] === gras ) {
            car.damage();
        }
        grid[car.posY][car.posX] = car.draw();
        grid.push(drawLine());
        drawGrid();
    };

    var ruleCheck = function(){
        if(car.posY <= 0){
            return gameOver();
        }
        return true;
    };

    var gameOver = function(){
        clearInterval(intervalID);
        clearLine(30);
        console.log('Game Over! To restart press s');
        return false;
    };

    var clearLine = function(posY){
        for( var i = 0; i <= gridWidth; i++ ) {
            grid[posY][i] = '';
        }
    };

    var drawGrid = function() {

        for( var i = 0; i < grid.length; i++ ) {
            var lineCount = i < 10 ? '0' + i : i;
            var line = lineCount + ' ' + grid[i].join('');
            console.log(line);
        }
    };

    var _start = function() {
        grid = [];
        car = new Car();
        initializeGrid();
        drawGrid();

        intervalID = setInterval(function() {
            if(ruleCheck()){
                draw();
                distance += 1;
            }
        }, 90);
    };


    return{
        start: _start
    };
})();

//Brumm.start();
console.log('press s to start. Control your car with n and m.');

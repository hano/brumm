#!/usr/bin/env node
var colors = require('colors');
var Car = function() {
};
Car.prototype.posX = 20;
Car.prototype.posY = 25;
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
    this.posY -= Math.abs(strength);
    if(this.posY < 0){
        this.posY = 0;
    }
};

Car.prototype.accelerate = function( strength ) {
    this.posY += Math.abs(strength);
    if(this.posY < 0){
        this.posY = 0;
    }
};

Car.prototype.damage = function() {
    this._damage += 1;
    if( this._damage % 20 !== 0 ) {
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
    var boost = '0'.yellow;
    var obstacle = ' '.redBG;
    var dust = '-'.grey;
    var gras = '#'.green;
    var lastAsphaltCount = 20;
    var gridWidth = 45;
    var grid = null;
    var intervalID = null;
    var distance = null;
    var record = 0;

    var initializeGrid = function() {

        for( var i = 0; i <= 30; i++ ) {
            grid.push(drawLine(i));
        }
    };

    var addBoost = function(){
        if(distance > 9 && distance % 4 === 0){
            return true;
        }
        return false;
    };

    var addObstacle = function(){
        if(distance > 9 && distance % 4 === 0){
            return true;
        }
        return false;
    };

    var drawLine = function( line ) {
        var output = [];
        var boostPos = Math.floor(Math.random() * lastAsphaltCount) + 0;
        var obstaclePos = Math.floor(Math.random() * lastAsphaltCount) + 0;
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
            } else if(addBoost() && a === boostPos){
                output.push(boost);
                boostPos = null;
            } else if(addObstacle() && a === obstaclePos){
                output.push(obstacle);
                obstaclePos = null;
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

    var setCarBoundary = function(){
        if(car.posY >= grid.length ){
            car.posY = grid.length - 2;
        } else if(car.posY <= 0){
            car.posY = 0;
        }
        if(car.posX >= gridWidth){
            car.posX = gridWidth;
        } else if(car.posX <= 0){
            car.posX = 0;
        }
    };

    var draw = function() {
        grid.shift();
        var dustPosY = car.posY - 1 >= 0 ? car.posY - 1 : 0;
        setCarBoundary();
        grid[dustPosY][car.posX - 1] = dust.black;
        grid[dustPosY][car.posX + 1] = dust.black;
        grid[dustPosY][car.posX] = dust.black;

        clearLine(0);
        grid[0][0] = 'Distance: ' + distance + ' Damage: ' + car._damage;

        if( grid[car.posY][car.posX] === gras ) {
            car.damage(true);
        } else if(grid[car.posY][car.posX] === boost){
            car.accelerate(1);
        } else if(grid[car.posY][car.posX] === obstacle){
            car.damage();
            car.brake(1);
        }
        setCarBoundary();
        grid[car.posY][car.posX] = car.draw();
        grid.push(drawLine());
        drawGrid();
    };

    var ruleCheck = function(){
        if(car.posY <= 0){
            return gameOver('Not fast enough!');
        } else if(car._damage > 100){
            return gameOver('Look at your car! It\'s damaged!');
        }
        return true;
    };

    var gameOver = function(reason){
        clearInterval(intervalID);
        clearLine(28);
        clearLine(29);
        clearLine(30);
        console.log('Game Over! ' + reason);
        console.log('To restart press s.');
        if(distance > record){
            record = distance;
            console.log('New Record! ' + record + ' lines.');
        } else {
            console.log('You travelled ' + distance + ' lines. Record is ' + record + ' lines.');
        }
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
        clearInterval(intervalID);
        grid = [];
        distance = 0;
        car = new Car();
        car.posY = 15;
        car.posX = 20;
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

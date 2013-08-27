"use strict"

var Game = function() {
	this.numberToConnect = 4;																	//so you could do connect X instead if you want
	this.turn = 0;
	this.gameState = [];
	this.players = [ new Player( 'red', false ), new Player( 'yellow', false ) ];
	
	this.incTurn = function() {
		this.turn += 1;
	}
	
	this.getTurn = function() {
		return this.turn % 2;
	}
	
	this.drawClickZones = function( board ) {
		for( var i = 0; i < board.widthBlocks; i++ ) {
			$( '.board' ).prepend( '<a class="clickZone" id="cz' + i + '" data-id="' + i + '"	></a>' );
			$( '#cz' + i ).css({
				'width' : board.blockWidth,
				'height' : board.heightPx
			});
		}
	}
	
	this.bindClickZones = function( board, game ) {
		$( '.clickZone' ).tap( function() {
			game.addChip( $( this ).data( 'id' ), board );
		});
	}
	
	this.initGameState = function( board ) {
		var tempArray = [];
		for( var x = 0; x < board.widthBlocks; x++ ) {
			tempArray[ x ] = [];
			for( var y = 0; y < board.heightBlocks; y++ ) {
				tempArray[ x ][ y ] = 0;
			}
		}
		
		this.gameState = tempArray;
	}
	
	this.addChip = function( zone, board ) {
		var chipPlace = this.getEmpty( zone, board );
		if( chipPlace !== false ) {																		//if the column isn't full
			this.gameState[ zone ][ chipPlace ] = this.players[ this.getTurn() ].colour;
			board.drawChip( zone, chipPlace, this.players[ this.getTurn() ].colour );
			this.checkForWin( zone, chipPlace, board, this.players[ this.getTurn() ].colour );
			this.incTurn();
		} else {
			console.log( 'this column is full' );
		}
	}
	
	this.checkForWin = function( chipX, chipY, board, colour ) {
		//to check for a line you need to check from x - ( numberToConnect - 1 ) to ( x + numberToconnect - 1 )
		//this is all a bit whack
		
		//checkHoriz
		var startPoint = chipX - ( this.numberToConnect - 1 ),
		endPoint = chipX + ( this.numberToConnect - 1 );
		
		if( startPoint < 0 ) {
			startPoint = 0;
		}
		
		if( endPoint > board.widthBlocks - 1 ) {
			endPoint = board.widthBlocks - 1;
		}
		
		var accumulator = 0;
		var output = 0;
		
		for( var s = startPoint; s <= endPoint; s++ ) {
			if( this.gameState[ s ][ chipY ] == colour ) {
				accumulator++;
				if( accumulator > output ) {
					output = accumulator;
				}
			} else {
				if( accumulator > output ) {
					output = accumulator;
				}
				accumulator = 0;
			}
		}
		
		//vert
		accumulator = 0;
		startPoint = chipY - ( this.numberToConnect - 1 ),
		endPoint = chipY + ( this.numberToConnect - 1 );
		
		if( startPoint < 0 ) {
			startPoint = 0;
		}
		
		if( endPoint > board.heightBlocks - 1 ) {
			endPoint = board.heightBlocks - 1;
		}
		
		for( var s = startPoint; s <= endPoint; s++ ) {
			if( this.gameState[ chipX ][ s ] == colour ) {
				accumulator++;
				if( accumulator > output ) {
					output = accumulator;
				}
			} else {
				if( accumulator > output ) {
					output = accumulator;
				}
				accumulator = 0;
			}
		}
		
		//diag top left - bottom right
		accumulator = 0;
		var startPointX = chipX - ( this.numberToConnect - 1 ),
		startPointY = chipY - ( this.numberToConnect - 1 ),
		endPointX = chipX + ( this.numberToConnect - 1 ),
		endPointY = chipY + ( this.numberToConnect - 1 );
		
		if( startPointX < 0 ) {
			startPointX = 0;
			startPointY = chipY - chipX;
		}
		
		if( startPointY < 0 ) {
			startPointY = 0;
			startPointX = chipX - chipY;
		}
		
		if( endPointX > board.widthBlocks - 1 ) {
			endPointX = board.widthBlocks - 1;
			endPointY = chipY + board.widthBlocks - chipX - 1;
		}
		
		if( endPointY > board.heightBlocks - 1 ) {
			endPointY = board.heightBlocks - 1;
			endPointX = chipX + board.heightBlocks - chipY - 1;
		}
		
		var loopLength = endPointX - startPointX + 1;
		
		for( var s = 0; s < loopLength; s++ ) {
			if( this.gameState[ startPointX + s ][ startPointY + s ] == colour ) {
				accumulator++;
				if( accumulator > output ) {
					output = accumulator;
				}
			} else {
				if( accumulator > output ) {
					output = accumulator;
				}
				accumulator = 0;
			}
		}
		
		//diag bottom left - top right
		accumulator = 0;
		startPointX = chipX - ( this.numberToConnect - 1 ),
		startPointY = chipY + ( this.numberToConnect - 1 ),
		endPointX = chipX + ( this.numberToConnect - 1 ),
		endPointY = chipY - ( this.numberToConnect - 1 );
		
		if( startPointX < 0 ) {
			startPointX = 0;
			startPointY = chipY + chipX;
		}
		
		if( startPointY > board.heightBlocks - 1 ) {
			startPointY = board.heightBlocks - 1;
			startPointX = chipX - ( startPointY - chipY  );//chipX - chipY;
		}
		
		if( endPointX > board.widthBlocks - 1 ) {
			endPointX = board.widthBlocks - 1;
			endPointY = chipY - ( endPointX - chipX  );
		}
		
		if( endPointY < 0 ) {
			endPointY = 0;
			endPointX = chipX - ( endPointY - chipY  );
		}
		
		var loopLength = endPointX - startPointX + 1;
		
		for( var s = 0; s < loopLength; s++ ) {
			if( this.gameState[ startPointX + s ][ startPointY - s ] == colour ) {
				accumulator++;
				if( accumulator > output ) {
					output = accumulator;
				}
			} else {
				if( accumulator > output ) {
					output = accumulator;
				}
				accumulator = 0;
			}
		}
		
		console.log( 'line detected of ' + output );
	}
	
	this.getEmpty = function( zone, board ) {
		for( var y = board.heightBlocks - 1 ; y >= 0; y-- ) {
			if( this.gameState[ zone ][ y ] == 0 ) {
				return y;
			}
		}
		return false;
	}
}

var Board = function( ) {
	this.widthBlocks = 7;
	this.heightBlocks = 6;
	this.blockWidth;
	this.widthPx;
	this.heightPx;
	this.paddingPercent = 10;
	this.paddingPx = 0;
	this.blockPPS = 0;												//block movement in pixels per second. This has to be relative to the size of the board
	
	this.createBoard = function() {
		$( 'body' ).append( '<div class="board"></div>' );
	}
	
	this.calculateDimensions = function( viewport ) {
		console.log( 'calcing dims' );
		if( viewport.x >= viewport.y ) {
			this.paddingPx = Math.floor( viewport.y / this.paddingPercent );
			this.blockWidth = Math.floor( ( viewport.y - ( this.paddingPx * 2 ) ) / this.heightBlocks );
			if( ( this.blockWidth * this.widthBlocks ) > viewport.x ) {
				this.blockWidth = Math.floor( ( viewport.x - ( this.paddingPx * 2 ) ) / this.widthBlocks );	
			}
		} else {	
			this.paddingPx = Math.floor( viewport.x / this.paddingPercent );
			this.blockWidth = Math.floor( ( viewport.x - ( this.paddingPx * 2 ) ) / this.widthBlocks );
			if( ( this.blockWidth * this.heightBlocks ) > viewport.y ) {
				this.blockWidth = Math.floor( ( viewport.y - ( this.paddingPx * 2 ) ) / this.heightBlocks );	
			}
		}
		this.heightPx = this.heightBlocks * this.blockWidth;
		this.widthPx = this.widthBlocks * this.blockWidth;
		
		//maybe PPS should be calculated elsewhere
		this.blockPPS = this.heightPx * 2.5;
		
		console.log(this.widthBlocks);
		console.log(this.heightBlocks);
		console.log(this.blockWidth);
		console.log(this.widthPx);
		console.log(this.heightPx);
		console.log(this.paddingPercent);
		console.log(this.paddingPx);
		console.log(this.blockPPS);											//block movement in pixels per second. This has to be relative to the size of the board
	}
	
	this.drawBoard = function() {
		$( '.board' ).html( '' );
		$( '.board' ).css({
			'width' : this.widthPx,
			'height' : this.heightPx,
			'top' : this.paddingPx
		});
	}
	
	this.drawChip = function( x, y, color ) {
		console.log( y );
		$( '.board' ).prepend( '<div class="chip" id="game' + x + y + '"></div>' );
		$( '#game' + x + y ).css( {
			'top' : 0 - this.paddingPx - this.blockWidth,//'top'	: y * this.blockWidth,
			'left'	: x * this.blockWidth,
			'width' : this.blockWidth,
			'height' : this.blockWidth,
			'backgroundColor' : color,
			'opacity' : 0
		});
		
		console.log( ( this.paddingPx ) );
		
		var distanceToFall = ( y * this.blockWidth ) + this.paddingPx + this.blockWidth;
		
		var animTime = ( distanceToFall / this.blockPPS ) * 1000;
		
		$( '#game' + x + y ).animate({
			'top' : '+=' + distanceToFall,
			'opacity' : 1
		}, animTime, 'linear' );
	}
	
	this.drawGame = function( game ) {
		for( var x = 0; x < this.widthBlocks; x++ ) {
			for( var y = 0; y < this.heightBlocks; y++ ) {
				if( game.gameState[ x ][ y ] != 0 ) {
					$( '.board' ).prepend( '<div class="chip" id="game' + x + y + '"></div>' );	
					$( '#game' + x + y  ).css({
						'width' : this.blockWidth,
						'height' : this.blockWidth,
						'top' : this.blockWidth * y,
						'left' : this.blockWidth * x,
						'backgroundColor' : game.gameState[ x ][ y ]
						
					});
				}
			}
		}
	}
}

var Player = function( colour, isComputer ) {
	this.colour = colour;
	this.isComputer = isComputer;
}

function getViewport() {
	var viewport = {
		'x' : $(window).width(),
		'y' : $(window).height()
	};
	
	return viewport;
}

var board = new Board();
var game = new Game();

game.initGameState( board );
board.createBoard();

function mainLoop() {
	//too much redrawing is happening
	
	var viewport = getViewport();
	board.calculateDimensions( viewport );
	board.drawBoard();
	board.drawGame( game );
	
	game.drawClickZones( board );
	game.bindClickZones( board, game );
    
    if ( viewport.x < 480) {

    }
    
    if ( viewport.x > 480) {
        
    }
    
    if ( viewport.x >= 768) {
    
    }
    
    if ( viewport.x > 1030) {

    }
}

jQuery(document).ready(function($) {
    mainLoop();
	$( window ).smartresize(function(){
	    mainLoop();	
 	});
});
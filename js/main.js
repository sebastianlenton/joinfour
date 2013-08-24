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
			$( '.board' ).prepend( '<a href="#" class="clickZone" id="cz' + i + '" data-id="' + i + '"	></a>' );
			$( '#cz' + i ).css({
				'width' : board.blockWidth,
				'height' : board.heightPx
			});
		}
	}
	
	this.bindClickZones = function( board, game ) {
		$( '.clickZone' ).click( function() {
			game.addChip( $( this ).data( 'id' ), board );
			mainLoop();
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
			this.checkForWin( zone, chipPlace, board, this.players[ this.getTurn() ].colour );
			this.incTurn();
		} else {
			console.log( 'this column is full' );
		}
	}
	
	this.checkForWin = function( chipX, chipY, board, colour ) {
		//check horiz
		for( var q = 0; q <= board.widthBlocks - this.numberToConnect; q++ ) {
			var accumulator = 0;
			for( var k = 0; k < this.numberToConnect; k++ ) {
				if( this.gameState[ k + q ][ chipY ] == colour ) {
					accumulator += 1;
				}
			}
			if( accumulator == this.numberToConnect ) {
				console.log( colour + ' wins (horiz)!' );
			}
		}
		//check vert
		for( var q = 0; q <= board.heightBlocks - this.numberToConnect; q++ ) {
			var accumulator = 0;
			for( var k = 0; k < this.numberToConnect; k++ ) {
				if( this.gameState[ chipX ][ k + q ] == colour ) {
					accumulator += 1;
				}
			}
			if( accumulator == this.numberToConnect ) {
				console.log( colour + ' wins (vert)!' );
			}
		}
		//check diag (top left - bottom right)
		
		//check diag (bottom left - top right)
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
	
	this.createBoard = function() {
		$( 'body' ).append( '<div class="board"></div>' );
	}
	
	this.calculateDimensions = function( viewport ) {
		if( viewport.x >= viewport.y ) {
			this.paddingPx = viewport.y / this.paddingPercent;
			this.blockWidth = Math.floor( ( viewport.y - ( this.paddingPx * 2 ) ) / this.heightBlocks );
			if( ( this.blockWidth * this.widthBlocks ) > viewport.x ) {
				this.blockWidth = Math.floor( ( viewport.x - ( this.paddingPx * 2 ) ) / this.widthBlocks );	
			}
		} else {	
			this.paddingPx = viewport.x / this.paddingPercent;	
			this.blockWidth = Math.floor( ( viewport.x - ( this.paddingPx * 2 ) ) / this.widthBlocks );
			if( ( this.blockWidth * this.heightBlocks ) > viewport.y ) {
				this.blockWidth = Math.floor( ( viewport.y - ( this.paddingPx * 2 ) ) / this.heightBlocks );	
			}
		}
		this.heightPx = this.heightBlocks * this.blockWidth;
		this.widthPx = this.widthBlocks * this.blockWidth;
	}
	
	this.drawBoard = function() {
		$( '.board' ).html( '' );
		$( '.board' ).css({
			'width' : this.widthPx,
			'height' : this.heightPx,
			'top' : this.paddingPx
		});
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

//checks for win condition
	
//chip
//dimensions ( got from board )
//



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
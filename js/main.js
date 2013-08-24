"use strict"

var Game = function() {
	this.turn = 0;
	this.drawClickZones = function( board ) {
		//console.log( 'draw click zones' );
		for( var i = 0; i < board.widthBlocks; i++ ) {
			$( '.board' ).prepend( '<a href="#" class="clickZone" id="cz' + i + '" data-id="' + i + '"	></a>' );
			$( '#cz' + i ).css({
				'width' : board.blockWidth,
				'height' : board.heightPx
			});
		}
	}
	this.bindClickZones = function( board ) {
		$( '.clickZone' ).click( function() {
			board.addChip( $( this ).data( 'id' ) );
			mainLoop();
		});
	}
}

var Board = function( ) {
	this.widthBlocks = 13;
	this.heightBlocks = 9;
	this.blockWidth;
	this.widthPx;
	this.heightPx;
	this.gameState = [];
	
	this.initGameState = function() {
		var tempArray = [];
		for( var x = 0; x < this.widthBlocks; x++ ) {
			tempArray[ x ] = [];
			for( var y = 0; y < this.heightBlocks; y++ ) {
				tempArray[ x ][ y ] = 0;
			}
		}
		
		this.gameState = tempArray;
	}
	
	this.calculateDimensions = function( viewport ) {
		if( viewport.x > viewport.y ) {
			this.blockWidth = Math.floor( viewport.y / this.heightBlocks );
		} else {
			this.blockWidth = Math.floor( viewport.x / this.widthBlocks );
		}
		this.heightPx = this.heightBlocks * this.blockWidth;
		this.widthPx = this.widthBlocks * this.blockWidth;
	}
	
	this.draw = function(  ) {
		$( '.board' ).html( '' );
		$( '.board' ).css({
			'width' : this.widthPx,
			'height' : this.heightPx
		});
		
		this.drawGame();
	}
	
	this.drawGame = function() {
		for( var x = 0; x < this.widthBlocks; x++ ) {
			for( var y = 0; y < this.heightBlocks; y++ ) {
				if( this.gameState[ x ][ y ] != 0 ) {
					$( '.board' ).prepend( '<div class="chip" id="game' + x + y + '"></div>' );
					
					$( '#game' + x + y  ).css({
						'width' : this.blockWidth,
						'height' : this.blockWidth,
						'top' : this.blockWidth * y,
						'left' : this.blockWidth * x,
						'backgroundColor' : 'red'
						
					});
				}
			}
		}
	}
	
	this.addChip = function( zone ) {
			this.gameState[ zone ][ this.getEmpty( zone ) ] = 1;
	}
	
	this.getEmpty = function( zone ) {
		for( var y = this.heightBlocks - 1 ; y >= 0; y-- ) {
			if( this.gameState[ zone ][ y ] == 0 ) {
				return y;
			}
		}
	}
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

$( 'body' ).append( '<div class="board"></div>' );
board.initGameState();
console.log( board.gameState );

function mainLoop() {
	//too much redrawing is happening
	
	var viewport = getViewport();
	board.calculateDimensions( viewport );
	board.draw();
	
	game.drawClickZones( board );
	game.bindClickZones( board );
    
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
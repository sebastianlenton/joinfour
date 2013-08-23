"use strict"

//the board object
var Board = function( ) {
	this.widthBlocks = 7;
	this.heightBlocks = 6;
	this.blockWidth;
	this.widthPx;
	this.heightPx;
	this.game = [];
	
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
		$( '.board' ).css({
			'width' : this.widthPx,
			'height' : this.heightPx
		});
	}
}
	//works out its dimensions (7x6)
	//draws itself
	//maintains an array representing state
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
$( 'body' ).append( '<div class="board"></div>' );

function mainLoop() {
	var viewport = getViewport();
	board.calculateDimensions( viewport );
	board.draw();
    
    if ( viewport.x < 480) {
        console.log( 'SMALLLL' );
    }
    
    if ( viewport.x > 480) {
        
    }
    
    if ( viewport.x >= 768) {
    
    }
    
    if ( viewport.x > 1030) {
    	console.log( 'BIIIG' );
    }
}

jQuery(document).ready(function($) {
    mainLoop();
	$( window ).smartresize(function(){
	    mainLoop();	
 	});
});
"use strict"
//todo:

//do comp detect own potential to make a 4
//front end CSS

var Game = function() {
	this.won = false;
	this.numberToConnect = 4;																	//so you could do connect X instead if you want
	this.turn = 0;
	this.gameState = [];
	this.players = [];
	this.isTwoPlayer = false;
	
	this.setPlayers = function( howMany ) {
		if( howMany == 1 ) {
			this.isTwoPlayer = false;
			this.players = [ new Player( 'red', false ), new Player( 'yellow', true ) ];
		} else if( howMany == 2 ) {
			this.isTwoPlayer = true;
			this.players = [ new Player( 'red', false ), new Player( 'yellow', false ) ];
		} else {
			throw "More than two human players set in Game.setPlayers";
		}
	}
	
	this.incTurn = function() {
		this.turn += 1;
	}
	
	this.getTurn = function( next) {
		if( next === true ) {
			return ( this.turn + 1 ) % 2;
		} else {
			return this.turn % 2;
		}
	}
	
	this.checkTurnsAreLeft = function( board ) {
		if( this.turn  < board.widthBlocks * board.heightBlocks ) {
			return true;
		} else {
			return false;
		}
	}
	
	this.drawClickZones = function( board ) {									//this should really be in Board, I guess (so game logic and drawing are separate)
		for( var i = 0; i < board.widthBlocks; i++ ) {
			$( '.board' ).prepend( '<a class="clickZone" id="cz' + i + '" data-id="' + i + '"	></a>' );
		}
	}
	
	this.calcClickZonesCSS = function( board ) {
		for( var i = 0; i < board.widthBlocks; i++ ) {
			$( '#cz' + i ).css({
				'width' : board.blockWidth,
				'height' : board.heightPx
			});
		}
	}
	
	this.bindClickZones = function( board, game, frontEnd ) {								//this should really be in Board, I guess (so game logic and drawing are separate)
		game.unbindClickZones();															//unbind them first (this is super hacky...)
		$( '.clickZone' ).tap( function() {
			game.addChip( $( this ).data( 'id' ), board, frontEnd );
		});
	}
	
	this.unbindClickZones = function() {
		$( '.clickZone' ).unbind();
	}
	
	this.initGameState = function( board ) {
		this.won = false;
		this.turn = 0;
		var tempArray = [];
		for( var x = 0; x < board.widthBlocks; x++ ) {
			tempArray[ x ] = [];
			for( var y = 0; y < board.heightBlocks; y++ ) {
				tempArray[ x ][ y ] = 0;
			}
		}
		
		this.gameState = tempArray;
	}
	
	this.addChip = function( zone, board, frontEnd ) {
		var chipPlace = this.getEmpty( zone, board, game.gameState );									//this should be moved out of this function!
		if( chipPlace !== false ) {																		//if the column isn't full
			this.gameState[ zone ][ chipPlace ] = this.players[ this.getTurn() ].colour;
			board.drawChip( zone, chipPlace, this.players[ this.getTurn() ].colour );
			var longestLine = this.checkForWin( zone, chipPlace, board, this.players[ this.getTurn() ].colour, game.gameState );
			if( longestLine >= this.numberToConnect ) {
				setTimeout(																		//				:(
					function() {
						var frontEndText = '';
						if( !game.isTwoPlayer ) {												//				:(
							if( game.players[ game.getTurn() ].colour == 'yellow' ) {
								frontEndText = 'Computer Wins!';
							} else if( game.players[ game.getTurn() ].colour == 'red' ) {
								frontEndText = 'You Win!';
							}
							frontEnd.setHeadline( frontEndText );
							frontEnd.setButtons( frontEnd.buttonsGameOverSinglePlayer );
							frontEnd.bindButtons();
							frontEnd.show();
						} else if( game.isTwoPlayer ) {											//				:(
							if( game.players[ game.getTurn() ].colour == 'yellow' ) {
								frontEndText = 'Player 2 ';
							} else if( game.players[ game.getTurn() ].colour == 'red' ) {
								frontEndText = 'Player 1 ';
							}
							frontEnd.setHeadline( frontEndText + 'Wins!' );
							frontEnd.setButtons( frontEnd.buttonsGameOverTwoPlayer );
							frontEnd.bindButtons();
							frontEnd.show();
						} else {
							throw "game.isTwoPlayer set to a bad value";
						}
					}
				, 500 );					//THIS NEEDS A PROPER DELAY TIME SET, because otherwise the gsme is declared as "won" before the piece drops to the bottom of the board
				this.unbindClickZones();
			} else {
				this.incTurn();
				mainLoop();
			}
		}
	}
	
	this.checkForWin = function( chipX, chipY, board, colour, gameState ) {
		//to check for a line you need to check from x - ( numberToConnect - 1 ) to ( x + numberToconnect - 1 )
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
			if( gameState[ s ][ chipY ] == colour ) {
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
			if( gameState[ chipX ][ s ] == colour ) {
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
			if( gameState[ startPointX + s ][ startPointY + s ] == colour ) {
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
			startPointX = chipX - ( startPointY - chipY  );
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
			if( gameState[ startPointX + s ][ startPointY - s ] == colour ) {
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
		
		return output;
	}
	
	this.getEmpty = function( zone, board, gameState ) {
		for( var y = board.heightBlocks - 1 ; y >= 0; y-- ) {
			if( gameState[ zone ][ y ] == 0 ) {
				return y;
			}
		}
		return false;
	}
}

var Board = function( ) {
	this.widthBlocks = 6;
	this.heightBlocks = 6;
	this.blockWidth;
	this.widthPx;
	this.heightPx;
	this.paddingPercent = 20;										//I don't know why this is called paddingPercent as it's not a percentage
	this.paddingPx = 0;
	this.blockPPS = 0;												//block movement in pixels per second. This has to be relative to the size of the board
	this.top = 0;
	
	this.create = function() {
		$( 'body' ).append( '<div class="board"></div>' );
	}
	
	this.calculateDimensions = function( viewport ) {
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
		
		this.blockPPS = Math.floor( this.heightPx * 2.5 );							//block movement in pixels per second. This has to be relative to the size of the board
		this.top = Math.floor( ( ( viewport.y / 2 ) - ( this.heightPx / 2 ) ) * .75 );			//sweetener
	}
	
	this.drawBoard = function() {
		$( '.board' ).css({
			'width' : this.widthPx,
			'height' : this.heightPx,
			'top' : this.top
		});
	}
	
	this.drawChip = function( x, y, color ) {
		$( '.board' ).prepend( '<div class="chip" id="game' + x + y + '"></div>' );
		$( '#game' + x + y ).css( {
			'top' : 0 - this.paddingPx - this.blockWidth,//'top'	: y * this.blockWidth,
			'left'	: x * this.blockWidth,
			'width' : this.blockWidth,
			'height' : this.blockWidth,
			'backgroundColor' : color,
			'opacity' : 0
		});
		
		var distanceToFall = ( y * this.blockWidth ) + this.paddingPx + this.blockWidth;
		var animTime = ( distanceToFall / this.blockPPS ) * 1000;
		
		$( '#game' + x + y ).animate({
			'top' : '+=' + distanceToFall,
			'opacity' : 1
		}, animTime, 'linear' );
	}
	
	this.drawGame = function( game ) {
		if( game.gameState.length > 0 ) {
			$( '.chip' ).remove();
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
	
	this.clearChips = function() {
		var distanceToFall = 250;			//arbitrary ATM
		var animTime = ( distanceToFall / ( this.blockPPS / 2 ) ) * 1000;
	
		$( '.chip' ).attr( 'id', '' );			//take off the ID, so chips during animation are completely disassociated from the game
		$( '.chip' ).addClass( 'falling' );		//so we know which ones should be removed after the anim completes
		$( '.chip' ).animate({
			'top' : '+=' + distanceToFall,
			'opacity' : 0
		}, animTime, 'linear', function() { $( '.board .chip.falling' ).remove() });
	}
}

var Player = function( colour, isComputer ) {
	this.colour = colour;
	this.isComputer = isComputer;
	//add a minimum of computer "thinking" time
	this.compTurnDelay =450;
	this.compTurnDelayRandom = 1000;
	
	//the below methods are for computer AI moves
	this.randomMove = function( board, game, frontEnd ) {
		var myMove = Math.round( Math.random() * ( board.widthBlocks - 1 ) );
		var chipPlace = game.getEmpty( myMove, board, game.gameState );
		
		while( chipPlace === false ) {																//if the column is full, keep doing it
			var myMove = Math.round( Math.random() * ( board.widthBlocks - 1 ) );
			var chipPlace = game.getEmpty( myMove, board, game.gameState );
		}
	
		setTimeout( function() {																	//but don't do it instantly - add a delay as "thinking" time
			game.addChip( myMove, board, frontEnd );
		}, this.getThinkingTime() );
	}
	
	this.calculatedMove = function( board, game, frontEnd ) {
		var enemyThisPosition = false;
		for( var w = 0; w < board.widthBlocks; w ++ )	{											//check the player's moves, and that they're not able to join four in next turn - if so, block
			var tempGameState = copyArray( game.gameState );
			
			var chipPlace = game.getEmpty( w, board, game.gameState );
			if( chipPlace !== false ) {																//if the column isn't full
				var nextTurnColour = game.players[ game.getTurn( true ) ].colour;
				tempGameState[ w ][ chipPlace ] = nextTurnColour;
				if( game.checkForWin( w, chipPlace, board, nextTurnColour, tempGameState ) == game.numberToConnect ) {
					enemyThisPosition = w;
					break;
				}
			}																						//I ought to add a check for comp opportunities to win at some point
		}																						
		if( enemyThisPosition !== false )	{
			setTimeout( function() {																//but don't do it instantly - add a delay as "thinking" time
				game.addChip( enemyThisPosition, board, frontEnd );
			}, this.getThinkingTime() );
		} else {
			this.randomMove( board, game, frontEnd );	
		}
	}
	
	this.getOtherPlayersFirstMove = function( game, board ) {										//this is to do with blocking the ease of winning against the comp by making a line at the start
		var boardLowestPoint = board.heightBlocks - 1;
		var boardWidth = board.widthBlocks;
		
		for( var k = 0; k < boardWidth; k++ ) {
			if( game.gameState[ k ][ boardLowestPoint ] != 0 ) {
				return k;
				break;
			}
		}
	}
	
	this.moveNextTo = function( where, board ) {															//this is to do with blocking the ease of winning against the comp by making a line at the start
		if( where == 0 ) {
			return 1;
		} else if( where >= board.widthBlocks - 1 ) {
			return board.widthBlocks - 2;
		} else {
			return where + 1;
		}
	}
	
	this.makeMove = function( board, game, frontEnd ) {
		if( game.turn == 0 ) {
			this.randomMove( board, game, frontEnd );
		} else if( game.turn == 1 ) {
			var enemyMove = this.getOtherPlayersFirstMove( game, board );
			var myMove = this.moveNextTo( enemyMove, board );
			setTimeout( function() {
				game.addChip( myMove, board, frontEnd );
			}, this.getThinkingTime() );
		} else {
			this.calculatedMove( board, game, frontEnd );
		}
	};
	
	this.getThinkingTime = function() {
		return Math.round( ( Math.random() * this.compTurnDelayRandom ) + this.compTurnDelay );
	};
}

var FrontEnd = function() {
	this.opacity = 0.5;
	this.hintSelector = $( 'p.hint' );												//change this if the markup changes re hint

	this.create = function() {
		$( 'body' ).prepend( '<div class="overlay" id="frontEnd"></div>' );
	}
	
	this.show = function() {
		$( '#frontEnd' ).fadeIn();
	}
	
	this.hide = function() {
		$( '#frontEnd' ).fadeOut();
	}
	
	this.setHeadline = function( headlineText ) {
		$( '#frontEnd h1' ).remove();
		$( '#frontEnd' ).prepend( '<h1>' + headlineText + '</h1>' );
	}
	
	this.setButtons = function( buttonsArray ) {
		$( '#frontEnd .button' ).remove();
		for( var h = 0; h < buttonsArray.length; h++ ) {
			$( '#frontEnd' ).append( '<a class="button" id="' + buttonsArray[ h ][ 1 ] + '">' + buttonsArray[ h ][ 0 ] + '</a>' );
		}
	}
	
	this.setHint = function( hint ) {
		this.hintSelector.text( hint );
	}
	
	this.fadeInHint = function() {
		this.hintSelector.animate({
			'opacity' : this.opacity
		} );
	}
	
	this.hideHint = function() {
		this.hintSelector.css( 'opacity', 0 );
	}
	
	this.fadeOutHint = function() {
		this.hintSelector.fadeOut( 200 );
	}
	
	this.bindButtons = function() {
		$( '#singlePlayer' ).on( 'tap', function() {
			frontEnd.hide();
			game.setPlayers( 1 );
			game.initGameState( board );
			board.clearChips();
			mainLoop();
		} );
		$( '#twoPlayer' ).on( 'tap', function() {
			frontEnd.hide();
			game.setPlayers( 2 );
			game.initGameState( board );
			board.clearChips();
			mainLoop();
		} );
	}
	
	this.buttonsTitleScreen = [
		[ '1 Player (against computer)', 'singlePlayer' ],
		[ '2 Player (take turns)', 'twoPlayer' ]
	];
	
	this.buttonsGameOverSinglePlayer = [
		[ 'play against computer again', 'singlePlayer' ],
		[ 'try two player mode', 'twoPlayer' ]
	];
	
	this.buttonsGameOverTwoPlayer = [
		[ 'another two player game?', 'twoPlayer' ],
		[ 'play single player', 'singlePlayer' ]
	];
}

//here is the game
var frontEnd = new FrontEnd();
var board = new Board();
var game = new Game();

frontEnd.create();
frontEnd.setHeadline( 'Join Four' );
frontEnd.setButtons( frontEnd.buttonsTitleScreen );
frontEnd.bindButtons(  );

function drawGame() {
	var viewport = getViewport();
	board.create();
	board.calculateDimensions( viewport );
	board.drawBoard();
	game.drawClickZones( board );
	game.calcClickZonesCSS( board );
}

function redrawGame() {
	var viewport = getViewport();
	board.calculateDimensions( viewport );
	board.drawBoard();
	board.drawGame( game );
	
	game.calcClickZonesCSS( board );
	
	if ( viewport.x < 480) {

    }
    
    if ( viewport.x > 480) {
        
    }
    
    if ( viewport.x >= 768) {
    
    }
    
    if ( viewport.x > 1030) {

    }
}

function mainLoop() {
	if( game.checkTurnsAreLeft( board ) ) {
		if( !game.players[ game.getTurn() ].isComputer ) {
			game.bindClickZones( board, game, frontEnd );
			frontEnd.hideHint();
			if( game.isTwoPlayer ) {
				frontEnd.setHint( 'Player ' + ( game.getTurn() + 1 ) + '\'s turn (select where to place)' );
			} else {
				frontEnd.setHint( 'Your turn (select where to place)' );
			}
			frontEnd.fadeInHint();
		} else {
			frontEnd.hideHint();
			frontEnd.setHint( 'Computer\'s turn' );
			frontEnd.fadeInHint();
			game.unbindClickZones();
			game.players[ game.getTurn() ].makeMove( board, game, frontEnd );
		}
	} else {
		game.unbindClickZones();
		frontEnd.setHeadline( 'It\'s a Draw!' );
		frontEnd.setButtons( frontEnd.buttonsGameOverSinglePlayer );
		frontEnd.bindButtons();
		frontEnd.show();
	}
}

jQuery(document).ready(function($) {
	drawGame();
	
	$( window ).smartresize(function(){
		redrawGame();
 	});
});

//couple of helper functions
function getViewport() {
	var viewport = {
		'x' : $(window).width(),
		'y' : $(window).height()
	};
	
	return viewport;
}

function copyArray( arrayToBeCopied ) {
	var newArray = [];
	for( var x = 0; x < arrayToBeCopied.length; x++ ) {
		newArray[ x ] = [];
		for( var y = 0; y < arrayToBeCopied[x].length; y++ ) {
			newArray[x][y] = arrayToBeCopied[x][y];
		}
	}
	return newArray;
}
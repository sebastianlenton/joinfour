function loadState() {
	if( readCookie( 'SFL1981__btnDiagShowRulers' ) ) {
		jQuery( 'html' ).addClass( 'ruler' );
	}
	if( readCookie( 'SFL1981__btnDiagShowVGuide' ) ) {
		jQuery( 'html' ).addClass( 'verticalGuides' );
	}
	if( readCookie( 'SFL1981__btnDiagTypeBg' ) ) {
		jQuery( 'html' ).addClass( 'typeBg' );
	}
	if( readCookie( 'SFL1981__btnDiagShowConsole' ) ) {
		jQuery( '.consoleContainer' ).addClass( 'animate' );
	}
}

function writeConsoleLine( value ) {
	jQuery( '#console' ).append( '<p>' + value + '</p>' );
}

function updateDiagBox( value ) {
    jQuery( '.diagBox' ).html( value );
}

function bindDiagClicks() {
	jQuery( '.diagBox' ).tap( function() {
		jQuery( '#SFLDiagnostic' ).toggleClass( 'animate' );
		writeConsoleLine( 'tap' );
	});
	
	jQuery( '#btnDiagShowRulers' ).tap( function() {
		jQuery( 'html' ).toggleClass( 'ruler' );
		toggleCookie( 'SFL1981__btnDiagShowRulers', true, 999 );
	});
	
	jQuery( '#btnDiagShowVGuide' ).tap( function() {
		jQuery( 'html' ).toggleClass( 'verticalGuides' );
		toggleCookie( 'SFL1981__btnDiagShowVGuide', true, 999 );
	});
	
	jQuery( '#btnDiagShowConsole' ).tap( function() {
		jQuery( '.consoleContainer' ).toggleClass( 'animate' );
		toggleCookie( 'SFL1981__btnDiagShowConsole', true, 999 );
	});
	
	jQuery( '#btnDiagTypeBg' ).tap( function() {
		jQuery( 'html' ).toggleClass( 'typeBg' );
		toggleCookie( 'SFL1981__btnDiagTypeBg', true, 999 );
	});
		
	jQuery( '#btnDiagAllOff' ).tap( function() {
		jQuery( 'html' ).removeClass( 'verticalGuides ruler typeBg' );
		jQuery( '.consoleContainer' ).removeClass( 'animate' );
		jQuery( '#SFLDiagnostic' ).removeClass( 'animate' );
		eraseCookie( 'SFL1981__btnDiagShowRulers' );
		eraseCookie( 'SFL1981__btnDiagShowVGuide' );
		eraseCookie( 'SFL1981__btnDiagShowConsole' );
		eraseCookie( 'SFL1981__btnDiagTypeBg' );
	});
}

jQuery(document).ready(function($) {
	jQuery( '#SFLDiagnostic' ).removeClass( 'animate' );
    var responsive_viewport = $(window).width();
    
    if (responsive_viewport < 480) {
    
    }
    
    if (responsive_viewport > 480) {
        
    }
    
    if (responsive_viewport >= 768) {
    
    }
    
    if (responsive_viewport > 1030) {
    
    }
    
    loadState();
    bindDiagClicks();
	updateDiagBox( responsive_viewport );
	
	$(window).smartresize(function(){
		var responsive_viewport = $(window).width();
		updateDiagBox( responsive_viewport );
 	});
});

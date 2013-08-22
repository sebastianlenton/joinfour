<?php
	$httpHost = $_SERVER['HTTP_HOST'];

	if( ( strpos( $httpHost, '.localhost' ) !== false ) || ( strpos( $httpHost, '92.' ) !== false ) ) {
		?>
		<div id="SFLDiagnostic" class="overlay">
			<div class="wrap">
				<h2>Options</h2>
				<p>
					<a id="btnDiagShowRulers" class="button">
						Show rulers
					</a>
				</p>
				<p>
					<a id="btnDiagShowVGuide" class="button">
						Show vertical guides
					</a>
				</p>
				<p>
					<a id="btnDiagShowConsole" class="button">
						Show console
					</a>
				</p>
				<p>
					<a id="btnDiagTypeBg" class="button">
						Highlight type
					</a>
				</p>
				<p>
					<a id="btnDiagAllOff" class="button">
						All off!
					</a>
				</p>
			</div>
		</div>
		
		<div class="diagBox" href="#">
			noJS
		</div>
		
		<div class="consoleContainer">
			<div id="console">
			
			</div>
		</div>
		
		<script src="js/diagnostic.js"></script>		
		<?php
	}
?>
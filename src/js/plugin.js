// This function is required to notify developer if JQuery is not present
document.addEventListener("DOMContentLoaded", function(event) {
	if(!window.jQuery)
	{
		console.clear();
		console.log("%cJquery is required to run BL Share Plugin.", "color:red;font-size:24px;");
	}
});
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variables rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "blShare",
		defaults = {
			theme: "light",
			customUrl: null,
			facebookAppId: null,
			twitterHandle: null,
		},
		$currentUrl = window.location.href.split('#')[0],
		share_title = document.title,
		meta_description = document.querySelector("meta[name=\'description\']").getAttribute("content"),
		share_text = meta_description.substr(0, 90);

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend( Plugin.prototype, {
		init: function() {
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			// you can add more functions like the one below and
			// call them like the example below
			// Load All Elements
			$currentUrl = ( this.settings.customUrl != null ) ? this.settings.customUrl : $currentUrl;
			this.loadElements();
			// Attach a click handler for share button
			$(this.element).on('click', function(e)
			{
				e.preventDefault();
				if (navigator.share) {
					navigator.share(
					{
						title: share_title,
						text: share_text,
						url: $currentUrl
					})
					.then(() => {
						// Shared Successfully
					})
					.catch(err => {
						console.log(`Couldn't share because of`, err.message);
					});
				}
				else
				{
					$('.bl_share').fadeIn('fast');
				}
			});
			// Set current URL in the field
			$('.bl_url').val($currentUrl);
			// Attach click events on Close and background
			$('.bl_close, .bl_popup_protector').on('click', function()
			{
				$('.bl_share').fadeOut('fast');
			});
			// Copy to Clipboard Funciton
			$('#bl_copy').on('click', function()
			{
				$('.bl_url').select();
				document.execCommand('copy');
				$('.bl_copied').fadeIn().slideUp('slow');
			});
			// Share Funcitons
			this.LinkShare();
		},
		loadElements: function()
		{
			var $colorTheme = this.settings.theme;
			var $ShareElement = `
				<div class="bl_share bl_hidden">
					<div class="bl_popup_protector"></div>
					<div class="bl_share_popup bl_theme_${$colorTheme}">
						<div class="bl_share_container">
							<div class="bl_heading">
								<span class="bl_header"></span>
								<span class="bl_primary bl_close bl_text_center">X</span>
							</div>
							<div class="bl_row">
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_facebook">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#3B5998" fill-rule="nonzero"></path>
												<path d="M25.7305108 45h5.4583577V30.0073333h4.0947673l.8098295-4.6846666h-4.9045968V21.928c0-1.0943333.7076019-2.2433333 1.7188899-2.2433333h2.7874519V15h-3.4161354v.021c-5.3451414.194-6.4433395 3.2896667-6.5385744 6.5413333h-.0099897v3.7603334H23v4.6846666h2.7305108V45z" fill="#FFF"></path>
											</g>
										</svg>
									</span>
									Facebook
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_twitter">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd">
												<path d="M28.486325 59.969298c-6.636404-.569063-11.56302-2.326956-16.321973-5.823932C4.443764 48.472116 0 39.646792 0 29.986934 0 15.11156 10.506778 2.798388 25.274412.36718c6.028107-.992411 12.703853.049265 18.28794 2.85363 13.576275 6.818095 19.7813 22.541053 14.64267 37.103159-3.527955 9.997705-12.789708 17.617785-23.391072 19.244938-2.085625.320112-5.065149.508645-6.327625.400391z" fill="#1DA1F2" fill-rule="nonzero"></path>
												<path d="M45.089067 17.577067c-.929778.595555-3.064534 1.460977-4.117334 1.460977v.001778C39.7696 17.784 38.077156 17 36.200178 17c-3.645511 0-6.6016 2.956089-6.6016 6.600178 0 .50631.058666 1.000178.16711 1.473778h-.001066c-4.945066-.129778-10.353422-2.608356-13.609244-6.85049-2.001778 3.46489-.269511 7.3184 2.002133 8.72249-.7776.058666-2.209067-.0896-2.882844-.747023-.045156 2.299734 1.060622 5.346845 5.092622 6.452267-.776533.417778-2.151111.297956-2.7488.209067.209778 1.941333 2.928355 4.479289 5.901155 4.479289C22.46009 38.565156 18.4736 40.788089 14 40.080889 17.038222 41.929422 20.5792 43 24.327111 43c10.650667 0 18.921956-8.631822 18.4768-19.280356-.001778-.011733-.001778-.023466-.002844-.036266.001066-.027378.002844-.054756.002844-.0832 0-.033067-.002844-.064356-.003911-.096356.9696-.66311 2.270578-1.836089 3.2-3.37991-.539022.296888-2.156089.891377-3.6608 1.038932.965689-.521244 2.396444-2.228266 2.749867-3.585777" fill="#FFF"></path>
											</g>
										</svg>
									</span>
									Twitter
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_google">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#D34836" fill-rule="nonzero"></path>
												<g fill="#FFF">
													<path d="M14.0262583 29.39802899c.08509308-5.09638581 4.76554954-9.5598057 9.85667266-9.38978027 2.43911114-.11312582 4.73225224.9494489 6.60060064 2.4419691-.7971172.90669003-1.6228229 1.78072172-2.5053694 2.5978538-2.2457177-1.55413338-5.44024025-1.9978829-7.68595796-.20302046-3.21335736 2.22447124-3.35932733 7.47674174-.26906907 9.87123844 3.0055015 2.7301706 8.68655853 1.3743441 9.51697293-2.8055879-1.8828108-.0282814-3.769994 0-5.65246843-.0612765-.00470871-1.1241879-.00941741-2.24837576-.00470871-3.37256366 3.14709914-.00942715 6.29419824-.01414072 9.44600604.00942716.1886847 2.6449896-.1604325 5.4600045-1.7835916 7.6471038-2.4582823 3.4621217-7.3936817 4.4728471-11.24372375 2.989754-3.86416816-1.4736659-6.60093693-5.5593263-6.27536336-9.72511751M40.1964204 26.05405405h2.8073994c.0047087.94002175.0094174 1.88442039.0188349 2.82444214.939051.00942715 1.8824744.00942715 2.8215255.0188543v2.81030141c-.9390511.0094271-1.8777658.0141407-2.8215255.0235679-.0094175.9447353-.0141262 1.884757-.0188349 2.8244421h-2.8121081c-.0094174-.9396851-.0094174-1.8797068-.0188348-2.8197285-.9390511-.0094272-1.8828108-.0188544-2.8215255-.0282815v-2.81030141c.9387147-.00942715 1.8777657-.01414073 2.8215255-.0188543.0047087-.94473533.0141261-1.88442039.0235435-2.82444214"></path>
												</g>
											</g>
										</svg>
									</span>
									Google+
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_blogger">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#F57D00" fill-rule="nonzero"></path>
												<path d="M35.8273333 36.7781555H24.045c-.944 0-1.592-.5735923-1.592-1.5222386 0-.9493136.648-1.5225723 1.592-1.5225723h11.7823333c.944 0 1.592.5732587 1.592 1.5225723 0 .9486463-.648 1.5222386-1.592 1.5222386M24.0446667 23.2381737h6.5086666c.8886667 0 1.6086667.6066264 1.6086667 1.4995484 0 .8932558-.72 1.5155651-1.6086667 1.5155651h-6.5086666c-.8886667 0-1.6086667-.6223093-1.6086667-1.5155651 0-.892922.72-1.4995484 1.6086667-1.4995484M42.742 26.2469473c-.2083333 0-.8533333.0106777-1.8556667.0106777-1.3863333 0-1.2346666-1.2973397-1.2346666-1.2973397 0-5.4276047-4.42-9.9602853-9.757-9.9602853h-5.2313334C19.3263333 15 15 19.3998768 15 24.8274815v10.3613661c0 5.4276047 4.3263333 9.8274815 9.6633333 9.8274815H35.243c5.337 0 9.6633333-4.3998768 9.6633333-9.8274815 0 0 .0936667-3.7829063.0936667-6.5711188 0-1.356067-1.039-2.3707815-2.258-2.3707815" fill="#FFF"></path>
											</g>
										</svg>
									</span>
									Blogger
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_reddit">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill-rule="nonzero" fill="none">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#FF4500"></path>
												<path d="M34.1335847 43.9991814c1.6336774-.3831682 2.81654-.7939438 3.9781753-1.3815065 3.6153903-1.8286959 5.8788354-4.8645264 5.8788354-7.8849481 0-.9131088.0196207-.9556355.780668-1.6923265.6040409-.5847092.8404012-.962515 1.044679-1.6698428.2433185-.8425206.2441028-.9826228.0100139-1.7878614-.6566532-2.2588075-3.0054252-3.2764371-5.1075029-2.212882l-.8124519.4110627-.837264-.5151716c-1.6101652-.9907471-4.473974-1.96108051-6.3205111-2.14155924-.5059537-.04945042-1.143803-.1235464-1.4174535-.16465815l-.4975382-.07474783.2136595-1.06953332c.1175125-.5882423.3623778-1.7491883.5441475-2.57987956.181767-.83069153.4095191-1.95749071.5061138-2.50399817.1396137-.78991765.2348596-.99365031.4645331-.99365031.1589005 0 1.2955101.21462853 2.5257988.4769522 1.2302915.26232367 2.2622022.47695193 2.293134.47695193.0309345 0 .1003234.23497925.154203.52217616.1363137.72661143.4902897 1.17780487 1.2134714 1.54674469 1.7356128.8854428 3.6891485-.29431302 3.6891485-2.22790474 0-2.3956262-2.9538443-3.44186625-4.4550019-1.57794377-.2901205.36022881-.4356746.42625561-.7154284.32453216-.1931649-.07023833-1.5202546-.3669593-2.9490951-.65938053-1.8923676-.38728585-2.6686067-.48706487-2.8582979-.36740978-.2896185.1826864-.2522224.047706-1.0501419 3.79055007-.9490696 4.45187338-1.0064011 4.70400786-1.0882029 4.78580828-.0432388.04324046-.729551.14596475-1.5251367.22827402-2.413687.24971784-5.06621906 1.10194849-6.8544721 2.20227189l-.8268564.5087695-.81204644-.4046587c-2.11972653-1.0563058-4.47243958-.0382468-5.1287215 2.2192841-.23408885.8052386-.23330375.9453408.0100166 1.7878614.20427624.7073278.44063816 1.0851336 1.04467744 1.6698428.76105187.736691.78066878.7792177.78066878 1.6923265 0 4.172347 4.28816886 8.1540991 10.01599352 9.3002929 1.8975637.3797217 2.0263168.3894072 4.4515526.3349143 1.5849893-.0356103 2.7274992-.1508298 3.6566327-.3687526zm-6.6864685-3.0300366c-1.3154638-.2961613-2.8032079-.9569232-3.2391341-1.4386156-.34760429-.384099-.198986-.9659493.246724-.9659493.1736296 0 .5801788.1805458.9034441.4012095 2.1828306 1.4900284 7.1085991 1.484628 9.2987021-.0101767.7054363-.4814861 1.2827246-.468194 1.3538857.0311679.0334854.234998-.1164569.4687666-.4771278.7438635-1.7511846 1.3356924-5.2646974 1.8738181-8.086494 1.2385197v-.000019zm-4.01196195-5.9075609c-.81902983-.4443886-1.22403999-1.1532958-1.22477787-2.143771-.000787-1.135302.52653614-1.8699603 1.59778946-2.2257735.76240766-.253232.85344696-.2532238 1.51689516.0001492 1.785415.6818561 2.1507834 2.909296.6724678 4.0996229-.7705198.6204159-1.7299516.7214286-2.56237455.2697724zm11.09588945.0732995c-.7590038-.3947507-1.1832989-.8746601-1.3628596-1.5414995-.3321829-1.2336253.2931784-2.4377233 1.5067529-2.9011953.6634485-.253373.754488-.2533812 1.5168976-.0001492 1.0712525.3558132 1.5986343 1.0904715 1.5977903 2.2257735-.0008141 1.0085002-.4138259 1.7116813-1.2587076 2.1427072-.7599699.3877084-1.3548626.4098285-1.9998736.0743633z" fill="#FDFDFD"></path>
											</g>
										</svg>
									</span>
									Reddit
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_tumblr">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
												<path d="M28.486325 59.969298c-6.636404-.569063-11.56302-2.326956-16.321973-5.823932C4.443764 48.472116 0 39.646792 0 29.986934 0 15.11156 10.506778 2.798388 25.274412.36718c6.028107-.992411 12.703853.049265 18.28794 2.85363 13.576275 6.818095 19.7813 22.541053 14.64267 37.103159-3.527955 9.997705-12.789708 17.617785-23.391072 19.244938-2.085625.320112-5.065149.508645-6.327625.400391z" fill="#35465C" fill-rule="nonzero" class="style-scope yt-icon"></path>
												<path d="M25.96539 14c0 6.948267-5.96539 8.206933-5.96539 8.206933v4.750934h4.023219v11.788089C24.023219 42.70791 27.676687 46 32.121159 46c4.444828 0 6.882486-1.768533 6.882486-1.768533v-5.240178s-1.341547 1.7664-4.08147 1.7664c-2.739568 0-3.924832-2.132622-3.924832-3.778133v-9.992178h7.00325v-5.025422h-7.00325V14H25.96539z" fill="#FFF" class="style-scope yt-icon"></path>
											</g>
										</svg>
									</span>
									Tumblr
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_pinterest">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#BD081C" fill-rule="nonzero" class="style-scope yt-icon"></path>
												<path d="M30 14c-8.8359111 0-16 7.1714944-16 16.0165392 0 6.5927634 3.9804444 12.254788 9.6650667 14.7135047-.0408889-1.1165307-.0010667-2.448039.2812444-3.6553302.3104-1.3030344 2.0682667-8.7589113 2.0682667-8.7589113s-.5134222-1.02755-.5134222-2.5444942c0-2.3797018 1.3806222-4.160741 3.0965333-4.160741 1.4609778 0 2.1671111 1.1005142 2.1671111 2.41565 0 1.4692506-.9365333 3.6667197-1.4200889 5.7022439-.4003555 1.7048716.8576 3.0968868 2.5372445 3.0968868 3.04 0 5.0876444-3.9112388 5.0876444-8.547849 0-3.5211471-2.3669333-6.159605-6.6794667-6.159605-4.8693333 0-7.9072 3.6364662-7.9072 7.6993283 0 1.3998456.4138667 2.3889558 1.0613334 3.1524109.2968889.3512961.3370666.4929535.2286222.897638-.0782222.2939925-.2510222 1.0058387-.3253333 1.2902212-.1063112.4068201-.4373334.5495453-.8046223.4000576-2.2421333-.9150783-3.2888889-3.3748628-3.2888889-6.1393174 0-4.5672052 3.8474667-10.042726 11.4766223-10.042726 6.1326222 0 10.1667555 4.4422761 10.1667555 9.2070185 0 6.3090928-3.5029333 11.0179553-8.6641778 11.0179553-1.7340444 0-3.3660444-.9385692-3.9217777-2.0020674 0 0-.9354667 3.7001765-1.1306667 4.4177174-.3370667 1.2211722-.9863111 2.4412765-1.5879111 3.4019129 1.3984.4000576 2.8768.6150352 4.4071111.6150352 8.8359111 0 16-7.1714944 16-16.0165392S38.8359111 14 30 14" fill="#FFF" class="style-scope yt-icon"></path>
											</g>
										</svg>
									</span>
									Pinterest
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_linkedin">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#0077B5" fill-rule="nonzero" class="style-scope yt-icon"></path>
												<g fill="#FFF" class="style-scope yt-icon">
													<path d="M17.88024691 22.0816337c2.14182716 0 3.87817284-1.58346229 3.87817284-3.53891365C21.75841975 16.58553851 20.02207407 15 17.88024691 15 15.73634568 15 14 16.58553851 14 18.54272005c0 1.95545136 1.73634568 3.53891365 3.88024691 3.53891365M14.88888889 44.8468474h6.95851852V24.77777778h-6.95851852zM31.6137778 33.6848316c0-2.3014877 1.0888889-4.552108 3.6925432-4.552108 2.6036543 0 3.2438518 2.2506203 3.2438518 4.4970883v10.960701h6.9274074V33.1816948c0-7.9263084-4.6853333-9.29280591-7.5676049-9.29280591-2.8798518 0-4.4682469.9740923-6.2961975 3.33440621v-2.70185178h-6.9471111V44.5905129h6.9471111V33.6848316z" class="style-scope yt-icon"></path>
												</g>
											</g>
										</svg>
									</span>
									LinkedIn
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_mix">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill="none" fill-rule="evenodd" class="style-scope yt-icon">
												<g fill-rule="nonzero" class="style-scope yt-icon">
													<circle fill="#FF8226" cx="30" cy="30" r="30" class="style-scope yt-icon"></circle>
													<g transform="translate(16.000000, 16.000000)" fill="#FFFFFF" class="style-scope yt-icon">
														<path d="M0,15.2225809 L0,25.1910701 C0,26.7287731 1.26040471,27.9752991 2.81528027,27.9752991 C4.37015582,27.9752991 5.63056053,26.7287731 5.63056053,25.1910701 L5.63056053,9.9538317 C5.46855813,12.8905403 3.00985687,15.2225809 0,15.2225809" opacity="0.299999982" class="style-scope yt-icon"></path>
														<path d="M27.7743298,0 C21.648207,0 16.6819432,4.91150508 16.6819432,10.9702166 L16.6819432,14.3849279 C16.6819432,12.8472249 17.942565,11.6006989 19.4974406,11.6006989 C21.052099,11.6006989 22.3125037,12.8472249 22.3125037,14.3849279 L22.3125037,15.8020911 C22.3125037,17.339794 23.5731256,18.5863201 25.1280011,18.5863201 C26.6828767,18.5863201 27.9432814,17.339794 27.9432814,15.8020911 L27.9432814,0.00218765537 C27.8870366,0.00131259322 27.8307918,0 27.7743298,0" opacity="0.299999982" class="style-scope yt-icon"></path>
														<path d="M0,15.2860232 C3.00985687,15.2860232 5.46855813,12.9539825 5.63056053,10.017274 L5.63056053,7.4054322 C5.63056053,7.33367711 5.63425227,7.26279707 5.63968131,7.19257334 C5.74956497,5.75418993 6.96349714,4.62098444 8.4458408,4.62098444 C10.0007164,4.62098444 11.2611211,5.86751048 11.2611211,7.4054322 L11.2611211,18.2990809 C11.2615554,19.8363463 12.5217429,21.0826536 14.0764013,21.0826536 C15.6310597,21.0826536 16.8912473,19.8365651 16.8918988,18.2992997 L16.8918988,10.9702166 C16.8918988,4.91150508 21.8579454,0 27.9840683,0 L0,0 L0,15.2860232 Z" opacity="0.699999988" class="style-scope yt-icon"></path>
														<path d="M0,15.2225809 L0,25.1910701 C0,26.7287731 1.26040471,27.9752991 2.81528027,27.9752991 C4.37015582,27.9752991 5.63056053,26.7287731 5.63056053,25.1910701 L5.63056053,9.9538317 C5.46855813,12.8905403 3.00985687,15.2225809 0,15.2225809" opacity="0.5" class="style-scope yt-icon"></path>
														<path d="M27.7743298,0 C21.648207,0 16.6819432,4.91150508 16.6819432,10.9702166 L16.6819432,14.3849279 C16.6819432,12.8472249 17.942565,11.6006989 19.4974406,11.6006989 C21.052099,11.6006989 22.3125037,12.8472249 22.3125037,14.3849279 L22.3125037,15.8020911 C22.3125037,17.339794 23.5731256,18.5863201 25.1280011,18.5863201 C26.6828767,18.5863201 27.9432814,17.339794 27.9432814,15.8020911 L27.9432814,0.00218765537 C27.8870366,0.00131259322 27.8307918,0 27.7743298,0" opacity="0.5" class="style-scope yt-icon"></path>
														<path d="M0,15.2860232 C3.00985687,15.2860232 5.46855813,12.9539825 5.63056053,10.017274 L5.63056053,7.4054322 C5.63056053,7.33367711 5.63425227,7.26279707 5.63968131,7.19257334 C5.74956497,5.75418993 6.96349714,4.62098444 8.4458408,4.62098444 C10.0007164,4.62098444 11.2611211,5.86751048 11.2611211,7.4054322 L11.2611211,18.2990809 C11.2615554,19.8363463 12.5217429,21.0826536 14.0764013,21.0826536 C15.6310597,21.0826536 16.8912473,19.8365651 16.8918988,18.2992997 L16.8918988,10.9702166 C16.8918988,4.91150508 21.8579454,0 27.9840683,0 L0,0 L0,15.2860232 Z" class="style-scope yt-icon"></path>
													</g>
												</g>
											</g>
										</svg>
									</span>
									Mix
								</div>
								<div class="bl_col_2 bl_text_center">
									<span class="bl_icon" id="bl_email">
										<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid meet" focusable="false">
											<g fill-rule="nonzero" fill="none" class="style-scope yt-icon">
												<path d="M28.4863253 59.9692983c-6.6364044-.569063-11.5630204-2.3269561-16.3219736-5.8239327C4.44376366 48.4721168 3e-7 39.6467924 3e-7 29.9869344c0-14.8753747 10.506778-27.18854591 25.2744118-29.61975392 6.0281072-.9924119 12.7038532.04926445 18.2879399 2.85362966C57.1386273 10.0389054 63.3436516 25.7618627 58.2050229 40.3239688 54.677067 50.3216743 45.4153135 57.9417536 34.81395 59.5689067c-2.0856252.3201125-5.0651487.5086456-6.3276247.4003916z" fill="#888" class="style-scope yt-icon"></path>
												<path d="M40.531502 19.160814h-22c-1.74 0-2.986 1.2375-3 3v16c0 1.7625 1.26 3 3 3h22c1.74 0 3-1.2375 3-3v-16c0-1.7625-1.26-3-3-3zm0 6l-11 7-11-7v-3l11 7 11-7v3z" fill="#FFF" class="style-scope yt-icon"></path>
											</g>
										</svg>
									</span>
									Email
								</div>
								<div class="bl_col_12 bl_input">
									<input type="text" class="bl_url" value="" readonly>
									<span id="bl_copy"></span>
								</div>
							</div>
						</div>
						<div class="bl_copied">
							Link Copied!
						</div>
					</div>
				</div>
			`;
			$('body').append($ShareElement);
		},
		LinkShare: function()
		{
			// Popup Properties
			var left = (screen.width/2)-(586/2);
			var top = (screen.height/2)-(368/2);
			var window_option = 'menubar=no,toolbar=no,resizable=no,scrollbars=no,height=368,location=np,width=585,top='+top+',left='+left;
			// Facebook App ID
			var $facebookAppId = ( this.settings.facebookAppId != null ) ? 'app_id='+this.settings.facebookAppId+'&' : '';
			var $twitterHandle = ( this.settings.twitterHandle != null ) ? '&via='+this.settings.twitterHandle : '';

			//URLS
			var $facebook_link = `https://www.facebook.com/sharer/sharer.php?${$facebookAppId}display=popup&u=${$currentUrl}`;
			var $twitter_link = `https://twitter.com/intent/tweet?url=${$currentUrl}&text=${share_text}${$twitterHandle}`;
			var $google_link = `https://plus.google.com/share?url=${$currentUrl}`;
			var $blogger_link = `https://www.blogger.com/blog-this.g?n=${share_title}&b=${share_text}...<br>Source: <a href='${$currentUrl}'>${$currentUrl}</a>&eurl=${$currentUrl}`;
			var $reddit_link = `https://www.reddit.com/submit?url=${$currentUrl}&title=${share_title}`;
			var $tumblr_link = `https://www.tumblr.com/widgets/share/tool/preview?shareSource=legacy&canonicalUrl=&url=${$currentUrl}&caption=${share_title}`;
			var $pinterest_link = `https://www.pinterest.com/pin/create/button/?url=${$currentUrl}&description=${share_title}`;
			var $linkedin_link = `https://www.linkedin.com/shareArticle?url=${$currentUrl}&summary=${share_text}`;
			var $mix_link = `https://mix.com/add?url=${$currentUrl}`;
			var $email_link = `mailto:?Subject=${share_title}&Body=${share_text} ${$currentUrl}`;

			// Facebok Share
			$('#bl_facebook').on('click', function()
			{
				window.open($facebook_link, '', window_option);
			});
			// Twitter Share
			$('#bl_twitter').on('click', function()
			{
				window.open($twitter_link, '', window_option);
			});
			// Google plus share
			$('#bl_google').on('click', function()
			{
				window.open($google_link, '', window_option);
			});
			// Blogger Share
			$('#bl_blogger').on('click', function()
			{
				window.open($blogger_link, '', window_option);
			});
			// Reddit Share
			$('#bl_reddit').on('click', function()
			{
				window.open($reddit_link, '', window_option);
			});
			// Tumblr Share
			$('#bl_tumblr').on('click', function()
			{
				window.open($tumblr_link, '', window_option);
			});
			// Pinterest Share
			$('#bl_pinterest').on('click', function()
			{
				window.open($pinterest_link, '', window_option);
			});
			// Linkedin Share
			$('#bl_linkedin').on('click', function()
			{
				window.open($linkedin_link, '', window_option);
			});
			// Mix Share
			$('#bl_mix').on('click', function()
			{
				window.open($mix_link, '', window_option);
			});
			// Email Share
			$('#bl_email').on('click', function()
			{
				window.open($email_link);
			});
		}
	} );

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function( options ) {
		return this.each( function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" +
					pluginName, new Plugin( this, options ) );
			}
		} );
	};
} )( jQuery, window, document );
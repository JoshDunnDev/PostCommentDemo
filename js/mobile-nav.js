/* ----- Shows/Hides Navigation On Click ----- */
$('.mobile-nav').click(function(event) {
	event.preventDefault();
	$('.navigation').slideToggle();
});
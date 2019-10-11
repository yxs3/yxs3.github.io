function rem(){
	var deviceWidth = document.documentElement.clientWidth;
	if(deviceWidth > 1024) deviceWidth = 1024;
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
	var $html = document.getElementsByTagName('html');
    $html[0].style.maxWidth = '1024px';
    $html[0].style.margin = '0 auto';
}
rem();
window.addEventListener("resize", function() {
  rem();
}, false);




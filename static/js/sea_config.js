//seajs配置
seajs.config({
	base: '../static/js/',
	//别名
	alias: {
		'jquery':'jquery-1.11.3.min',
		'vue':'vue.min',
		'date': 'rolldate/rolldate', //日历
		'socket':'socket.io',
		'html2canvas': 'html2canvas',
		'swiper':'Swiper 3.3.1',
	},
	map: [
		[ /^(.*\.(?:css|js))(.*)$/i, '$1?v=3' ]
	]
})

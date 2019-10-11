/*!
 * verify.js v1.1.8
 * By 雾空 https://github.com/weijhfly/verify
 * Time:2018/1/30
*/
;(function(){
	'use strict';
	
	var rules = {
		isEmpty:function(value){
			return value === '';
		},
		minLength:function(value,length){
			return value.length >= length;
		},
		maxLength:function(value,length){
			return value.length <= length;
		},
		length:function(value,min,max){
			return value.length >= min && value.length <= max;
		},
		isMobile:function(value,reg){
			//由于号段的增加，暂时使用宽泛的验证，或者自定义
			var regular = reg || /(^1[3-9][0-9]{9}$)/;
			return regular.test(value);
		},
		custom:function(value,rule){
			return rule.test(value);
		}
	};

	var Verify = function(config, items){
		
		if(!(this instanceof Verify)){
			return new Verify(config, items);
		}
		if(!config || !items){
			return false;
		}
		
		var _this = this;
		_this.check = true;
		_this.l = [];
		_this.config = config;
		_this.items = items;
		
		_this.exec();
	};

	Verify.prototype = {
		constructor:Verify,
		rules:rules,
		exec:function(){
			var _this = this,
				config = _this.config,
				items = _this.items,
				rules = _this.rules,
				isSingle = config.type == 'single',
				arr = [],
				lens = items.length,
				i = 0,
				isTrim = config.trim !== false,
				doc = window.document,
				isError = false;

			outer:
			for(i=0; i<lens; i++){
				if(!items[i]){continue;}
				
				var l = items[i],
					val = l.value,
					index,
					msg,
					len,
					rule;
					
				if(isTrim && l.trim !== false && typeof val === 'string'){
					try{
						val = val.trim();
					}catch(e){
						val = val.replace(/^\s+|\s+$/gm,'');
					}
				}

				if(l.isEmpty && rules.isEmpty(val)){
					arr[i] = l.isEmpty;
					if(isSingle){
						break;
					}else{
						setError();
						continue;
					}
				}
				if(l.minLength){
					index = l.minLength.lastIndexOf('&');
					msg = l.minLength.substring(0,index);
					len = l.minLength.substring(index+1);
						
					if(!rules.minLength(val,len)){
						arr[i] = msg;
						if(isSingle){
							break;
						}else{
							setError();
							continue;
						}
					}
				}
				if(l.maxLength){
					index = l.maxLength.lastIndexOf('&');
					msg = l.maxLength.substring(0,index);
					len = l.maxLength.substring(index+1);
						
					if(!rules.maxLength(val,len)){
						arr[i] = msg;
						if(isSingle){
							break;
						}else{
							setError();
							continue;
						}
					}
				}
				if(l.length){
					index = l.length.lastIndexOf('&');
					msg = l.length.substring(0,index);
					len = l.length.substring(index+1);
					var	min = len.match(/^\d+/),
						max = len.match(/\d+$/);
						
					if(!rules.length(val,min,max)){
						arr[i] = msg;
						if(isSingle){
							break;
						}else{
							setError();
							continue;
						}
					}
				}
				if(l.isMobile){
					if(typeof l.isMobile == 'string' && !rules.isMobile(val)){
						arr[i] = l.isMobile;
						if(isSingle){
							break;
						}else{
							setError();
							continue;
						}
					}else if(typeof l.isMobile == 'object'){
						rule = l.isMobile[0];
						msg = l.isMobile[1];
						if(!rules.isMobile(val,rule)){
							arr[i] = msg;
							if(isSingle){
								break;
							}else{
								setError();
								continue;
							}
						}
					}
				}
				if(l.custom){
					if(!(l.custom[0] instanceof Array)){l.custom = [[l.custom[0],l.custom[1]]];}
					len = l.custom.length;

					inter:
					for(var j=0; j<len; j++){
							rule = l.custom[j][0];
							msg = l.custom[j][1];

						if(typeof rule  === 'string'){
							if(!evaluate(rule.replace(/&/g,"'"+val+"'"))){
								arr[i] = msg;
								if(isSingle){
									break outer;
								}else{
									setError();
									continue outer;
								}
							}
						}else if(typeof rule  === 'object' && !rules.custom(val,rule)){
							arr[i] = msg;
							if(isSingle){
								break outer;
							}else{
								setError();
								continue outer;
							}
						}else if(typeof rule  === 'boolean' && !rule){
							arr[i] = msg;
							if(isSingle){
								break outer;
							}else{
								setError();
								continue outer;
							}
						}
					} 
				}
				
			}
			function evaluate(str){
				var fn = Function;
				return new fn('return ' + str)();
			}
			function setError(){
				if(config.data){
					config.data[l.model] = arr[i];
				}else{
					if(typeof l.el == 'string'){
						doc.querySelector(l.el).innerHTML = arr[i];
					}else{
						l.el.text(arr[i]);
					}
				}
				isError = true;
			}
			if(isSingle){
				if(arr.length !== 0){_this.check = false;}
				_this.l = arr.length === 1? arr:[arr.toString().replace(/^,*/,'')];
			}else{
				if(isError){_this.check = false;}
				_this.l = arr;
			}
		}
	};
	
	if (typeof define === 'function' && define.amd) {
		define(function(){return Verify;});
	}else if (typeof exports === "object") {
		module.exports = Verify;
	}else {
		window.verify = Verify;
	}
})();
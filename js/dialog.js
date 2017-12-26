function Dialog(){
	this.oBox = null;
	this.oMark = null;
	this.oClose = null;
	this.title = null;
	this.timer = null; // 定时器
	this.clientW = document.documentElement.clientWidth;
	this.clientH = document.documentElement.clientHeight;
	// 默认参数
	this.settings = {
		time: 0, // 倒计时，默认不进行倒计时
		title: '标题',
		content: '内容',
		drag: false,
		width: 250,
		height: 150,
		mark: true
	};
}

Dialog.prototype.init = function(opt){
	extend( this.settings , opt ); // 配置参数覆盖默认参数
	
	this.create();
	this.closeFn();
	// 只有drag为真，才执行下面这个拖拽函数
	if (this.settings.drag) {
		this.dragFn();
	}
	if (this.settings.time) {
		this.timerFn();
	}
}


Dialog.prototype.create = function (){
	// 窗体
	this.oBox = document.createElement('div');
	this.oBox.className = 'box';
	this.oBox.style.width = this.settings.width + 'px';
	this.oBox.style.height = this.settings.height + 'px';
	this.oBox.style.left = (this.clientW - this.settings.width) / 2 + 'px';
	this.oBox.style.top = (this.clientH - this.settings.height) / 2 + 'px';
	this.oBox.innerHTML = '<div class="title">'+
		'<span class="close">X</span>'+
		'<h3>'+ this.settings.title +'</h3>'+
	'</div>'+
	'<div class="content">'+ this.settings.content +'</div>';
	document.body.appendChild(this.oBox);
	this.oClose = this.oBox.getElementsByClassName('close')[0];
	
	
	// 遮罩，判断是否要创建
	if (this.settings.mark) {
		this.oMark = document.createElement('div');
		this.oMark.className = 'mark';
		this.oMark.style.width = this.clientW + 'px';
		this.oMark.style.height = this.clientH + 'px';
		document.body.appendChild(this.oMark);
	}
	
}

// 删除
Dialog.prototype.closeFn = function (){
	var _this = this;
	this.oClose.onclick = function (){
		document.body.removeChild(_this.oBox);
		if (_this.settings.mark) {
			document.body.removeChild(_this.oMark);
		}
		clearTimeout(_this.timer);
	}
}

// 拖拽
Dialog.prototype.dragFn = function (){
	var _this = this;
	this.title = this.oBox.getElementsByTagName('h3')[0];
	this.title.onmousedown = function (ev){
		var ev = ev || event;
		var disX = ev.clientX - _this.oBox.offsetLeft;
		var disY = ev.clientY - _this.oBox.offsetTop;
		
		document.onmousemove = function (ev){
			var ev = ev || event;
			var X = ev.clientX - disX;
			var Y = ev.clientY - disY;
			if (X < 0) {
				X = 0;
			}else if(X > _this.clientW - _this.settings.width){
				X = _this.clientW - _this.settings.width
			}
			if (Y < 0) {
				Y = 0;
			}else if(Y > _this.clientH - _this.settings.height){
				Y = _this.clientH - _this.settings.height
			}
			_this.oBox.style.left = X + 'px';
			_this.oBox.style.top = Y + 'px';
		}
		
		document.onmouseup = function (){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		
		return false;
	}
}


// 倒计时
Dialog.prototype.timerFn = function (){
	var _this = this;
	this.timer = setTimeout(function (){
		document.body.removeChild(_this.oBox);
		if (_this.settings.mark) {
			document.body.removeChild(_this.oMark);
		}
	}, this.settings.time * 1000);
}

function ThinkInterrupt(){
	this.isInterrupting = false;
	this.timeoutCount = 0;
	this.requestInterrupt = (cb)=>{
		if(this.isInterrupting)
			return;
		
		if(typeof cb == 'function'){
			this.timeoutCount = 0;
			var timerCallback = ()=>{
				if((this.isInterrupting == false || this.timeoutCount > 10) && cb() == true){
					this.timeoutCount = 0;
					this.isInterrupting = false;
					return;
				}
				this.timeoutCount ++;
				setTimeout(timerCallback, 500);
			}

			this.isInterrupting = true;
			setTimeout(timerCallback, 500);
		} else {
			this.isInterrupting = true;
		}
	}
	this.hasInterrupt = ()=>{
		if(this.isInterrupting){
			this.isInterrupting = false;
			return true;
		}
		
		return false;
	}
	return this;
}
module.exports = ThinkInterrupt;
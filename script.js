Vue.component('page-title', {
	props: ['title'],
	template: '<h1 class="page-title">{{title}}</h1>'
});

Vue.component('set-counter', {
	props: ['value'],
	data: function () {
		return {
			time: this.value
		}
	},
	methods: {
		increaseTime: function () {
			this.time < 60 ? this.time++ : this.time;
		},
		decreaseTime: function () {
			this.time > 1 ? this.time-- : this.time;
		},
	},
	template: `<div>
			<h2 class="controls-title"><slot></slot></h2>
			<button class="controls-btn" @click="decreaseTime" @click="$emit('decrease-time')">-</button>
			<input class="controls-input" type="text" :value="time" disabled>
			<button class="controls-btn" @click="increaseTime" @click="$emit('increase-time')">+</button>
    </div>`
})

Vue.component('clock-display', {
	props: ['session-length', 'pause-length'],
	data: function () {
		return {
			counter: 0,
			seconds: '00',
			period: 'session',
			secTimer: 0
		}
	},
	computed: {
		session: function () {
			return this.sessionLength - this.counter;
		},
		pause: function () {
			return this.pauseLength - this.counter;
		},
		display: function () {
			return this.period == 'session' ? this.session : this.pause;
		}
	},
	methods: {
		plus: function () {
			this.counter++;
		},
		togglePeriod: function () {
			this.period = this.period == 'session' ? 'pause' : 'session';
			this.plus();
		},
		startSession: function () {
			var that = this;

			var secTimer = setInterval(function () {
				that.seconds--;
				if (that.seconds < 0) {
					that.counter++;
					that.seconds = 59;
				}
				if (that.display < 0) {
					that.counter = 0;
					that.togglePeriod();
				}
			}, 100);

			this.secTimer = secTimer;
		},
		stopCounting: function () {
			clearInterval(this.secTimer);
		},
		restartCounting: function () {
			this.stopCounting();
			this.counter = 0;
			this.seconds = '00';
			this.period = 'session';
		}
	},
	template: `<div>
			<h2 class="display-title">{{period}}</h2>
			<div class="display-digits">
			<span>{{display}}</span>:<span>{{seconds}}</span>
			</div>
			<button class="display-btn" @click="startSession">Start</button>
			<button class="display-btn" @click="stopCounting">Pause</button>
			<button class="display-btn" @click="restartCounting">Restart</button>
		</div>`
})

var vm = new Vue({
	el: '#root',
	data: {
		title: 'Pomodoro Clock',
		session: 3,
		pause: 2
	}
})
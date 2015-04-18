import Vue from 'vue';
import APIService from 'services/api-service';
import template from 'templates/home.html!';

export default Vue.extend({
	template: template,
    data: function() { return {
        foo: 'bar',
		loading: true
    }},
    created: function() {
        console.log("Home created");
		let self = this;
		setTimeout(() => {
			self.loading = false;
		}, 5000);
    },
    destroyed: function() {
        console.log("Home destroyed");
    }
});


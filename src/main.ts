import Vue from "vue";
import App from "./app.vue";
import Field from "buefy/src/components/field";
import Input from "buefy/src/components/input";
import Button from "buefy/src/components/button";
import Select from "buefy/src/components/select";
import Notification from "buefy/src/components/notification";
import "buefy/dist/buefy.css";
import "./vee-validate";

Vue.use(Field);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Notification);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

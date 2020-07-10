<template>
  <div id="app">
    <section class="hero is-primary">
      <div class="hero-body">
        <div style="margin: 0 10px">
          <h1 class="title">
            S/MIME certificate creator
          </h1>
          <h2 class="subtitle">
            Create your own signed S/MIME certificate for secure e-mail
            communication.
          </h2>
        </div>
      </div>
    </section>

    <CertificateCreator />

    <footer class="footer" style="margin-top: 30px;">
      <div class="content has-text-centered">
        <p>
          <strong>SMIMEr</strong> by Wolfgang Flohr-Hochbichler. The
          <a href="https://github.com/cyberflohr/smimer">source code</a> is
          licensed under
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CertificateForm from "./components/certificate-form.vue";

export default Vue.extend({
  name: "App",
  components: {
    CertificateCreator: CertificateForm
  },
  errorCaptured(err, vm, info) {
    console.error("error captured", err, vm, info);
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.hero {
  margin-bottom: 25px;
}
</style>

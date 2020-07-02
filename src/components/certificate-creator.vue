<template>
  <section id="user-information" style="margin: 0 35px;">
    <b-notification
      v-if="errorMessage"
      type="is-danger"
      aria-close-label="Close notification"
      role="alert"
    >
      {{ errorMessage }}
    </b-notification>
    <div class="rows">
      <ValidationObserver ref="observer" v-slot="{ passes }">
        <div class="columns">
          <b-field label="Organization" class="column">
            <b-input name="organization" v-model="organization"></b-input>
          </b-field>

          <b-field label="Organization unit" class="column">
            <b-input
              name="organization-unit"
              v-model="organizationUnit"
            ></b-input>
          </b-field>
        </div>
        <div class="columns">
          <b-field label="Locality" class="column">
            <b-input name="locality" v-model="locality"></b-input>
          </b-field>

          <b-field label="Country" class="column">
            <b-select
              name="country"
              placeholder="Select a country"
              v-model="countryCode"
            >
              <option
                v-for="option in countries"
                :value="option.Code"
                :key="option.Name"
              >
                {{ option.Name }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="columns">
          <b-field label="E-Mail*" class="column">
            <ValidationInput
              rules="required|email"
              type="email"
              name="email"
              v-model="email"
            ></ValidationInput>
          </b-field>

          <b-field label="Validity period" class="column">
            <b-select placeholder="Select a period" v-model="validityPeriod">
              <option value="1">1 year</option>
              <option value="2">2 year</option>
              <option value="3">3 year</option>
              <option value="4">4 year</option>
              <option value="5">5 year</option>
            </b-select>
          </b-field>
        </div>
        <div class="columns">
          <b-field label="Password" class="column">
            <ValidationInput
              rules="required|min:8"
              type="password"
              vid="password"
              name="password"
              v-model="password"
            ></ValidationInput>
          </b-field>

          <b-field label="Confirm Password" class="column">
            <ValidationInput
              rules="required|min:8|confirmed:password"
              type="password"
              name="confirmation"
              v-model="confirmation"
            ></ValidationInput>
          </b-field>
        </div>

        <div>
          <strong>Security notice:</strong> All tasks (e.g. create key pair,
          certificate) are processed locally in your web browser. No information
          is sent to the internet. Please close the browser tab after you
          created your certificate.
        </div>

        <div
          class="buttons"
          style="margin-top: 30px; justify-content: flex-end;"
        >
          <button
            id="btn-create-certificate"
            class="button is-primary"
            @click="passes(createKeysAndCertificate)"
          >
            Download certificate
          </button>
        </div>
      </ValidationObserver>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import {
  createRsaKeyPair,
  createCACertificate,
  createSMIMECertificate,
  createPkcs12
} from "@/services/certificate.service";
import download from "downloadjs";
import countries from "@/countries";
import { ValidationObserver } from "vee-validate";
import ValidationInput from "./validation-input.vue";
import { pki } from "node-forge";

export default Vue.extend({
  name: "CertificateCreator",
  components: {
    ValidationObserver,
    ValidationInput
  },
  props: {
    msg: String
  },
  data() {
    return {
      organization: "",
      organizationUnit: "",
      locality: "",
      email: "",
      countryCode: navigator.language.substr(navigator.language.length - 2),
      validityPeriod: 1,
      password: "",
      confirmation: "",
      errorMessage: ""
    };
  },
  methods: {
    async createKeysAndCertificate() {
      let step = "Creating CA key pair";
      try {
        const signerKeyPair = await createRsaKeyPair();

        step = "Creating CA certificate";
        const caCertificate = await createCACertificate(
          signerKeyPair,
          signerKeyPair,
          this.validityPeriod * 365,
          this.email,
          this.countryCode,
          this.locality,
          this.organizationUnit,
          this.organization
        );

        step = "Creating user key pair";
        const certKeyPair = await createRsaKeyPair();

        step = "Creating user certificate";
        const certificate = await createSMIMECertificate(
          certKeyPair,
          signerKeyPair,
          caCertificate,
          this.validityPeriod * 365,
          this.email,
          this.countryCode,
          this.locality,
          this.organizationUnit,
          this.organization
        );

        step = "Prepare download";
        this.download(certKeyPair.privateKey, certificate, caCertificate);
      } catch (ex) {
        this.errorMessage = `${step} failed. ${ex}`;
      }
    },
    download(
      privateKey: pki.PrivateKey,
      certificate: pki.Certificate,
      caCertificate: pki.Certificate
    ) {
      download(
        createPkcs12(privateKey, certificate, caCertificate, this.password),
        this.email + ".p12"
      );
    }
  },
  computed: {
    countries() {
      return countries;
    }
  }
});
</script>

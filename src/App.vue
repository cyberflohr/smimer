<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  ShieldCheck, 
  Mail, 
  Settings, 
  Download, 
  Trash2, 
  ArrowRight,
  Fingerprint,
  Users,
  Building2,
  Upload,
  FileKey,
  Database,
  Cpu,
  Archive,
  FileCheck,
  AlertTriangle
} from 'lucide-vue-next'
import { pki } from 'node-forge'
import { 
  createRsaKeyPair, 
  createCACertificate, 
  createSMIMECertificate, 
  createPkcs12, 
  downloadFile,
  exportCAPkcs12,
  importCAPkcs12,
  createCertificateChainZip
} from '@/services/certificate.service'
import countries from '@/countries'
import { cn } from '@/lib/utils'

// --- STATE ---
const step = ref<'CA' | 'SMIME'>('CA')
const caCert = ref<pki.Certificate | null>(null)
const caKey = ref<pki.rsa.KeyPair | null>(null)
const lastUserCert = ref<pki.Certificate | null>(null)
const isBusy = ref(false)
const errorMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const passwordModal = reactive({
  show: false,
  title: '',
  description: '',
  type: 'export' as 'export' | 'import',
  password: '',
  confirmPassword: '',
  pendingFile: null as File | null
})
const confirmModal = reactive({
  show: false,
  title: '',
  description: '',
  onConfirm: () => {}
})

// CA Form State
const caForm = reactive({
  commonName: 'Private Root CA',
  organization: 'My Organization',
  organizationalUnit: 'Security Operations',
  locality: 'Berlin',
  country: 'DE',
  validityYears: 10
})

// S/MIME Form State
const smimeForm = reactive({
  email: '',
  givenName: '',
  surname: '',
  password: '',
  confirmPassword: '',
  validityYears: 1
})

// --- ACTIONS ---

async function generateCA() {
  errorMessage.value = ''
  isBusy.value = true
  try {
    const keyPair = await createRsaKeyPair(4096)
    const cert = await createCACertificate(keyPair, {
      ...caForm
    })
    
    caCert.value = cert
    caKey.value = keyPair
    step.value = 'SMIME'
  } catch (err: any) {
    errorMessage.value = `CA Creation failed: ${err.message}`
  } finally {
    isBusy.value = false
  }
}

function handleExportCA() {
  if (!caCert.value || !caKey.value) return
  passwordModal.title = "Encrypt Authority Backup"
  passwordModal.description = "Create a password to protect your CA private key and certificate bundle."
  passwordModal.type = 'export'
  passwordModal.password = ''
  passwordModal.confirmPassword = ''
  passwordModal.show = true
}

function executeExport(password: string) {
  if (!caCert.value || !caKey.value) return
  try {
    const caP12 = exportCAPkcs12(caCert.value, caKey.value, password)
    const filename = caCert.value.subject.getField('commonName')?.value?.toString().replace(/\s+/g, '_') || 'CA'
    downloadFile(caP12, `${filename}_backup.p12`)
    errorMessage.value = ""
    passwordModal.show = false
  } catch (err: any) {
    errorMessage.value = `Failed to export CA: ${err.message}`
  }
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImportCA(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  
  passwordModal.pendingFile = target.files[0]
  passwordModal.title = "Unlock Authority Backup"
  passwordModal.description = "Enter the password used to protect this .p12 backup file."
  passwordModal.type = 'import'
  passwordModal.password = ''
  passwordModal.show = true
  
  // Reset input so the same file can be picked again if needed
  target.value = ''
}

function executeImport(password: string) {
  if (!passwordModal.pendingFile) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const { cert, keyPair } = importCAPkcs12(content, password)
      
      caCert.value = cert
      caKey.value = keyPair
      
      // Update form fields from imported cert
      caForm.commonName = cert.subject.getField('commonName')?.value?.toString().replace(" Secure Mail CA", "") || caForm.commonName
      caForm.organization = cert.subject.getField('organizationName')?.value?.toString() || caForm.organization
      caForm.locality = cert.subject.getField('localityName')?.value?.toString() || caForm.locality
      caForm.country = cert.subject.getField('countryName')?.value?.toString() || caForm.country
      
      step.value = 'SMIME'
      errorMessage.value = ''
      passwordModal.show = false
    } catch (err: any) {
      errorMessage.value = `Failed to import CA: ${err.message}. Check your password.`
    }
  }
  reader.readAsBinaryString(passwordModal.pendingFile)
}

function handlePasswordConfirm() {
  if (!passwordModal.password) return
  
  if (passwordModal.type === 'export') {
    if (passwordModal.password !== passwordModal.confirmPassword) {
      errorMessage.value = "Passwords do not match."
      return
    }
    executeExport(passwordModal.password)
  } else {
    executeImport(passwordModal.password)
  }
}

async function generateSMIME() {
  if (!caCert.value || !caKey.value) return
  if (smimeForm.password !== smimeForm.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  errorMessage.value = ''
  isBusy.value = true
  try {
    const userKeyPair = await createRsaKeyPair(2048)
    const cert = await createSMIMECertificate(userKeyPair, caCert.value, caKey.value.privateKey, {
      email: smimeForm.email,
      givenName: smimeForm.givenName,
      surname: smimeForm.surname,
      country: caForm.country,
      locality: caForm.locality,
      organization: caForm.organization,
      organizationalUnit: caForm.organizationalUnit,
      validityYears: smimeForm.validityYears
    })

    const p12File = createPkcs12(userKeyPair.privateKey, cert, caCert.value, smimeForm.password)
    downloadFile(p12File, `${smimeForm.email}.p12`)
    
    lastUserCert.value = cert
  } catch (err: any) {
    errorMessage.value = `S/MIME Generation failed: ${err.message}`
  } finally {
    isBusy.value = false
  }
}

async function downloadChainZip() {
  if (!caCert.value || !lastUserCert.value) return
  isBusy.value = true
  try {
    const zipBlob = await createCertificateChainZip(caCert.value, lastUserCert.value, smimeForm.email)
    downloadFile(zipBlob, `${smimeForm.email}_bundle_chain.zip`, 'application/zip')
  } catch (err: any) {
    errorMessage.value = `ZIP generation failed: ${err.message}`
  } finally {
    isBusy.value = false
  }
}

function resetCA() {
  confirmModal.title = "Purge Memory"
  confirmModal.description = "Are you sure? This will immediately delete the current CA state and all generated key material from your browser's session. This action cannot be undone unless you have a backup."
  confirmModal.onConfirm = () => {
    caCert.value = null
    caKey.value = null
    lastUserCert.value = null
    step.value = 'CA'
    errorMessage.value = ''
    confirmModal.show = false
  }
  confirmModal.show = true
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
    <!-- Subtle Gradient Background Highlights -->
    <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] z-0"></div>
    <div class="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] z-0"></div>

    <div class="max-w-5xl w-full relative z-10">
      <!-- LOGO AREA (Stylized SMIMEr) -->
      <div class="flex items-center gap-3 mb-10">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
             <Cpu class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-baseline font-black tracking-tight leading-none">
            <span class="text-3xl text-slate-900">SMIME</span>
            <span class="text-3xl text-primary font-light italic">r</span>
          </div>
        </div>
        <div class="h-6 w-px bg-slate-200 mx-2"></div>
        <span class="text-sm font-bold text-slate-400 uppercase tracking-widest">Trust Engine</span>
      </div>

      <!-- HEADER NAVIGATION -->
      <header class="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Certificate Gateway</h2>
          <p class="text-slate-500 mt-1">Self-contained secure email identity generator.</p>
        </div>
        
        <div class="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            @click="step = 'CA'"
            :class="cn('px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2', 
              step === 'CA' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50')"
          >
            <ShieldCheck class="w-4 h-4" />
            Phase 1: CA Setup
          </button>
          <button 
            @click="caCert ? step = 'SMIME' : null"
            :disabled="!caCert"
            :class="cn('px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2', 
              step === 'SMIME' ? 'bg-primary text-white shadow-md' : (caCert ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-300 cursor-not-allowed'))"
          >
            <Mail class="w-4 h-4" />
            Phase 2: Use S/MIME
          </button>
        </div>
      </header>

      <!-- ERROR MESSAGE -->
      <div v-if="errorMessage" class="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
        <Trash2 class="w-5 h-5 flex-shrink-0" />
        {{ errorMessage }}
      </div>

      <!-- MAIN CONTENT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- SIDEBAR INFO -->
        <div class="lg:col-span-4 space-y-6">
          <div class="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
            
            <h3 class="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Fingerprint class="w-5 h-5 text-primary" />
              Local-Bound
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-4">
              All cryptographic operations are executed in your browser's memory sandbox. <br><br>
              Key material is never leaving this environment. Closing the tab purges all active secrets.
            </p>
          </div>

          <!-- CA STATUS PANEL -->
          <div v-if="caCert" class="p-8 bg-slate-900 text-white rounded-3xl shadow-xl animate-in zoom-in duration-500">
            <h3 class="font-bold flex items-center gap-2 mb-6 text-primary">
              <Database class="w-5 h-5 text-secondary" />
              Active Authority
            </h3>
            <div class="space-y-4 text-sm mb-8">
              <div>
                <span class="text-slate-400 block mb-1 uppercase text-[10px] font-bold tracking-widest">Common Name</span>
                <span class="text-white font-medium truncate block">{{ caForm.commonName }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-slate-400 block mb-1 uppercase text-[10px] font-bold tracking-widest">Organization</span>
                  <span class="text-white font-medium">{{ caForm.organization }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block mb-1 uppercase text-[10px] font-bold tracking-widest">Expires</span>
                  <span class="text-white font-medium">{{ new Date(caCert.validity.notAfter).getFullYear() }}</span>
                </div>
              </div>
              <div class="pt-2 border-t border-white/5">
                <span class="text-slate-400 block mb-1 uppercase text-[10px] font-bold tracking-widest">Serial Number</span>
                <code class="text-[10px] text-primary truncate block font-mono font-bold">{{ caCert.serialNumber.toUpperCase() }}</code>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
              <button 
                @click="handleExportCA" 
                class="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <FileKey class="w-4 h-4 text-secondary" /> Export Authority Bundle
              </button>
              <button 
                @click="resetCA" 
                class="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/30 rounded-xl hover:bg-rose-900/40 transition-colors flex items-center justify-center gap-2 border border-rose-900/50"
              >
                <Trash2 class="w-4 h-4" /> Purge Memory
              </button>
            </div>
          </div>
        </div>

        <!-- FORM AREA -->
        <div class="lg:col-span-8">
          
          <!-- PHASE 1: CA CREATION -->
          <div v-if="step === 'CA'" class="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl transition-all duration-500">
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-secondary/10 text-primary rounded-2xl flex items-center justify-center border border-secondary/20">
                  <Settings class="w-7 h-7" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-slate-900">Define Authority</h2>
                  <span class="text-slate-400 text-sm">Setup your private root of trust</span>
                </div>
              </div>
              
              <button 
                @click="triggerImport"
                class="text-xs font-bold uppercase text-primary hover:bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-slate-100"
              >
                <Upload class="w-4 h-4" />
                Resume from File
              </button>
            </div>

            <input type="file" ref="fileInput" accept=".p12,.pfx" @change="handleImportCA" class="hidden" />

            <form @submit.prevent="generateCA" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Organization Name</label>
                  <input v-model="caForm.organization" type="text" placeholder="e.g. My Organization" class="form-input" />
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Department Name</label>
                  <input v-model="caForm.organizationalUnit" type="text" placeholder="e.g. Security" class="form-input" />
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">CA Common Name</label>
                <input v-model="caForm.commonName" type="text" required class="form-input" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Locality</label>
                  <input v-model="caForm.locality" type="text" class="form-input" />
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Country Code</label>
                  <select v-model="caForm.country" class="form-input">
                    <option v-for="c in countries" :key="c.Code" :value="c.Code">{{ c.Name }}</option>
                  </select>
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Valid Years</label>
                  <input v-model.number="caForm.validityYears" type="number" min="1" max="50" class="form-input" />
                </div>
              </div>

              <button 
                type="submit" 
                :disabled="isBusy"
                class="btn-primary w-full shadow-lg shadow-primary/20"
              >
                <span v-if="isBusy">Compiling cryptography...</span>
                <template v-else>
                  Initialize Root Authority
                  <ArrowRight class="w-6 h-6 ml-2" />
                </template>
              </button>
            </form>
          </div>

          <!-- PHASE 2: S/MIME GENERATION -->
          <div v-else class="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl transition-all duration-500 animate-in slide-in-from-right">
            <div class="flex items-center gap-4 mb-10">
              <div class="w-14 h-14 bg-secondary/10 text-primary rounded-2xl flex items-center justify-center border border-secondary/20">
                <Mail class="w-7 h-7" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-slate-900">Issue User Identity</h2>
                <span class="text-slate-400 text-sm">Signed by <span class="font-bold text-primary">{{ caForm.commonName }}</span></span>
              </div>
            </div>

            <form @submit.prevent="generateSMIME" class="space-y-8">
              <div class="space-y-3">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address (Common Name)</label>
                <input v-model="smimeForm.email" type="email" required placeholder="user@example.com" class="form-input" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">First Name (givenName)</label>
                  <input v-model="smimeForm.givenName" type="text" placeholder="John" class="form-input" />
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name (surname)</label>
                  <input v-model="smimeForm.surname" type="text" placeholder="Doe" class="form-input" />
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Valid Years</label>
                <input v-model.number="smimeForm.validityYears" type="number" min="1" max="10" class="form-input" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Bundle Password</label>
                  <input v-model="smimeForm.password" type="password" required class="form-input" />
                </div>
                <div class="space-y-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Confirm Password</label>
                  <input v-model="smimeForm.confirmPassword" type="password" required class="form-input" />
                </div>
              </div>

              <button 
                type="submit" 
                :disabled="isBusy"
                class="btn-primary w-full shadow-lg shadow-primary/20"
              >
                <span v-if="isBusy">Generating identity...</span>
                <template v-else>
                  <Download class="w-6 h-6 mr-2" />
                  Download p12 Archive
                </template>
              </button>

              <!-- SECONDARY DOWNLOAD: BUNDLE CHAIN -->
              <div v-if="lastUserCert" class="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom duration-700">
                <div class="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                  <FileCheck class="w-4 h-4" />
                  Certificate successfully generated
                </div>
                <div class="text-center">
                  <span class="text-[10px] text-slate-400 uppercase font-black block mb-1">Serial</span>
                  <code class="text-[10px] text-slate-600 font-mono bg-slate-50 px-2 py-0.5 rounded">{{ lastUserCert.serialNumber.toUpperCase() }}</code>
                </div>
                <button 
                  type="button"
                  @click="downloadChainZip"
                  class="text-primary font-bold text-sm hover:underline flex items-center gap-2 transition-all p-2 rounded-xl hover:bg-slate-50 w-full justify-center border border-dashed border-slate-200"
                >
                  <Archive class="w-4 h-4" />
                  Download Complete Chain (.cer bundle ZIP)
                </button>
                <p class="text-[10px] text-slate-400 text-center max-w-xs uppercase tracking-tighter">
                  REQUIRED FOR SYSTEM-WIDE TRUST UPDATES (ROOT & END-ENTITY)
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- FOOTER -->
      <footer class="mt-20 py-8 border-t border-slate-200 text-center text-slate-400 text-xs flex flex-col items-center gap-4">
        <p>&copy; 2026 SMIMEr | Distributed under MIT License.</p>
      </footer>
    </div>

    <!-- CUSTOM PASSWORD MODAL -->
    <Teleport to="body">
      <div v-if="passwordModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="passwordModal.show = false"></div>
        
        <!-- Modal Card -->
        <div class="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          <div class="p-8">
            <div class="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <FileKey v-if="passwordModal.type === 'export'" class="w-6 h-6" />
              <Upload v-else class="w-6 h-6" />
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ passwordModal.title }}</h3>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">{{ passwordModal.description }}</p>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Password</label>
                <input 
                  v-model="passwordModal.password" 
                  type="password" 
                  class="form-input" 
                  placeholder="Password"
                  autofocus
                  @keyup.enter="handlePasswordConfirm"
                />
              </div>

              <div v-if="passwordModal.type === 'export'" class="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</label>
                <input 
                  v-model="passwordModal.confirmPassword" 
                  type="password" 
                  class="form-input" 
                  placeholder="Verify password"
                  @keyup.enter="handlePasswordConfirm"
                />
                <p v-if="passwordModal.password && passwordModal.confirmPassword && passwordModal.password !== passwordModal.confirmPassword" class="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                  Passwords must match
                </p>
              </div>
              
              <div class="flex gap-3 pt-4">
                <button 
                  @click="passwordModal.show = false"
                  class="flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="handlePasswordConfirm"
                  :disabled="!passwordModal.password || (passwordModal.type === 'export' && passwordModal.password !== passwordModal.confirmPassword)"
                  class="flex-[2] py-4 text-sm font-bold text-white bg-primary rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {{ passwordModal.type === 'export' ? 'Download Backup' : 'Unlock Authority' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- CUSTOM CONFIRM MODAL (DANGER) -->
    <Teleport to="body">
      <div v-if="confirmModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" @click="confirmModal.show = false"></div>
        <div class="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
          <div class="p-8">
            <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle class="w-6 h-6" />
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ confirmModal.title }}</h3>
            <p class="text-slate-500 text-sm mb-8 leading-relaxed">{{ confirmModal.description }}</p>
            
            <div class="flex gap-3">
              <button 
                @click="confirmModal.show = false"
                class="flex-1 py-4 text-sm font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
              >
                No, Keep it
              </button>
              <button 
                @click="confirmModal.onConfirm"
                class="flex-1 py-4 text-sm font-bold text-white bg-rose-600 rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
              >
                Yes, Purge
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}
.form-input:focus {
  border-color: #005FB1;
  box-shadow: 0 0 0 4px rgba(0, 95, 177, 0.1);
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
  padding-right: 3rem;
}

.btn-primary {
  background-color: #005FB1;
  color: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #004a8a;
}
.btn-primary:active {
  transform: scale(0.98);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: wait;
}

html {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

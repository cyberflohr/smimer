import { asn1, pkcs12, pki, random, md, util } from "node-forge";
import JSZip from "jszip";

/**
 * Generate a random serial number
 */
function getSerialNumber(): Promise<string> {
  return new Promise((resolve, reject) => {
    random.getBytes(16, (err: Error | null, bytes: string) => {
      if (err) return reject(err);
      // Convert to hex string. 
      // OpenSSL can be finicky if the first bit is set (marking it negative).
      // Forge handles the hex string conversion to a positive DER integer correctly.
      let hex = util.bytesToHex(bytes);
      // Ensure it starts with a 0 if the high bit is set to keep it positive
      if (parseInt(hex[0], 16) >= 8) {
        hex = '00' + hex;
      }
      resolve(hex);
    });
  });
}

/**
 * Calculate validity dates
 */
function getValidityPeriod(durationInYears: number) {
  const start = new Date();
  // Normalize to midnight
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setFullYear(start.getFullYear() + durationInYears);

  return {
    notBefore: start,
    notAfter: end
  };
}

/**
 * Creates a Distinguished Name array
 */
function createDName(
  commonName: string,
  country?: string,
  locality?: string,
  organization?: string,
  organizationalUnit?: string,
  givenName?: string,
  surname?: string
): pki.CertificateField[] {
  const dn: pki.CertificateField[] = [];

  if (country) dn.push({ name: "countryName", value: country });
  if (locality) dn.push({ name: "localityName", value: locality });
  if (organization) dn.push({ name: "organizationName", value: organization });
  if (organizationalUnit) dn.push({ name: "organizationalUnitName", value: organizationalUnit });
  if (givenName) dn.push({ name: "givenName", value: givenName });
  if (surname) dn.push({ name: "surname", value: surname });
  if (commonName) dn.push({ name: "commonName", value: commonName });

  return dn;
}

/**
 * Generate an RSA key pair
 */
export async function createRsaKeyPair(bits = 2048): Promise<pki.rsa.KeyPair> {
  return new Promise((resolve, reject) => {
    pki.rsa.generateKeyPair(bits, undefined, (err: Error | null, keypair: pki.rsa.KeyPair) => {
      if (err) reject(err);
      else resolve(keypair);
    });
  });
}

const CA_SUFFIX = " Secure Mail CA";

/**
 * Create a self-signed Root CA certificate
 */
export async function createCACertificate(
  keyPair: pki.rsa.KeyPair,
  options: {
    commonName: string;
    country: string;
    locality: string;
    organization: string;
    organizationalUnit: string;
    validityYears: number;
  }
): Promise<pki.Certificate> {
  const cert = pki.createCertificate();
  cert.publicKey = keyPair.publicKey;
  cert.serialNumber = await getSerialNumber();
  
  const { notBefore, notAfter } = getValidityPeriod(options.validityYears);
  cert.validity.notBefore = notBefore;
  cert.validity.notAfter = notAfter;

  const dn = createDName(
    options.commonName + CA_SUFFIX,
    options.country,
    options.locality,
    options.organization,
    options.organizationalUnit
  );
  
  cert.setSubject(dn);
  cert.setIssuer(dn); // Self-signed

  cert.setExtensions([
    { name: "basicConstraints", cA: true, critical: true },
    { name: "keyUsage", keyCertSign: true, cRLSign: true, critical: true },
    { name: "subjectKeyIdentifier" }
  ]);

  // Sign the certificate with SHA-256
  cert.sign(keyPair.privateKey as any, md.sha256.create());

  return cert;
}

/**
 * Package CA for export (.p12)
 */
export function exportCAPkcs12(cert: pki.Certificate, keyPair: pki.rsa.KeyPair, password: string): string {
  const p12Asn1 = pkcs12.toPkcs12Asn1(keyPair.privateKey as any, [cert], password, {
    algorithm: "3des",
    friendlyName: cert.subject.getField("commonName")?.value?.toString() || "Root CA"
  });
  return asn1.toDer(p12Asn1).getBytes();
}

/**
 * Restore CA from PKCS#12 bytes
 */
export function importCAPkcs12(p12Binary: string, password: string): { cert: pki.Certificate; keyPair: pki.rsa.KeyPair } {
  const p12Asn1 = asn1.fromDer(p12Binary);
  const p12 = pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
  
  // Find private key and certificate
  let privateKey: pki.PrivateKey | null = null;
  let cert: pki.Certificate | null = null;

  // Extract from safe bags
  for (let i = 0; i < p12.safeContents.length; i++) {
    const safeContent = p12.safeContents[i];
    for (let j = 0; j < safeContent.safeBags.length; j++) {
      const bag = safeContent.safeBags[j];
      if (bag.type === pki.oids.pkcs8ShroudedKeyBag || bag.type === pki.oids.keyBag) {
        privateKey = bag.key as pki.PrivateKey;
      } else if (bag.type === pki.oids.certBag) {
        cert = bag.cert as pki.Certificate;
      }
    }
  }

  if (!privateKey || !cert) {
    throw new Error("Could not find private key or certificate in PKCS#12 bundle.");
  }

  const keyPair: pki.rsa.KeyPair = {
    privateKey: privateKey as pki.rsa.PrivateKey,
    publicKey: cert.publicKey as pki.rsa.PublicKey
  };

  return { cert, keyPair };
}

/**
 * Create an S/MIME certificate signed by a CA
 */
export async function createSMIMECertificate(
  userKeyPair: pki.rsa.KeyPair,
  caCert: pki.Certificate,
  caPrivateKey: pki.PrivateKey,
  options: {
    email: string;
    givenName?: string;
    surname?: string;
    country?: string;
    locality?: string;
    organization?: string;
    organizationalUnit?: string;
    validityYears: number;
  }
): Promise<pki.Certificate> {
  const cert = pki.createCertificate();
  cert.publicKey = userKeyPair.publicKey;
  cert.serialNumber = await getSerialNumber();

  const { notBefore, notAfter } = getValidityPeriod(options.validityYears);
  cert.validity.notBefore = notBefore;
  cert.validity.notAfter = notAfter;

  // CN = Email, but we add givenName/surname if provided
  const dn = createDName(
    options.email,
    options.country,
    options.locality,
    options.organization,
    options.organizationalUnit,
    options.givenName,
    options.surname
  );

  // If a name is provided, we add it as an additional attribute (Common Name is already set to email)
  // Actually, let's keep it simple: CN = Email. 
  // If they want a Display Name in the cert, we could potentially add it as another field,
  // but let's strictly follow "CN = Email".
  
  cert.setSubject(dn);
  cert.setIssuer(caCert.subject.attributes); // Set issuer to CA's subject attributes

  // S/MIME specific extensions
  cert.setExtensions([
    { name: "basicConstraints", cA: false, critical: true },
    { name: "keyUsage", digitalSignature: true, keyEncipherment: true, critical: true },
    { name: "extKeyUsage", emailProtection: true },
    { name: "nsCertType", email: true },
    { name: "subjectAltName", altNames: [{ type: 1, value: options.email }] },
    { name: "subjectKeyIdentifier" },
    { 
      name: "authorityKeyIdentifier", 
      keyIdentifier: (caCert as any).generateSubjectKeyIdentifier().getBytes()
    }
  ]);

  // Sign with CA's private key using SHA-256
  cert.sign(caPrivateKey as any, md.sha256.create());

  return cert;
}

/**
 * Create a ZIP archive containing the certificate chain in .cer (PEM) format
 */
export async function createCertificateChainZip(
  caCert: pki.Certificate,
  userCert: pki.Certificate,
  email: string
): Promise<Blob> {
  const zip = new JSZip();
  
  // Format filenames: Remove only truly illegal filesystem characters, keep @ and dots for readability
  const safeEmail = email.replace(/[\\\/:*?"<>|]/g, '_');
  const caName = caCert.subject.getField('commonName')?.value?.toString().replace(/[\\\/:*?"<>|\s]/g, '_') || 'RootCA';
  
  // Add Root CA
  zip.file(`${caName}.cer`, pki.certificateToPem(caCert));
  
  // Add User Certificate
  zip.file(`${safeEmail}.cer`, pki.certificateToPem(userCert));
  
  return zip.generateAsync({ type: "blob" });
}

/**
 * Export to PKCS#12 (.p12) format
 */
export function createPkcs12(
  privateKey: pki.PrivateKey,
  certificate: pki.Certificate,
  caCert: pki.Certificate,
  password: string
): string {
  const p12Asn1 = pkcs12.toPkcs12Asn1(privateKey as any, [certificate, caCert], password, {
    algorithm: "3des",
    // Modern apps (like Outlook) still use 3des for compat, but we can stick to it as requested
  });
  return asn1.toDer(p12Asn1).getBytes();
}

/**
 * Helper to download raw bytes or Blobs
 */
export function downloadFile(content: string | Blob, filename: string, mimeType = "application/x-pkcs12") {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([binaryStringToUint8Array(content) as any], { type: mimeType });
    
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function binaryStringToUint8Array(binStr: string): Uint8Array {
  const len = binStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes;
}

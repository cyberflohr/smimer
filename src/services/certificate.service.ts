import { asn1, pkcs12, pki, random } from "node-forge";

function getSerialNumber(): Promise<string> {
  return new Promise((resolve, reject) => {
    // workaround for invalid node-forge type definition
    // @ts-ignore
    random.getBytes(8, (err, bytes) => {
      if (err) reject(err);
      resolve(bytes);
    });
  });
}

function getValidityPeriod(durationInDays: number) {
  // Normalize to midnight
  const start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  const end = new Date(start.getTime() + durationInDays * 24 * 60 * 60 * 1000);

  return {
    notBefore: start,
    notAfter: end
  };
}

function createDName(
  commonName: string,
  countryCode?: string,
  cityName?: string,
  organizationUnit?: string,
  organization?: string
): pki.CertificateField[] {
  const dn: pki.CertificateField[] = [];

  if (countryCode) {
    dn.push({
      name: "countryName",
      value: countryCode
    });
  }

  if (cityName) {
    dn.push({
      name: "localityName",
      value: cityName
    });
  }

  if (organizationUnit) {
    dn.push({
      name: "organizationalUnitName",
      value: organizationUnit
    });
  }

  if (organization) {
    dn.push({
      name: "organizationName",
      value: organization
    });
  }

  if (commonName) {
    dn.push({
      name: "commonName",
      value: commonName
    });
  }

  return dn;
}

export async function createCertificate(
  issuer: pki.CertificateField[],
  subject: pki.CertificateField[],
  validityPeriod: number,
  extensions: any[],
  certKeyPair: pki.rsa.KeyPair,
  signerKeyPair?: pki.rsa.KeyPair
) {
  const cert = pki.createCertificate();
  cert.publicKey = certKeyPair.publicKey;
  cert.serialNumber = await getSerialNumber();
  const validity = getValidityPeriod(validityPeriod);
  cert.validity.notBefore = validity.notBefore;
  cert.validity.notAfter = validity.notAfter;
  cert.setSubject(subject);
  cert.setIssuer(issuer);
  cert.setExtensions([
    ...extensions,
    {
      name: "subjectKeyIdentifier"
    }
  ]);

  cert.sign(signerKeyPair ? signerKeyPair.privateKey : certKeyPair.privateKey);

  return cert;
}

export async function createRsaKeyPair(
  length = 2048
): Promise<pki.rsa.KeyPair> {
  return new Promise((resolve, reject) => {
    pki.rsa.generateKeyPair(length, undefined, (err, keyPair) => {
      if (err) reject(err);
      else return resolve(keyPair);
    });
  });
}

const SECURE_MAIL_CA = " Secure Mail CA";

/**
 * Create signed X.509 S/MIME certificate
 * @param email
 * @param countryCode
 * @param organisationName
 */
export async function createSMIMECertificate(
  certKeyPair: pki.rsa.KeyPair,
  signerKeyPair: pki.rsa.KeyPair,
  signerCertificate: pki.Certificate,
  validityPeriod: number,
  email: string,
  countryCode: string,
  cityName: string,
  organisationUnit: string,
  organisationName: string
) {
  const keyIdentifier = signerCertificate[
    "generateSubjectKeyIdentifier"
  ]().getBytes();

  return createCertificate(
    createDName(
      email + SECURE_MAIL_CA,
      countryCode,
      cityName,
      organisationUnit,
      organisationName
    ),
    createDName(email),
    validityPeriod,
    [
      {
        name: "basicConstraints",
        cA: false,
        critical: true
      },
      {
        name: "keyUsage",
        digitalSignature: true,
        keyEncipherment: true,
        critical: true
      },
      {
        name: "extKeyUsage",
        emailProtection: true
      },
      {
        name: "nsCertType",
        email: true
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            type: 1, // email
            value: email
          }
        ]
      },
      {
        name: "authorityKeyIdentifier",
        keyIdentifier: keyIdentifier,
        authorityCertIssuer: true
      }
    ],
    certKeyPair,
    signerKeyPair
  );
}

/**
 * Create signed X.509 CA certificate
 * @param organisationName
 * @param countryCode
 * @param email
 */
export async function createCACertificate(
  certKeyPair: pki.rsa.KeyPair,
  signerKeyPair: pki.rsa.KeyPair,
  validityPeriod: number,
  commonName: string,
  countryCode: string,
  cityName: string,
  organisationUnit: string,
  organisationName: string
) {
  return createCertificate(
    createDName(
      commonName + SECURE_MAIL_CA,
      countryCode,
      cityName,
      organisationUnit,
      organisationName
    ),
    createDName(
      commonName + SECURE_MAIL_CA,
      countryCode,
      cityName,
      organisationUnit,
      organisationName
    ),
    validityPeriod,
    [
      {
        name: "basicConstraints",
        cA: true,
        critical: true
      },
      {
        name: "keyUsage",
        keyCertSign: true,
        critical: true
      }
    ],
    certKeyPair,
    signerKeyPair
  );
}

export function createPkcs12(
  pKey: pki.PrivateKey,
  cert: pki.Certificate,
  caCert: pki.Certificate,
  password: string
) {
  const newPkcs12Asn1 = pkcs12.toPkcs12Asn1(pKey, [cert, caCert], password, {
    algorithm: "3des"
  });
  return asn1.toDer(newPkcs12Asn1).getBytes();
}

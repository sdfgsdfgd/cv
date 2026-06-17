import { readFileSync, writeFileSync } from "node:fs";

const [sourcePath, targetPath, track = "baseline", location = "current"] = process.argv.slice(2);

if (!sourcePath || !targetPath) {
  console.error("usage: node variants/render_pdf_variant.mjs SOURCE_HTML TARGET_HTML TRACK LOCATION");
  process.exit(1);
}

const locations = {
  current: null,
  melbourne: "West Melbourne, VIC 3003",
  sydney: "Potts Point, NSW 2011",
};

const tracks = {
  baseline: null,
  "c-py-systems": {
    title: "Kaan Osmanagaoglu - Software Engineer - C Python Systems",
    regions: {
      "role-tag": `
        <div class="role-tag small">Software Engineer | Java/Kotlin + C/C++/Python | Defence + Secure Systems</div>`,
      "contact-proof": `
          <span><a href="https://github.com/sdfgsdfgd">github.com/sdfgsdfgd</a></span>`,
      profile: `
          <section class="section">
            <div class="section-title"><span>Profile</span></div>
            <p>Software engineer with 9+ years across defence-adjacent robotics, cryptography, secure payments, banking and public-utility systems. Strongest where Java/Kotlin application architecture meets C/C++/Python, Linux-oriented tooling, networking, test automation and full-lifecycle delivery. Earlier work includes RSA BSAFE cryptography and Praesidium Global UGV control/networking for Australian defence work.</p>
          </section>`,
      highlights: `
          <section class="section">
            <div class="section-title"><span>Systems Proof</span></div>
            <ul class="bullets">
              <li>RSA: C/C++/ASM encryption-library work on RSA BSAFE, with Python buildbots/pipelines, HSM integration and validation.</li>
              <li>Praesidium Global: UGV control architecture across C/Python networking, ROS, Lidar/sensor communications and operator HMI.</li>
              <li>Quest + Zeller: certified payment-terminal software: PayWave, Tap-to-Pay, PCI, secure key handling, encryption and offline flows.</li>
              <li>Java/Kotlin delivery: banking, public transport, fuel payments and terminal products where reliability and release discipline mattered.</li>
            </ul>
          </section>`,
      proof: `
          <section class="section">
            <div class="section-title"><span>Role Match</span></div>
            <div class="proof-list">
              <div class="proof-item">
                <div class="proof-label">Languages</div>
                <div class="proof-text">Java/Kotlin, C/C++, Python, Bash and ASM; procedural and object-oriented codebases.</div>
              </div>
              <div class="proof-item">
                <div class="proof-label">Engineering Process</div>
                <div class="proof-text">Architecture decisions, Git configuration management, CI/buildbots, test automation, release support, maintenance and systems integration.</div>
              </div>
            </div>
          </section>`,
      "experience-primary": `
          <section class="section">
            <div class="section-title"><span>Selected Systems Experience</span></div>

            <div class="role featured">
              <div class="role-header">
                <div>
                  <div class="role-company">RSA (EMC/Dell)</div>
                  <div class="role-title">Software Engineer - Cryptography Libraries</div>
                </div>
                <div class="role-meta">Brisbane | 2016</div>
              </div>
              <ul class="bullets">
                <li>Developed RSA BSAFE encryption-library components in C/C++/ASM, with Python automation around buildbots, pipelines and repeatable validation.</li>
                <li>Worked across HSM integration, networking/security surfaces and Android mobile-security PoCs where low-level correctness and traceability mattered.</li>
              </ul>
            </div>

            <div class="role featured">
              <div class="role-header">
                <div>
                  <div class="role-company">Praesidium Global / Defence</div>
                  <div class="role-title">Robotics and HMI Software Engineer</div>
                </div>
                <div class="role-meta">Sunshine Coast | 2018-2019</div>
              </div>
              <ul class="bullets">
                <li>Architected UGV control software across operator tablet HMI, backend communications, sensor networking, ROS and Lidar/collision-detection surfaces.</li>
                <li>Built C/Python networking and integration layers between vehicle systems, control UI and backend services alongside electronics/mechanical engineers.</li>
                <li>Owned architecture, implementation, integration and field-readiness instead of isolated feature delivery.</li>
              </ul>
            </div>

            <div class="role">
              <div class="role-header">
                <div>
                  <div class="role-company">Quest Payment Systems</div>
                  <div class="role-title">Senior Software Engineer</div>
                </div>
                <div class="role-meta">Melbourne | 2023</div>
              </div>
              <ul class="bullets">
                <li>Delivered Android and management software across PoS/payment-terminal products with Westpac, NAB and Officeworks workflows.</li>
                <li>Handled PayWave/payment certification constraints, secure key handling, encryption, offline flows and release readiness.</li>
              </ul>
            </div>

            <div class="role">
              <div class="role-header">
                <div>
                  <div class="role-company">Zeller</div>
                  <div class="role-title">Senior Mobile Engineer</div>
                </div>
                <div class="role-meta">Melbourne | 2023-2024</div>
              </div>
              <ul class="bullets">
                <li>Served as architect on EFTPOS/payment-terminal products; delivered Tap-to-Pay with shared Kotlin mobile code and React Native bridge integration.</li>
                <li>Modernised terminal architecture from RxJava/MVVM toward Coroutines, MVI and Compose while expanding parallel Maestro E2E coverage.</li>
              </ul>
            </div>
          </section>`,
      "experience-secondary": `
          <section class="section">
            <div class="section-title"><span>Additional Delivery</span></div>

            <div class="role">
              <div class="role-header">
                <div>
                  <div class="role-company">Tip.mi</div>
                  <div class="role-title">Senior Mobile Developer (Contract)</div>
                </div>
                <div class="role-meta">Melbourne | 2025-2026</div>
              </div>
              <ul class="bullets">
                <li>Built greenfield Kotlin/Compose Android and Desktop MVP surfaces with CI/CD, secure signing, staged rollouts and Grafana/Mixpanel telemetry.</li>
              </ul>
            </div>

            <div class="role">
              <div class="role-header">
                <div>
                  <div class="role-company">Crypto.com</div>
                  <div class="role-title">Lead Android Developer</div>
                </div>
                <div class="role-meta">Melbourne | 2022-2023</div>
              </div>
              <ul class="bullets">
                <li>Led DeFi Wallet work across staking and cross-chain bridge flows; reviewed protocol papers and coordinated backend/blockchain integrations.</li>
              </ul>
            </div>

            <div class="role">
              <div class="role-header">
                <div>
                  <div class="role-company">Coles</div>
                  <div class="role-title">Senior Android Developer (Contract)</div>
                </div>
                <div class="role-meta">Melbourne | 2021</div>
              </div>
              <ul class="bullets">
                <li>Built phone-based fuel-pump payment flows from the ground up, integrating maps, geofencing, PayWave and multiple gateways.</li>
              </ul>
            </div>

            <div class="section-title"><span>Earlier Java / HMI Work</span></div>

            <div class="compact-role">
              <div class="compact-left">
                <div class="compact-company">PTV / ARQ Group + Suncorp Bank</div>
                <div class="compact-title">Public transport and private-banking systems</div>
              </div>
              <div class="compact-meta">2017-2021</div>
            </div>
            <p class="compact">Delivered Java/Kotlin public transport and banking systems: train-position animations, identity/API integration, Dagger/Retrofit/MVVM and testing practices.</p>

            <div class="compact-role">
              <div class="compact-left">
                <div class="compact-company">Grabba + Mobey + Modanisa/Huawei</div>
                <div class="compact-title">Device, logistics, e-commerce and platform integrations</div>
              </div>
              <div class="compact-meta">2016-2021</div>
            </div>
            <p class="compact">Built biometric, logistics, e-commerce and mobile-platform software spanning device integrations, map/vector animation, payment gateways and international platform APIs.</p>
          </section>`,
      "skill-band": `
      <section class="section skill-band">
        <div class="section-title"><span>Engineering Range</span></div>
        <div class="skill-grid">
          <div class="skill-cluster">
            <div class="skill-cluster-label">Languages</div>
            <div class="skill-cluster-text">Java/Kotlin, C/C++, Python, Bash, ASM, procedural and OOP codebases</div>
          </div>
          <div class="skill-cluster">
            <div class="skill-cluster-label">Systems</div>
            <div class="skill-cluster-text">Linux-oriented tooling, networking, ROS, Lidar/sensors, HMI/control interfaces</div>
          </div>
          <div class="skill-cluster">
            <div class="skill-cluster-label">Security</div>
            <div class="skill-cluster-text">Cryptography libraries, HSMs, secure key handling, PCI, PayWave, wallets</div>
          </div>
          <div class="skill-cluster">
            <div class="skill-cluster-label">Delivery</div>
            <div class="skill-cluster-text">Git, CI/CD, buildbots, test automation, release support, maintenance</div>
          </div>
          <div class="skill-cluster">
            <div class="skill-cluster-label">Architecture</div>
            <div class="skill-cluster-text">Design patterns, modularisation, systems integration, state-driven interfaces</div>
          </div>
          <div class="skill-cluster">
            <div class="skill-cluster-label">Interfaces</div>
            <div class="skill-cluster-text">REST, gRPC, GraphQL, WebSockets, payment/device/backend integrations</div>
          </div>
        </div>
      </section>`,
    },
  },
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceRegion(html, name, content) {
  const start = `<!-- cv:${name}:start -->`;
  const end = `<!-- cv:${name}:end -->`;
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`);
  if (!pattern.test(html)) {
    throw new Error(`missing region marker: ${name}`);
  }
  return html.replace(pattern, `${start}${content}\n${end}`);
}

if (!(location in locations)) {
  throw new Error(`unknown location: ${location}`);
}

if (!(track in tracks)) {
  throw new Error(`unknown track: ${track}`);
}

let html = readFileSync(sourcePath, "utf8");

const selectedLocation = locations[location];
if (selectedLocation) {
  html = replaceRegion(html, "location", `\n          <span>${selectedLocation}</span>`);
}

const selectedTrack = tracks[track];
if (selectedTrack) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${selectedTrack.title}</title>`);
  for (const [name, content] of Object.entries(selectedTrack.regions)) {
    html = replaceRegion(html, name, content);
  }
}

writeFileSync(targetPath, html);

/* =========================================================
   OCTANE FITNESS PRIME – main.js
   Three.js + GSAP + Interactive Features
   ========================================================= */

'use strict';

// ─── GSAP SETUP ───────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── LOADER ───────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    initApp();
  }, 2200);
});

document.body.classList.add('loading');

// ─── CUSTOM CURSOR ────────────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-card, .membership-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─── MAIN APP INIT ────────────────────────────────────────
function initApp() {
  initNavbar();
  initHeroCanvas();
  initDumbbellCanvas();
  initAboutCanvas();
  initServiceParticles();
  initScrollAnimations();
  initTestimonialSwiper();
  initGalleryLightbox();
  initHamburger();
  initSmoothScrollLinks();
}

// ─── NAVBAR ───────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─── HAMBURGER ────────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('mobile-open');
  });
  links.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('mobile-open');
    });
  });
}

// ─── SMOOTH SCROLL LINKS ──────────────────────────────────
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─── HERO 3D CANVAS (Three.js) ────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.035);

  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 4, 18);
  camera.lookAt(0, 1, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x111111, 1);
  scene.add(ambientLight);

  const neonLight1 = new THREE.PointLight(0x39ff14, 3, 25);
  neonLight1.position.set(-8, 6, 5);
  scene.add(neonLight1);

  const neonLight2 = new THREE.PointLight(0x39ff14, 2, 20);
  neonLight2.position.set(8, 4, -5);
  scene.add(neonLight2);

  const topLight = new THREE.SpotLight(0xffffff, 1.5, 40, Math.PI / 6);
  topLight.position.set(0, 20, 5);
  topLight.target.position.set(0, 0, 0);
  scene.add(topLight);
  scene.add(topLight.target);

  // Floor
  const floorGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.9,
    metalness: 0.1,
    wireframe: false,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Grid lines on floor
  const gridHelper = new THREE.GridHelper(80, 40, 0x39ff14, 0x1a2a1a);
  gridHelper.position.y = -1.98;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.3;
  scene.add(gridHelper);

  // Gym equipment (abstracted 3D shapes)
  const neonMat = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 0.4, roughness: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.5 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.8 });

  // Function to create dumbbell
  function createDumbbellMesh(x, z, scale = 1) {
    const group = new THREE.Group();
    const barGeo = new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 1.2 * scale, 12);
    const bar = new THREE.Mesh(barGeo, metalMat);
    bar.rotation.z = Math.PI / 2;
    group.add(bar);

    [[-0.65 * scale, 0], [0.65 * scale, 0]].forEach(([bx]) => {
      const plateGeo = new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 0.22 * scale, 16);
      const plate = new THREE.Mesh(plateGeo, darkMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.x = bx;
      group.add(plate);
    });

    group.position.set(x, -1.75, z);
    return group;
  }

  // Dumbbells row
  for (let i = 0; i < 6; i++) {
    const db = createDumbbellMesh(-5 + i * 2, 2, 0.8 + Math.random() * 0.4);
    db.rotation.y = Math.random() * 0.4 - 0.2;
    scene.add(db);
  }

  // Barbell rack
  function createRack(x, z) {
    const group = new THREE.Group();
    const rackGeo = new THREE.BoxGeometry(0.1, 2, 0.1);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.7 });
    [-0.8, 0.8].forEach(bx => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, 0.1), rackMat);
      post.position.set(bx, 1, 0);
      group.add(post);
    });
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 12), metalMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.y = 1.5;
    group.add(bar);
    [[-1.1, 0], [1.1, 0]].forEach(([bx]) => {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16), darkMat);
      plate.rotation.z = Math.PI / 2;
      plate.position.set(bx, 1.5, 0);
      group.add(plate);
    });
    group.position.set(x, -2, z);
    return group;
  }

  scene.add(createRack(-6, -2));
  scene.add(createRack(6, -2));

  // Treadmill shape
  function createTreadmill(x, z) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.5, 0.2, 3);
    const base = new THREE.Mesh(baseGeo, darkMat);
    group.add(base);
    const handleGeo = new THREE.BoxGeometry(1.5, 1.2, 0.08);
    const handle = new THREE.Mesh(handleGeo, metalMat);
    handle.position.set(0, 0.7, -1.2);
    handle.rotation.x = -Math.PI / 8;
    group.add(handle);
    const beltGeo = new THREE.BoxGeometry(1.35, 0.05, 2.7);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.12;
    group.add(belt);
    group.position.set(x, -1.9, z);
    return group;
  }

  scene.add(createTreadmill(-3, -4));
  scene.add(createTreadmill(0, -4));
  scene.add(createTreadmill(3, -4));

  // Neon trim strips on walls (back wall)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 1 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(80, 20), wallMat);
  backWall.position.set(0, 8, -20);
  scene.add(backWall);

  // Neon strip
  const stripGeo = new THREE.BoxGeometry(40, 0.05, 0.05);
  const stripMat = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 1 });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(0, 4, -19.8);
  scene.add(strip);

  const strip2 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.05, 0.05), stripMat.clone());
  strip2.position.set(0, 0.5, -19.8);
  scene.add(strip2);

  // Floating particles
  const particleCount = 150;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 12 - 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x39ff14,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Scroll-based camera
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, -rect.top / heroEl.offsetHeight));
  }, { passive: true });

  // Resize
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Animate
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    // Subtle camera drift
    camera.position.x = Math.sin(time * 0.3) * 2;
    camera.position.y = 4 + Math.sin(time * 0.2) * 0.5 + scrollProgress * 4;
    camera.position.z = 18 - scrollProgress * 8;
    camera.lookAt(0, 1, 0);

    // Animate neon lights flicker
    neonLight1.intensity = 2.5 + Math.sin(time * 5) * 0.5;
    neonLight2.intensity = 2 + Math.sin(time * 7 + 1) * 0.4;

    // Particles drift
    particles.rotation.y = time * 0.05;
    const pos = particleGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.008;
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -2;
    }
    particleGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── ROTATING 3D DUMBBELL ─────────────────────────────────
function initDumbbellCanvas() {
  const canvas = document.getElementById('dumbbellCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(380, 380);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0x333333, 2);
  scene.add(ambientLight);

  const neonLight = new THREE.PointLight(0x39ff14, 4, 20);
  neonLight.position.set(3, 3, 5);
  scene.add(neonLight);

  const rimLight = new THREE.PointLight(0x39ff14, 2, 15);
  rimLight.position.set(-3, -2, -3);
  scene.add(rimLight);

  // Build stylized dumbbell
  const group = new THREE.Group();

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.95, roughness: 0.15 });
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 });
  const neonRingMat = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 0.8, roughness: 0.3 });

  // Bar
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 20), metalMat);
  bar.rotation.z = Math.PI / 2;
  group.add(bar);

  // Plates and neon rings
  const platePositions = [-1.4, -1.0, 1.0, 1.4];
  platePositions.forEach(x => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.25, 32), plateMat);
    plate.rotation.z = Math.PI / 2;
    plate.position.x = x;
    group.add(plate);
  });

  // Neon rings on plates
  [-1.0, 1.0].forEach(x => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.03, 8, 40), neonRingMat);
    ring.position.x = x;
    ring.rotation.y = Math.PI / 2;
    group.add(ring);
  });

  // Collar grips
  [-0.5, 0.5].forEach(x => {
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 20), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }));
    grip.rotation.z = Math.PI / 2;
    grip.position.x = x;
    group.add(grip);
  });

  scene.add(group);

  // Orbiting light orb
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x39ff14 })
  );
  scene.add(orb);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;
    group.rotation.y += 0.01;
    group.rotation.x = Math.sin(t * 0.5) * 0.2;
    group.position.y = Math.sin(t) * 0.15;

    orb.position.set(Math.cos(t * 2) * 2.5, Math.sin(t * 2) * 0.8, Math.sin(t * 2) * 1.5);
    neonLight.intensity = 3.5 + Math.sin(t * 5) * 0.8;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── ABOUT SECTION 3D CANVAS ──────────────────────────────
function initAboutCanvas() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;

  const w = canvas.parentElement.clientWidth || 500;
  const h = w;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x0a0a0a, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 3, 10);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0x111111, 2);
  scene.add(ambient);

  const neonL = new THREE.PointLight(0x39ff14, 3, 25);
  neonL.position.set(-5, 5, 5);
  scene.add(neonL);

  const neonR = new THREE.PointLight(0x39ff14, 2, 20);
  neonR.position.set(5, 3, -5);
  scene.add(neonR);

  // Grid floor
  const grid = new THREE.GridHelper(20, 20, 0x39ff14, 0x1a3a1a);
  grid.position.y = -2;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  // Spinning energy ring
  const torusMat = new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 0.6, wireframe: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.04, 8, 80), torusMat);
  ring1.rotation.x = Math.PI / 4;
  scene.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.04, 8, 80), torusMat.clone());
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.z = Math.PI / 3;
  scene.add(ring2);

  // Central OFP logo
  const icosaGeo = new THREE.OctahedronGeometry(1.2, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x101810,
    emissive: 0x39ff14,
    emissiveIntensity: 0.2,
    wireframe: false,
    metalness: 0.7,
    roughness: 0.3,
  });
  const ico = new THREE.Mesh(icosaGeo, icoMat);
  scene.add(ico);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x39ff14, wireframe: true, transparent: true, opacity: 0.25 });
  const wire = new THREE.Mesh(new THREE.OctahedronGeometry(1.22, 0), wireMat);
  scene.add(wire);

  // Orbiting spheres
  const orbitSpheres = [];
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x39ff14, emissive: 0x39ff14, emissiveIntensity: 1 })
    );
    scene.add(s);
    orbitSpheres.push({ mesh: s, speed: 0.5 + i * 0.15, radius: 2.5, offset: (i / 6) * Math.PI * 2, axis: i % 2 });
  }

  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 16;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x39ff14, size: 0.04, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(pGeo, pMat));

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    ico.rotation.y += 0.008;
    ico.rotation.x += 0.004;
    wire.rotation.y -= 0.006;
    wire.rotation.z += 0.005;

    ring1.rotation.z += 0.005;
    ring2.rotation.y += 0.007;

    neonL.intensity = 2.8 + Math.sin(t * 3) * 0.6;

    orbitSpheres.forEach(({ mesh, speed, radius, offset, axis }) => {
      const a = t * speed + offset;
      if (axis === 0) {
        mesh.position.set(Math.cos(a) * radius, Math.sin(a) * 0.8, Math.sin(a) * radius * 0.5);
      } else {
        mesh.position.set(Math.sin(a) * radius * 0.5, Math.cos(a) * radius, Math.sin(a * 1.5) * 0.6);
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const nw = canvas.parentElement.clientWidth || 500;
    renderer.setSize(nw, nw);
  });
}

// ─── GALLERY CANVASES ─────────────────────────────────────
const galleryConfig = [
  { id: 'gc1', color1: 0x0d1a0d, color2: 0x080808, accent: 0x39ff14, label: 'Main Floor', depth: 8 },
  { id: 'gc2', color1: 0x0d1520, color2: 0x050a15, accent: 0x4488ff, label: 'Cardio', depth: 6 },
  { id: 'gc3', color1: 0x1a0d0d, color2: 0x120808, accent: 0xff4422, label: 'Strength', depth: 7 },
  { id: 'gc4', color1: 0x1a1200, color2: 0x110d00, accent: 0xffaa00, label: 'Sauna', depth: 5 },
  { id: 'gc5', color1: 0x0d0d1a, color2: 0x080810, accent: 0xaa44ff, label: 'CrossFit', depth: 9 },
  { id: 'gc6', color1: 0x001a15, color2: 0x001010, accent: 0x00ffcc, label: 'Recovery', depth: 6 },
];

function initGalleryCanvases() {
  galleryConfig.forEach(cfg => createGalleryScene(cfg));
}

function createGalleryScene({ id, color1, accent, depth }) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const container = canvas.parentElement;
  const w = container.clientWidth || 400;
  const h = container.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(w, h);
  renderer.setClearColor(color1, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = depth;

  const ambientL = new THREE.AmbientLight(0x111111, 2);
  scene.add(ambientL);
  const accentLight = new THREE.PointLight(accent, 3, 20);
  accentLight.position.set(0, 3, 5);
  scene.add(accentLight);

  // Grid floor
  const grid = new THREE.GridHelper(20, 20, accent, new THREE.Color(accent).multiplyScalar(0.2).getHex());
  grid.position.y = -2.5;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  // Geometry shapes
  const shapes = [];
  const geos = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.TetrahedronGeometry(0.8, 0),
    new THREE.ConeGeometry(0.5, 1.2, 8),
    new THREE.TorusGeometry(0.5, 0.15, 8, 24),
  ];

  for (let i = 0; i < 12; i++) {
    const geo = geos[i % geos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: i % 3 === 0 ? accent : 0x1a1a1a,
      emissive: i % 3 === 0 ? accent : 0x000000,
      emissiveIntensity: i % 3 === 0 ? 0.4 : 0,
      wireframe: i % 4 === 0,
      metalness: 0.6,
      roughness: 0.4,
      transparent: i % 4 !== 0,
      opacity: i % 4 !== 0 ? 0.8 : 1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4 - 2
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.4 + Math.random() * 0.6;
    mesh.scale.setScalar(s);
    scene.add(mesh);
    shapes.push({ mesh, speed: 0.003 + Math.random() * 0.005, floatSpeed: 0.5 + Math.random(), floatAmt: 0.1 + Math.random() * 0.3, baseY: mesh.position.y });
  }

  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: accent, size: 0.04, transparent: true, opacity: 0.6 })));

  let t = 0;

  // Hover parallax
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    camera.position.x += (x * 1.5 - camera.position.x) * 0.08;
    camera.position.y += (y * 1.0 - camera.position.y) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  container.addEventListener('mouseleave', () => {
    camera.position.x += (0 - camera.position.x) * 0.05;
    camera.position.y += (0 - camera.position.y) * 0.05;
  });

  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    shapes.forEach(({ mesh, speed, floatSpeed, floatAmt, baseY }) => {
      mesh.rotation.x += speed;
      mesh.rotation.y += speed * 0.7;
      mesh.position.y = baseY + Math.sin(t * floatSpeed) * floatAmt;
    });

    accentLight.intensity = 2.5 + Math.sin(t * 3) * 0.8;
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    const nw = container.clientWidth;
    const nh = container.clientHeight;
    if (nw > 0 && nh > 0) {
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    }
  });
  ro.observe(container);
}

// ─── SERVICE PARTICLES ────────────────────────────────────
function initServiceParticles() {
  const container = document.getElementById('serviceParticles');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:absolute;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      background:rgba(57,255,20,${0.1 + Math.random() * 0.3});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: particleDrift ${5 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate;
    `;
    container.appendChild(dot);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleDrift {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      100% { transform: translate(${(Math.random() - 0.5) * 100}px, ${-20 - Math.random() * 60}px) scale(${0.5 + Math.random()}); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── SCROLL ANIMATIONS (GSAP) ─────────────────────────────
function initScrollAnimations() {
  // Reveal elements on scroll
  function setupReveal(selector, cls) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('visible'),
      });
    });
  }

  // About
  document.querySelectorAll('.about-feature').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    el.classList.add('reveal');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => el.classList.add('visible'),
    });
  });

  document.querySelector('.about-visual')?.classList.add('reveal-left');
  ScrollTrigger.create({
    trigger: '.about-visual',
    start: 'top 85%',
    onEnter: () => document.querySelector('.about-visual')?.classList.add('visible'),
  });

  // Section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('visible'),
    });
  });

  // Service cards stagger
  document.querySelectorAll('.service-card').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay: (i % 3) * 0.1, ease: 'power2.out' });
      },
    });
  });

  // Membership cards stagger
  document.querySelectorAll('.membership-card').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 60 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power2.out' });
      },
    });
  });

  // Gallery items
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    gsap.set(el, { opacity: 0, scale: 0.95 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.7, delay: i * 0.08, ease: 'power2.out' });
      },
    });
  });

  // Contact info items
  document.querySelectorAll('.info-item').forEach((el, i) => {
    gsap.set(el, { opacity: 0, x: -30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out' });
      },
    });
  });

  // Contact form
  gsap.set('.contact-form', { opacity: 0, x: 40 });
  ScrollTrigger.create({
    trigger: '.contact-form',
    start: 'top 85%',
    onEnter: () => gsap.to('.contact-form', { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }),
  });

  // Hero section parallax
  gsap.to('.hero-content', {
    y: '-15%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // Stat counter animation
  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 80%',
    once: true,
    onEnter: () => animateCounters(),
  });
}

// ─── COUNTER ANIMATION ────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/[\d,]+/);
    if (!match) return;
    const target = parseInt(match[0].replace(',', ''));
    const suffix = text.replace(match[0], '');
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ─── TESTIMONIAL SWIPER ───────────────────────────────────
function initTestimonialSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'slide',
    breakpoints: {
      640: { slidesPerView: 1.2, centeredSlides: true },
      900: { slidesPerView: 2, centeredSlides: false },
      1200: { slidesPerView: 2.5, centeredSlides: true },
    },
  });
}

// ─── GALLERY LIGHTBOX ─────────────────────────────────────
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const label = item.dataset.label || 'Gallery';
      lightboxContent.innerHTML = `
        <div style="font-size:0.8rem;letter-spacing:0.3em;color:var(--neon);margin-bottom:20px;font-family:var(--font-alt);">OCTANE FITNESS PRIME</div>
        <div style="font-size:1.6rem;margin-bottom:12px;">${label}</div>
        <div style="font-size:0.9rem;color:var(--text-secondary);font-family:var(--font-body);font-weight:300;line-height:1.6;">
          Experience world-class facilities at Chandigarh's most premium gym.<br>
          Every space designed for elite performance.
        </div>
      `;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ─── FORM HANDLER ─────────────────────────────────────────
window.handleFormSubmit = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'SENDING...';

  setTimeout(() => {
    e.target.style.display = 'none';
    const success = document.getElementById('formSuccess');
    success.classList.add('visible');
  }, 1500);
};

// ─── NAV ACTIVE STATE ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--neon)' : '';
  });
}, { passive: true });

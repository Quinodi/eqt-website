// ============================================
// Particle System for Hero Banner
// Using Three.js for 3D particle effects
// ============================================

let particleSystem = null;

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initParticleSystem();
});

function initParticleSystem() {
    // Get canvas element
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup - perspective for 3D depth
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.z = 400;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: false, // No transparency, we want black background
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1); // Black background

    // Particle configuration
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    // Color palette: white, grays, and blue
    const colorPalette = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xcccccc), // Light gray
        new THREE.Color(0x999999), // Medium gray
        new THREE.Color(0x666666), // Dark gray
        new THREE.Color(0x0066cc), // Blue accent
        new THREE.Color(0x3388dd), // Lighter blue
    ];

    // Initialize particles in a spherical distribution
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Create particles in a sphere with denser center
        const radius = Math.random() * 300 + (Math.random() * Math.random() * 200);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Assign random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Particle size with variation
        sizes[i] = Math.random() * 3 + 1;

        // Initial velocities for organic movement
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    // Create particle system
    const particleSystemMesh = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystemMesh);

    // Mouse interaction variables
    const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    };

    // Track mouse movement
    window.addEventListener('mousemove', (event) => {
        mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation variables
    let time = 0;
    const rotationSpeed = 0.0003;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        time += 0.01;

        // Smooth mouse position
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Get position attribute
        const positions = particleSystemMesh.geometry.attributes.position.array;

        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Get current position
            let x = positions[i3];
            let y = positions[i3 + 1];
            let z = positions[i3 + 2];

            // Calculate distance from center
            const dist = Math.sqrt(x * x + y * y + z * z);

            // Orbital rotation around center
            const angle = Math.atan2(y, x);
            const newAngle = angle + rotationSpeed;
            const radius = Math.sqrt(x * x + y * y);

            positions[i3] = radius * Math.cos(newAngle);
            positions[i3 + 1] = radius * Math.sin(newAngle);

            // Add some vertical wave motion
            positions[i3 + 2] += Math.sin(time + i * 0.01) * 0.1;

            // Mouse interaction - gentle repulsion
            const mouseInfluence = 50;
            const dx = positions[i3] - (mouse.x * 200);
            const dy = positions[i3 + 1] - (mouse.y * 200);
            const distToMouse = Math.sqrt(dx * dx + dy * dy);

            if (distToMouse < mouseInfluence) {
                const force = (mouseInfluence - distToMouse) / mouseInfluence;
                positions[i3] += dx * force * 0.05;
                positions[i3 + 1] += dy * force * 0.05;
            }

            // Keep particles within bounds with gentle pull back
            const maxDist = 500;
            if (dist > maxDist) {
                positions[i3] *= 0.99;
                positions[i3 + 1] *= 0.99;
                positions[i3 + 2] *= 0.99;
            }
        }

        // Mark geometry as needing update
        particleSystemMesh.geometry.attributes.position.needsUpdate = true;

        // Slowly rotate the entire system
        particleSystemMesh.rotation.y += 0.0002;
        particleSystemMesh.rotation.x = Math.sin(time * 0.1) * 0.05;

        // Add camera sway based on mouse
        camera.position.x = mouse.x * 20;
        camera.position.y = mouse.y * 20;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Store reference for cleanup if needed
    particleSystem = {
        scene,
        camera,
        renderer,
        particleSystemMesh
    };
}

// Optional: Cleanup function
function destroyParticleSystem() {
    if (particleSystem) {
        particleSystem.renderer.dispose();
        particleSystem.particleSystemMesh.geometry.dispose();
        particleSystem.particleSystemMesh.material.dispose();
        particleSystem = null;
    }
}

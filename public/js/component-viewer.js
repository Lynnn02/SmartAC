// Component Viewer for SmartAC Application
// This script handles the 3D model viewing functionality

// Component information
const componentInfo = {
    'PressureSwitch': {
        name: 'Pressure Switch',
        description: 'The pressure switch is a safety device that monitors the refrigerant pressure in the AC system. It will shut off the compressor if the pressure gets too high or too low, protecting the system from damage.',
        function: 'Controls the compressor based on refrigerant pressure levels',
        location: 'Usually mounted on the high pressure line near the compressor',
        maintenance: 'Check electrical connections and pressure calibration during system service'
    },
    'ReceiverDrier': {
        name: 'Receiver Drier',
        description: 'The receiver drier stores excess refrigerant and contains a desiccant material that removes moisture from the refrigerant. Moisture in the system can cause acid formation and component damage.',
        function: 'Removes moisture from the refrigerant and stores excess refrigerant',
        location: 'Typically located between the condenser and expansion valve',
        maintenance: 'Should be replaced whenever the system is opened for major repairs'
    },
    'SightGlass': {
        name: 'Sight Glass',
        description: 'The sight glass allows technicians to visually inspect the refrigerant flow in the system. Bubbles in the sight glass can indicate low refrigerant levels, while cloudy appearance can indicate moisture contamination.',
        function: 'Provides visual indication of refrigerant condition and level',
        location: 'Usually installed in the liquid line after the receiver drier',
        maintenance: 'Inspect during system service for bubbles or cloudiness'
    },
    'TXV': {
        name: 'Thermal Expansion Valve (TXV)',
        description: 'The thermal expansion valve is a precision device that controls the flow of refrigerant into the evaporator. It responds to temperature and pressure changes to maintain optimal system performance.',
        function: 'Regulates refrigerant flow based on cooling demand',
        location: 'Mounted at the inlet of the evaporator',
        maintenance: 'Check for proper operation during system service, replace if stuck or malfunctioning'
    }
};

// Initialize scene, camera, renderer, and controls
let scene, camera, renderer, controls;
let currentModel = null;
let modalComponentViewer = null;

// Initialize the component viewer when the DOM is loaded
// Make sure THREE.GLTFLoader is available
if (typeof THREE.GLTFLoader === 'undefined') {
    console.error('THREE.GLTFLoader is not available. Make sure to include the GLTFLoader.js script.');
}

document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners for component links
    const componentLinks = document.querySelectorAll('[data-model]');
    componentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modelName = this.getAttribute('data-model');
            openComponentModal(modelName);
        });
    });

    // Initialize the complete system viewer if the container exists
    const completeSystemContainer = document.getElementById('completeSystemContainer');
    if (completeSystemContainer) {
        initializeCompleteSystemViewer(completeSystemContainer);
    }

    // Set up modal events
    const componentModal = document.getElementById('componentModal');
    if (componentModal) {
        componentModal.addEventListener('shown.bs.modal', function() {
            if (modalComponentViewer) {
                modalComponentViewer.resize();
            }
        });
    }

    // Set up AR view buttons
    const arButton = document.getElementById('viewAR');
    if (arButton) {
        arButton.addEventListener('click', function() {
            alert('AR functionality will be implemented in a future update.');
        });
    }

    const componentArButton = document.getElementById('viewComponentAR');
    if (componentArButton) {
        componentArButton.addEventListener('click', function() {
            alert('AR functionality will be implemented in a future update.');
        });
    }
});

// Initialize the complete system viewer
function initializeCompleteSystemViewer(container) {
    // Create a scene, camera, renderer for the complete system view
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    
    // Add a placeholder cube for now
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x0d6efd });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Set up control buttons
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const resetViewBtn = document.getElementById('resetView');
    const rotateRightBtn = document.getElementById('rotateRight');

    if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', function() {
            controls.rotateLeft(Math.PI / 8);
        });
    }

    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            controls.reset();
        });
    }

    if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', function() {
            controls.rotateLeft(-Math.PI / 8);
        });
    }
}

// Open the component modal and load the 3D model
function openComponentModal(modelName) {
    // Update modal title
    const modalTitle = document.getElementById('componentModalLabel');
    if (modalTitle && componentInfo[modelName.split('.')[0]]) {
        modalTitle.textContent = componentInfo[modelName.split('.')[0]].name;
    }

    // Update component information
    const infoContainer = document.getElementById('componentInfo');
    if (infoContainer && componentInfo[modelName.split('.')[0]]) {
        const info = componentInfo[modelName.split('.')[0]];
        infoContainer.innerHTML = `
            <h4>${info.name}</h4>
            <p>${info.description}</p>
            <hr>
            <p><strong>Function:</strong> ${info.function}</p>
            <p><strong>Location:</strong> ${info.location}</p>
            <p><strong>Maintenance:</strong> ${info.maintenance}</p>
        `;
    }

    // Initialize or update the 3D model viewer
    const modelContainer = document.getElementById('componentModelContainer');
    if (modelContainer) {
        // Clear previous content
        modelContainer.innerHTML = `
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading 3D model...</p>
                </div>
            </div>
        `;

        // Create a new component viewer instance
        modalComponentViewer = new ComponentViewer(modelContainer, `/models/${modelName}`);
    }

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('componentModal'));
    modal.show();
}

// Class for handling 3D model viewing
class ComponentViewer {
    constructor(container, modelPath) {
        this.container = container;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        
        // Load model
        this.loadModel();
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
    }
    
    loadModel() {
        // Load the GLB model using GLTFLoader
        const loader = new THREE.GLTFLoader();
        const modelPath = this.modelPath;
        
        // Add a loading manager to handle errors
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onError = (url) => {
            console.error('Error loading model:', url);
            // If model fails to load, add a placeholder cube
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color: 0x0d6efd });
            this.model = new THREE.Mesh(geometry, material);
            this.scene.add(this.model);
        };
        
        // Try to load the model
        loader.setPath('');
        loader.load(modelPath, (gltf) => {
            this.model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Adjust model position to center it
            this.model.position.x = -center.x;
            this.model.position.y = -center.y;
            this.model.position.z = -center.z;
            
            // Adjust camera position based on model size
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = this.camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5; // Add some margin
            this.camera.position.z = cameraZ;
            
            // Update camera near and far planes
            this.camera.near = cameraZ / 100;
            this.camera.far = cameraZ * 100;
            this.camera.updateProjectionMatrix();
            
            // Add the model to the scene
            this.scene.add(this.model);
            
            // Reset controls target to center of model
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }, undefined, loadingManager.onError);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Only rotate if it's a simple mesh, not a complex model
        if (this.model && this.model.type === 'Mesh') {
            this.model.rotation.y += 0.01;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

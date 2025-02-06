import * as THREE from 'three';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        
        this.trees = [];
        this.grassCount = 100000; // Increased from 10000 to better cover larger area
        this.moveSpeed = 0.1;
        this.keys = {};
        
        // Add new properties for mouse control and jumping
        this.mouseSensitivity = 0.002;
        this.verticalVelocity = 0;
        this.isJumping = false;
        this.jumpForce = 0.15;
        this.gravity = 0.006;
        
        // Add direction vector for movement
        this.moveDirection = new THREE.Vector3();
        // Add euler for rotation tracking
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
        
        // Add sky properties
        this.time = 0;
        this.timeSpeed = 0.0001;
        
        // Add movement speed properties
        this.walkSpeed = 0.1;
        this.sprintSpeed = 0.4; // Increased from 0.2 to 0.4
        this.moveSpeed = this.walkSpeed;
        this.isRunning = false;
        
        this.foxes = [];
        this.foxCount = 10;
        this.companionOrb = null;
        
        // Add bears array initialization
        this.bears = [];
        this.bearCount = 5;
        
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.isHurt = false;
        this.hurtCooldown = 0;
        this.damageShakeIntensity = 0;
        this.isDead = false;
        
        // Add bullet properties
        this.bullets = [];
        this.bulletSpeed = 2.0;
        this.lastShotTime = 0;
        this.shootCooldown = 0.5; // Time between shots in seconds
        
        // Add health pack properties
        this.healthPacks = [];
        this.healthPackCount = 10;
        this.healthPackValue = 30; // Amount of health restored
        this.healthPackRespawnTime = 30; // Seconds until a new health pack spawns
        this.lastHealthPackSpawn = 0;
        
        // Add gun properties
        this.gun = null;
        this.gunOffset = new THREE.Vector3(0.3, -0.3, -0.5); // Position relative to camera
        this.gunRecoil = 0;
        
        // Add ADS (aim down sights) properties
        this.isAiming = false;
        this.defaultFOV = 75;
        this.aimFOV = 45;
        this.currentFOV = this.defaultFOV;
        this.aimTransitionSpeed = 0.1;
        
        // Adjust gun offset properties
        this.defaultGunOffset = new THREE.Vector3(0.3, -0.3, -0.5);
        this.aimGunOffset = new THREE.Vector3(0, -0.2, -0.3);
        this.gunOffset = this.defaultGunOffset.clone();
        
        // Add health regeneration properties
        this.healthRegenRate = 5; // Health points per second
        this.healthRegenDelay = 5; // Seconds to wait after damage before regen starts
        this.lastDamageTime = 0;
        
        // Add bear respawn properties
        this.bearRespawnTime = 8;  // Increased from 5
        this.deadBears = []; // Track dead bears for respawning
        
        // Add ammo properties
        this.maxAmmo = 20;
        this.currentAmmo = this.maxAmmo;
        this.isReloading = false;
        this.reloadTime = 2.0; // Seconds to reload
        
        // Add reload animation properties
        this.reloadAnimation = {
            active: false,
            startTime: 0,
            rotationX: 0
        };
        
        // Add stamina properties
        this.maxStamina = 200; // Doubled from 100
        this.currentStamina = this.maxStamina;
        this.staminaRegenRate = 35; // Increased from 25
        this.staminaDrainRate = 20; // Decreased from 30
        this.staminaRegenDelay = 0.5; // Decreased from 1
        this.lastStaminaUse = 0;
        
        // Add hunger properties
        this.maxHunger = 100;
        this.currentHunger = this.maxHunger;
        this.hungerDrainRate = 2; // Points per second
        this.hungerDamageRate = 5; // Damage when starving
        this.lastHungerDamage = 0;
        this.hungerDamageInterval = 2; // Seconds between damage when starving
        
        // Add fox health properties
        this.foxHealth = 1; // Foxes die in one shot
        this.foxFoodValue = 20; // Less food than bears
        
        // Add survival timer properties
        this.survivalTime = 0;
        this.startTime = performance.now() * 0.001;
        this.createSurvivalTimer();
        
        // Create UI elements in correct order
        this.createHealthBar();
        this.createAmmoBar();
        this.createStaminaBar();
        this.createHungerBar();
        this.createDamageOverlay();
        this.createRespawnScreen();
        this.createGoldBar();
        this.createUpgradeMenu();
        this.createControlsOverlay();  // Create only once
        this.createSurvivalTimer();
        this.createLevelDisplay();
        
        // Create intro screen last, after controls overlay exists
        this.showingIntro = true;
        this.createIntroScreen();
        
        // Don't initialize game until intro is done
        this.introTimer = setTimeout(() => {
            this.showingIntro = false;
            this.introScreen.style.display = 'none';
            this.controlsOverlay.style.opacity = '0';
            this.controlsOverlay.style.display = 'none';
            this.init();
        }, 5000);
        
        // Add bird properties
        this.birds = [];
        this.birdCount = 15;
        this.birdFoodValue = 15; // Less food than foxes
        
        // Add fox respawn properties
        this.deadFoxes = [];
        this.foxRespawnTime = 6;   // Increased from 3
        this.birdRespawnTime = 5;  // New property
        
        // Add power-up properties
        this.powerUpDuration = 15; // Increased from 5 to 15 seconds
        this.normalSprintSpeed = 0.4;
        this.powerUpSprintSpeed = 0.8;
        this.normalHungerDrainRate = 2;
        this.powerUpHungerDrainRate = 0.5;
        this.isPoweredUp = false;
        this.powerUpEndTime = 0;
        
        // Add sun properties
        this.sunPosition = new THREE.Vector3(400, 300, -400);
        this.sunSize = 50;
        
        // Add mystical creature properties
        this.mysticCreatures = [];
        this.mysticCreatureCount = 30;
        
        // Increase tree count and add cabin properties
        this.treeCount = 800; // Increased from 500
        this.cabins = [];
        this.cabinCount = 15; // Increased from 8
        this.paths = []; // Store path meshes
        
        // Add tree size variation
        this.maxTreeHeight = 8; // Some trees will be twice as tall
        
        // Add collision properties
        this.colliders = [];
        this.playerRadius = 0.5;
        
        // Add player shadow properties
        this.playerShadow = null;
        this.shadowOffset = new THREE.Vector3(0.3, 0, 0.3); // Slight offset for better visibility
        
        // Add hunger pause property
        this.hungerPauseTime = 0;
        this.hungerPauseDuration = 5; // 5 seconds pause after killing a bear
        
        // Add campsite properties
        this.campsites = [];
        this.campsiteCount = 6;
        this.firePits = [];
        
        // Add gold properties
        this.maxGold = 100;
        this.currentGold = 0;
        this.townChestValue = 50;
        this.campsiteChestValue = 20;
        this.chests = [];
        
        // Add upgrade properties
        this.upgrades = {
            health: { level: 1, cost: 100 },
            stamina: { level: 1, cost: 100 },
            hunger: { level: 1, cost: 100 },
            damage: { level: 1, cost: 100 }
        };
        
        // Add level and upgrade feedback properties
        this.playerLevel = 0;
        this.upgradeFlashDuration = 3; // seconds
        this.upgradeFlashTime = 0;
        this.lastUpgradedStat = null;
        
        // Add regeneration multipliers
        this.regenMultipliers = {
            health: 1,
            stamina: 1,
            hunger: 1,
            damage: 1
        };
        
        // Base gold requirement and scaling factor
        this.baseGoldRequirement = 100;
        this.goldScalingFactor = 1.2;  // Each level requires 20% more gold
        this.maxGold = this.baseGoldRequirement;  // Initial requirement
        
        // Add wolf properties
        this.wolves = [];
        this.wolfCount = 20;  // Increased from 8
        this.deadWolves = [];
        this.wolfRespawnTime = 7;  // Increased from 4
        
        // Add controls overlay properties
        this.createControlsOverlay();
    }

    createControlsOverlay() {
        this.controlsOverlay = document.createElement('div');
        this.controlsOverlay.style.position = 'fixed';
        this.controlsOverlay.style.top = '50%';
        this.controlsOverlay.style.left = '50%';
        this.controlsOverlay.style.transform = 'translate(-50%, -50%)';
        this.controlsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.controlsOverlay.style.padding = '30px';
        this.controlsOverlay.style.borderRadius = '15px';
        this.controlsOverlay.style.color = 'white';
        this.controlsOverlay.style.fontFamily = 'Arial, sans-serif';
        this.controlsOverlay.style.zIndex = '2000';
        this.controlsOverlay.style.minWidth = '400px';
        this.controlsOverlay.style.border = '2px solid #FFD700';
        this.controlsOverlay.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';

        const title = document.createElement('h2');
        title.textContent = 'Game Controls';
        title.style.textAlign = 'center';
        title.style.color = '#FFD700';
        title.style.marginBottom = '20px';
        title.style.fontSize = '28px';
        this.controlsOverlay.appendChild(title);

        const controls = [
            ['WASD', 'Move'],
            ['Mouse', 'Look around'],
            ['Left Click', 'Shoot'],
            ['Right Click', 'Aim'],
            ['Shift', 'Sprint'],
            ['Space', 'Jump'],
            ['R', 'Reload'],
            ['Tab', 'Show this menu'],
        ];

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'auto 1fr';
        grid.style.gap = '15px';
        grid.style.fontSize = '18px';

        controls.forEach(([key, action]) => {
            const keyElement = document.createElement('div');
            keyElement.textContent = key;
            keyElement.style.backgroundColor = '#333';
            keyElement.style.padding = '8px 15px';
            keyElement.style.borderRadius = '5px';
            keyElement.style.fontWeight = 'bold';
            keyElement.style.color = '#FFD700';
            keyElement.style.textAlign = 'center';
            
            const actionElement = document.createElement('div');
            actionElement.textContent = action;
            actionElement.style.padding = '8px 0';
            
            grid.appendChild(keyElement);
            grid.appendChild(actionElement);
        });

        this.controlsOverlay.appendChild(grid);

        // Add game objectives section
        const objectivesTitle = document.createElement('h3');
        objectivesTitle.textContent = 'Objectives';
        objectivesTitle.style.textAlign = 'center';
        objectivesTitle.style.color = '#FFD700';
        objectivesTitle.style.margin = '30px 0 15px';
        this.controlsOverlay.appendChild(objectivesTitle);

        const objectives = [
            'Survive as long as possible',
            'Hunt animals for food',
            'Collect gold from chests',
            'Level up and upgrade your abilities',
            'Watch your health, stamina, and hunger'
        ];

        const objectivesList = document.createElement('ul');
        objectivesList.style.listStyleType = 'none';
        objectivesList.style.padding = '0';
        objectivesList.style.textAlign = 'center';

        objectives.forEach(objective => {
            const li = document.createElement('li');
            li.textContent = '• ' + objective;
            li.style.margin = '10px 0';
            objectivesList.appendChild(li);
        });

        this.controlsOverlay.appendChild(objectivesList);

        // Initialize state and styles
        this.controlsOverlay.style.opacity = '0';
        this.controlsOverlay.style.display = 'none';
        this.controlsOverlay.style.transition = 'opacity 0.2s';
        this.isShowingControls = false;

        // Handle Tab key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                if (!this.showingIntro) {
                    this.controlsOverlay.style.display = 'block';
                }
            }
        });

        // Handle Tab key release
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                this.controlsOverlay.style.display = 'none';
            }
        });

        document.body.appendChild(this.controlsOverlay);
    }

    hideControlsOverlay() {
        if (!this.showingIntro) {
            this.controlsOverlay.style.opacity = '0';
            this.controlsOverlay.style.display = 'none';
        }
    }

    createLevelDisplay() {
        this.levelDisplay = document.createElement('div');
        this.levelDisplay.style.position = 'fixed';
        this.levelDisplay.style.top = '60px';  // Position below timer
        this.levelDisplay.style.right = '20px';
        this.levelDisplay.style.color = '#fff';
        this.levelDisplay.style.fontFamily = 'Arial, sans-serif';
        this.levelDisplay.style.fontSize = '24px';
        this.levelDisplay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        this.updateLevelDisplay();
        document.body.appendChild(this.levelDisplay);
    }

    updateLevelDisplay() {
        this.levelDisplay.textContent = `Level: ${this.playerLevel}`;  // Added colon for consistency
    }

    init() {
        // Update renderer settings first
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x88ccff);
        document.body.appendChild(this.renderer.domElement);

        // Set initial camera position and rotation BEFORE creating world
        this.camera.position.set(0, 2, 5);
        this.camera.rotation.order = 'YXZ';

        // Setup event listeners for movement and controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ' && !this.isJumping) {
                this.verticalVelocity = this.jumpForce;
                this.isJumping = true;
            }
        });
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        window.addEventListener('resize', () => this.handleResize());

        // Add mouse controls
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('click', () => {
            document.body.requestPointerLock();
        });

        // Add pointer lock change handler
        document.addEventListener('pointerlockchange', () => {
            if (!document.pointerLockElement) {
                this.resetKeys();
            }
        });

        // Add mouse click listener for shooting
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0 && document.pointerLockElement) { // Left click
                this.shoot();
            }
            if (e.button === 2 && document.pointerLockElement) { // Right click
                this.isAiming = true;
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 2) { // Right click release
                this.isAiming = false;
            }
        });

        // Prevent context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Create world after camera setup
        this.createSky();
        this.createSun();
        this.createGround();
        this.createCabins();
        this.spawnWaterTowers();
        this.createCampsites();
        this.spawnChests();
        this.spawnWolves();
        this.generateTrees(this.treeCount);
        this.createBirds();
        this.createMysticCreatures();
        this.createGun();
        this.createPlayerShadow();

        // Start animation loop
        this.animate();
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x355828,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;  // Fixed ground rotation
        ground.position.y = 0;  // Ensure ground is at y=0
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    generateTrees(count) {
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f1b });
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });

        for (let i = 0; i < count; i++) {
            const tree = new THREE.Group();
            
            // Random tree height between 4 and maxTreeHeight
            const height = 4 + Math.random() * (this.maxTreeHeight - 4);
            const scale = height / 4; // Scale width with height
            
            // Create trunk with random slight lean
            const trunkGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, height * 0.5, 8);
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = height * 0.25;
            trunk.rotation.x = (Math.random() - 0.5) * 0.2;
            trunk.rotation.z = (Math.random() - 0.5) * 0.2;
            tree.add(trunk);

            // Enable shadows for trunk and leaves
            trunk.castShadow = true;
            trunk.receiveShadow = true;

            // Create multiple layers of leaves
            const leafLayers = 3;
            for (let j = 0; j < leafLayers; j++) {
                const leafGeometry = new THREE.ConeGeometry(scale * (1.5 - j * 0.3), height * 0.4, 8);
                const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
                leaves.position.y = height * (0.5 + j * 0.2);
                leaves.castShadow = true;
                leaves.receiveShadow = true;
                tree.add(leaves);
            }

            // Random position
            tree.position.x = (Math.random() - 0.5) * 800;
            tree.position.z = (Math.random() - 0.5) * 800;
            
            // Random rotation
            tree.rotation.y = Math.random() * Math.PI * 2;

            // Keep track of tree position and scale for collision
            const treeScale = height / 4;
            tree.userData.collisionRadius = 0.3 * treeScale;
            
            // Ensure trees don't spawn too close to each other
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 50;
            
            do {
                tree.position.x = (Math.random() - 0.5) * 800;
                tree.position.z = (Math.random() - 0.5) * 800;
                
                validPosition = true;
                
                // Check distance from paths
                for (const path of this.paths) {
                    const pathPos = path.position.clone();
                    const distance = tree.position.distanceTo(pathPos);
                    if (distance < 3) { // Keep trees away from paths
                        validPosition = false;
                        break;
                    }
                }

                // Check distance from cabins
                for (const cabin of this.cabins) {
                    const distance = tree.position.distanceTo(cabin.position);
                    if (distance < 10) { // Keep trees away from cabins
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            } while (!validPosition && attempts < maxAttempts);

            if (validPosition) {
                this.trees.push(tree);
                this.scene.add(tree);
            }
        }
    }

    addGrass() {
        // Create a single grass blade geometry
        const grassGeometry = new THREE.PlaneGeometry(0.1, 0.3);
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b8a3b,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        // Create instanced mesh for grass
        const instancedGrass = new THREE.InstancedMesh(
            grassGeometry,
            grassMaterial,
            this.grassCount
        );

        // Create temporary objects for matrix calculations
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);

        // Place grass blades randomly
        for (let i = 0; i < this.grassCount; i++) {
            // Random position within full ground bounds
            position.x = (Math.random() - 0.5) * 950; // Slightly smaller than ground size
            position.z = (Math.random() - 0.5) * 950;
            position.y = 0.15; // Half height of grass blade

            // Random rotation around Y axis
            rotation.y = Math.random() * Math.PI;
            // Slight random tilt
            rotation.x = (Math.random() - 0.5) * 0.2;
            rotation.z = (Math.random() - 0.5) * 0.2;
            quaternion.setFromEuler(rotation);

            // Random slight scale variation
            const scaleVar = 0.8 + Math.random() * 0.4;
            scale.set(scaleVar, scaleVar, scaleVar);

            // Combine position, rotation, and scale into matrix
            matrix.compose(position, quaternion, scale);
            instancedGrass.setMatrixAt(i, matrix);
        }

        // Add grass to scene
        this.scene.add(instancedGrass);

        // Optional: Add a second layer of grass with different properties
        const tallGrassCount = 20000; // Increased from 2000
        const tallGrassGeometry = new THREE.PlaneGeometry(0.15, 0.5);
        const tallGrassMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d7a2d,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        const tallGrass = new THREE.InstancedMesh(
            tallGrassGeometry,
            tallGrassMaterial,
            tallGrassCount
        );

        for (let i = 0; i < tallGrassCount; i++) {
            position.x = (Math.random() - 0.5) * 950;
            position.z = (Math.random() - 0.5) * 950;
            position.y = 0.25;

            rotation.y = Math.random() * Math.PI;
            rotation.x = (Math.random() - 0.5) * 0.3;
            rotation.z = (Math.random() - 0.5) * 0.3;
            quaternion.setFromEuler(rotation);

            const scaleVar = 0.9 + Math.random() * 0.3;
            scale.set(scaleVar, scaleVar, scaleVar);

            matrix.compose(position, quaternion, scale);
            tallGrass.setMatrixAt(i, matrix);
        }

        this.scene.add(tallGrass);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    handleMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            // Update rotation euler instead of directly modifying camera
            this.rotation.y -= event.movementX * this.mouseSensitivity;
            this.rotation.x -= event.movementY * this.mouseSensitivity;
            
            // Limit vertical look angle
            this.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.rotation.x));
            
            // Apply rotation to camera
            this.camera.rotation.copy(this.rotation);
        }
    }

    resetKeys() {
        // Reset all movement keys and sprint state
        this.keys = {};
        this.moveDirection.set(0, 0, 0);
        this.isRunning = false;
        this.moveSpeed = this.walkSpeed;
    }

    handleMovement() {
        // Reset movement direction
        this.moveDirection.set(0, 0, 0);
        
        // Only process movement if pointer is locked
        if (!document.pointerLockElement) {
            return;
        }

        // Handle sprint with stamina check
        this.isRunning = this.keys['Shift'] && this.currentStamina > 0;
        this.moveSpeed = this.isRunning ? this.sprintSpeed : this.walkSpeed;
        
        // Calculate forward and right vectors
        const forward = new THREE.Vector3(0, 0, -1);
        const right = new THREE.Vector3(1, 0, 0);
        
        // Rotate vectors based on camera rotation
        forward.applyEuler(this.rotation);
        right.applyEuler(this.rotation);
        
        // Add movement based on key presses
        if (this.keys['w']) {
            this.moveDirection.add(forward);
        }
        if (this.keys['s']) {
            this.moveDirection.sub(forward);
        }
        if (this.keys['a']) {
            this.moveDirection.sub(right);
        }
        if (this.keys['d']) {
            this.moveDirection.add(right);
        }

        // Normalize movement vector for consistent speed in all directions
        if (this.moveDirection.length() > 0) {
            this.moveDirection.normalize();
        }

        // Store old position for collision resolution
        const oldPosition = this.camera.position.clone();
        
        // Apply movement
        this.camera.position.x += this.moveDirection.x * this.moveSpeed;
        this.camera.position.z += this.moveDirection.z * this.moveSpeed;

        // Check collisions and resolve
        if (this.checkCollisions()) {
            // If collision occurred, revert to old position
            this.camera.position.copy(oldPosition);
        }

        // Handle jumping and gravity
        this.camera.position.y += this.verticalVelocity;
        this.verticalVelocity -= this.gravity;

        // Ground collision
        if (this.camera.position.y <= 2) {
            this.camera.position.y = 2;
            this.verticalVelocity = 0;
            this.isJumping = false;
        }

        // Handle stamina drain/regen with power-up consideration
        const time = performance.now() * 0.001;
        if (this.isRunning && this.moveDirection.length() > 0) {
            if (!this.isPoweredUp) {
                // Only drain stamina if not powered up
                this.currentStamina = Math.max(0, this.currentStamina - this.staminaDrainRate * this.deltaTime);
            }
            this.lastStaminaUse = time;
        } else if (time - this.lastStaminaUse > this.staminaRegenDelay) {
            this.currentStamina = Math.min(this.maxStamina, this.currentStamina + this.staminaRegenRate * this.deltaTime);
        }
        
        // Update stamina bar
        this.staminaBar.style.width = `${(this.currentStamina / this.maxStamina) * 100}%`;
        
        // Add pulsing effect to stamina bar during power-up
        if (this.isPoweredUp) {
            const pulseIntensity = Math.sin(time * 10) * 0.3 + 0.7;
            this.staminaBar.style.boxShadow = `0 0 ${20 * pulseIntensity}px #00ffff, 0 0 ${40 * pulseIntensity}px #00ffff`;
            this.healthBar.style.boxShadow = `0 0 ${20 * pulseIntensity}px #00ff00, 0 0 ${40 * pulseIntensity}px #00ff00`;
        }
    }

    checkCollisions() {
        // Check tree collisions
        for (const tree of this.trees) {
            const treePos = tree.position;
            const dx = this.camera.position.x - treePos.x;
            const dz = this.camera.position.z - treePos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            // Tree trunk collision (adjust radius based on tree scale)
            const treeScale = tree.children[0].scale.x || 1;
            const trunkRadius = 0.3 * treeScale;
            if (distance < this.playerRadius + trunkRadius) {
                return true;
            }
        }

        // Check cabin collisions
        for (const cabin of this.cabins) {
            // Get cabin's world position and rotation
            const cabinPos = cabin.position;
            const cabinAngle = cabin.rotation.y;
            
            // Transform player position to cabin's local space
            const localX = (this.camera.position.x - cabinPos.x) * Math.cos(-cabinAngle) -
                          (this.camera.position.z - cabinPos.z) * Math.sin(-cabinAngle);
            const localZ = (this.camera.position.x - cabinPos.x) * Math.sin(-cabinAngle) +
                          (this.camera.position.z - cabinPos.z) * Math.cos(-cabinAngle);
            
            // Cabin bounds (half-sizes)
            const cabinWidth = 3;  // half of 6
            const cabinLength = 4;  // half of 8
            
            // Box collision check
            if (Math.abs(localX) < cabinWidth + this.playerRadius &&
                Math.abs(localZ) < cabinLength + this.playerRadius) {
                return true;
            }
        }

        return false;
    }

    createSky() {
        const skyVertexShader = `
            varying vec2 vUV;
            varying vec3 vWorldPosition;
            
            void main() {
                vUV = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const skyFragmentShader = `
            varying vec2 vUV;
            varying vec3 vWorldPosition;
            uniform float time;

            // Improved noise function for better cloud shapes
            float rand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 p) {
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);

                float res = mix(
                    mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
                    mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
                return res;
            }

            float fbm(vec2 p) {
                float sum = 0.0;
                float amp = 1.0;
                float freq = 1.0;
                // More octaves for more detailed clouds
                for(int i = 0; i < 6; i++) {
                    sum += noise(p * freq) * amp;
                    amp *= 0.5;
                    freq *= 2.0;
                    p += vec2(3.123, 1.121);
                }
                return sum;
            }

            void main() {
                vec3 normalizedPosition = normalize(vWorldPosition);
                
                // Adjusted height factor for lower horizon
                float heightFactor = normalizedPosition.y * 0.5 + 0.5;
                
                // Enhanced sky gradient
                vec3 skyColor = mix(
                    vec3(0.5, 0.7, 1.0),  // Horizon color (brighter)
                    vec3(0.2, 0.4, 0.8),   // Zenith color
                    pow(heightFactor, 0.7)  // Smoother gradient
                );

                // Improved cloud mapping
                vec2 cloudUV = vec2(
                    atan(normalizedPosition.x, normalizedPosition.z) / (2.0 * 3.14159) + 0.5,
                    heightFactor
                );
                
                // Multiple cloud layers with different speeds
                float cloudScale = 3.0;
                vec2 cloudPos1 = cloudUV * cloudScale + time * vec2(0.01, 0.002);
                vec2 cloudPos2 = cloudUV * cloudScale * 1.5 + time * vec2(0.015, -0.003);
                
                // Generate more detailed clouds using FBM
                float clouds1 = fbm(cloudPos1);
                float clouds2 = fbm(cloudPos2);
                
                // Combine cloud layers
                float clouds = mix(clouds1, clouds2, 0.5);
                
                // Enhanced cloud shaping
                clouds = smoothstep(0.4, 0.9, clouds);
                
                // Height-based cloud masking
                float cloudMask = smoothstep(0.0, 0.3, heightFactor) * 
                                smoothstep(1.0, 0.4, heightFactor);
                clouds *= cloudMask;
                
                // Improved cloud coloring and shading
                vec3 cloudColor = mix(
                    vec3(0.8, 0.8, 0.8),  // Cloud shadow
                    vec3(1.0, 1.0, 1.0),   // Cloud highlight
                    clouds
                );
                
                // Blend clouds with sky
                vec3 finalColor = mix(skyColor, cloudColor, clouds * 0.7);

                // Enhanced atmospheric scattering
                finalColor = mix(
                    finalColor,
                    vec3(0.7, 0.8, 1.0),
                    pow(1.0 - heightFactor, 5.0) * 0.6
                );

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        // Create larger sky dome that extends below horizon
        const skyGeometry = new THREE.SphereGeometry(1000, 60, 40);
        const skyMaterial = new THREE.ShaderMaterial({
            vertexShader: skyVertexShader,
            fragmentShader: skyFragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.sky = sky;
        this.scene.add(sky);
    }

    createSun() {
        // Create sun sphere
        const sunGeometry = new THREE.SphereGeometry(this.sunSize, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff80,
            transparent: true,
            opacity: 1
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.position.copy(this.sunPosition);
        
        // Create sun glow
        const glowGeometry = new THREE.SphereGeometry(this.sunSize * 1.2, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                viewVector: { value: new THREE.Vector3() }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying float intensity;
                void main() {
                    vec3 glow = vec3(1.0, 0.8, 0.0) * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        this.sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.sunGlow.position.copy(this.sunPosition);
        
        // Create lens flare
        const textureLoader = new THREE.TextureLoader();
        const flareTexture = textureLoader.load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU1RTg5RDc5RjBEMTExRTVCQjA0QkYxNDQ4NjI5QzE0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU1RTg5RDdBRjBEMTExRTVCQjA0QkYxNDQ4NjI5QzE0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTVFODlEN0ZGMEQ1MTFFNUJCMDRCRjE0NDg2MjlDMTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTVFODlEODBGMEQ1MTFFNUJCMDRCRjE0NDg2MjlDMTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAIAAgAAAH/4AAgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcq0qdOnUKNKnUq1qtWrWLNq3cq1q9evYMOKHUu2rNmzaNOqXcu2rdu3cP/jyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDix9Pvrz58+jTq1/Pvr379/Djy59Pv779+/jz69/Pv7///wAGKOCABBZo4IEIJqjgggw26OCDEEYo4YQUVmjhhRhmqOGGHHbo4YcghijiiCSWaOKJKKao4oostujiizDGKOOMNNZo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeT/kkw26eSTUEYp5ZRUVmnllVhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirppJRWaumlmGaq6aacdurpp6CGKuqopJZq6qmopqrqqqy26uqrsMYq66y01mrrrbjmquuuvPbq66/ABivssMQWa+yxyCar7LLMNuvss9BGK+201FZr7bXYZqvtttx26+234IYr7rjklmvuueimq+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEEcs8cQUV2zx/8UYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLLfs8sswxyzzzDTXbPPNOOes88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt991456333nz37fffgAcu+OCEF2744YgnrvjijDfu+OOQRy755JRXbvnlmGeu+eacd+7556CHLvropJdu+umop6766qy37vrrsMcu++y012777bjnrvvuvPfu++/ABy/88MQXb/zxyCev/PLMN+/889BHL/301Fdv/fXYZ6/99tx37/334Icv/v/45Jdv/vnop6/++uy37/778Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHQAyiEIdIxCIa8YhITKISl8jEJjrxiVCMohSnSMUqWvGKWMyiFrfIxS568YtgDKMYx0jGMprxjGhMoxrXyMY2uvGNcIyjHOdIxzra8Y54zKMe98jHPvrxj4AMpCAHSchCGvKQiEykIhfJyEY68pGQjKQkJ0nJSlrykpjMpCY3yclOevIVnfzkJ0MpylGSspSmPCUqU6nKVbKyla58JSxjKctZ0rKWtrwlLnOpS1GGAAAsAAA=');
        
        const lensFlare = new THREE.Sprite(new THREE.SpriteMaterial({
            map: flareTexture,
            transparent: true,
            opacity: 0.6,
            color: 0xffff80
        }));
        lensFlare.scale.set(this.sunSize * 3, this.sunSize * 3, 1);
        this.sun.add(lensFlare);
        
        // Add directional light from sun
        const sunLight = new THREE.DirectionalLight(0xffffcc, 1.5);
        sunLight.position.copy(this.sunPosition);
        
        // Enhanced shadow settings
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;  // Increased resolution
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 1000;
        sunLight.shadow.camera.left = -500;
        sunLight.shadow.camera.right = 500;
        sunLight.shadow.camera.top = 500;
        sunLight.shadow.camera.bottom = -500;
        sunLight.shadow.bias = -0.001;  // Reduce shadow artifacts
        sunLight.shadow.normalBias = 0.05;
        sunLight.shadow.radius = 1.5;  // Softer shadows
        
        // Add subtle ambient light for indirect illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        
        this.scene.add(this.sun);
        this.scene.add(this.sunGlow);
        this.scene.add(sunLight);
        this.scene.add(ambientLight);
        
        // Store reference to update shadow position
        this.sunLight = sunLight;
    }

    createFoxes() {
        // Create regular foxes first
        const foxBody = new THREE.Group();
        
        // Body (main body)
        const bodyGeometry = new THREE.CapsuleGeometry(0.2, 0.4, 4, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd67d3e });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        // Change initial body rotation to face forward Z axis
        body.rotation.z = Math.PI / 2;
        body.rotation.y = Math.PI / 2;
        foxBody.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        // Adjust head position to match new orientation
        head.position.z = 0.3;
        head.position.y = 0.1;
        foxBody.add(head);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.05, 0.1, 4);
        const earMaterial = new THREE.MeshStandardMaterial({ color: 0xd67d3e });
        
        const earLeft = new THREE.Mesh(earGeometry, earMaterial);
        // Adjust ear positions to match new orientation
        earLeft.position.z = 0.35;
        earLeft.position.y = 0.25;
        earLeft.position.x = 0.05;
        foxBody.add(earLeft);

        const earRight = earLeft.clone();
        earRight.position.x = -0.05;
        foxBody.add(earRight);

        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.4, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xd67d3e });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        // Adjust tail position to match new orientation
        tail.position.z = -0.3;
        tail.position.y = 0.1;
        tail.rotation.x = Math.PI / 4;
        foxBody.add(tail);

        // Create companion orb with updated properties
        const orbGeometry = new THREE.SphereGeometry(0.15, 32, 32); // Made slightly smaller
        
        // Update shader for more ethereal look
        const orbVertexShader = `
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const orbFragmentShader = `
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            uniform float time;
            
            void main() {
                // Ethereal color with more pronounced animation
                vec3 baseColor = vec3(0.4, 0.7, 1.0);
                float pulseIntensity = 0.15 * sin(time * 1.5) + 0.85;
                
                // Enhanced fresnel effect
                vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
                
                // Combine effects with more glow
                vec3 finalColor = baseColor * pulseIntensity;
                finalColor += vec3(0.4, 0.7, 1.0) * fresnel * 1.5;
                
                gl_FragColor = vec4(finalColor, 0.7 + fresnel * 0.3);
            }
        `;

        const orbMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                cameraPosition: { value: this.camera.position }
            },
            vertexShader: orbVertexShader,
            fragmentShader: orbFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.companionOrb = new THREE.Mesh(orbGeometry, orbMaterial);
        this.companionOrb.position.set(2, 1.5, 2); // Float higher than the fox

        // Brighter point light
        const orbLight = new THREE.PointLight(0x4080ff, 1, 8);
        orbLight.intensity = 0.8;
        this.companionOrb.add(orbLight);

        this.companionOrb.userData = {
            hovering: 0,
            baseHeight: 2.0,
            wanderAngleX: Math.random() * Math.PI * 2,
            wanderAngleY: Math.random() * Math.PI * 2,
            wanderAngleZ: Math.random() * Math.PI * 2,
            wanderRadius: 1.2,
            wanderSpeed: {
                x: 0.0003 + Math.random() * 0.0002,
                y: 0.0004 + Math.random() * 0.0002,
                z: 0.0005 + Math.random() * 0.0002
            },
            noiseOffset: {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                z: Math.random() * 1000
            },
            maxDistance: 3.0 // Maximum distance from player
        };

        this.scene.add(this.companionOrb);

        // Create regular foxes
        for (let i = 0; i < this.foxCount; i++) {
            const fox = foxBody.clone();
            
            // Random starting position
            fox.position.set(
                (Math.random() - 0.5) * 800,
                0.3, // Height above ground
                (Math.random() - 0.5) * 800
            );
            
            // Add movement properties
            fox.userData = {
                velocity: new THREE.Vector3(),
                targetPosition: new THREE.Vector3(),
                speed: 0.05 + Math.random() * 0.05,
                updateTime: 0,
                isDead: false
            };
            
            this.foxes.push(fox);
            this.scene.add(fox);
        }
    }

    updateFoxes() {
        const time = performance.now() * 0.001;
        
        // Check for fox respawns
        for (let i = this.deadFoxes.length - 1; i >= 0; i--) {
            const deadFox = this.deadFoxes[i];
            if (time - deadFox.deathTime >= this.foxRespawnTime) {
                // Calculate respawn position
                const respawnOffset = new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    0,
                    (Math.random() - 0.5) * 20
                );
                const respawnPosition = deadFox.position.clone().add(respawnOffset);
                
                // Create small explosion at respawn point
                this.createSmallExplosion(respawnPosition, 0xd67d3e); // Brown explosion for foxes
                
                // Create new fox
                const fox = this.createFox();
                fox.position.copy(respawnPosition);
                this.foxes.push(fox);
                this.scene.add(fox);
                
                this.deadFoxes.splice(i, 1);
            }
        }
        
        // Update companion orb
        if (this.companionOrb) {
            const data = this.companionOrb.userData;
            
            // Update wander angles with different frequencies
            data.wanderAngleX += Math.sin(time * 0.3 + data.noiseOffset.x) * data.wanderSpeed.x;
            data.wanderAngleY += Math.sin(time * 0.4 + data.noiseOffset.y) * data.wanderSpeed.y;
            data.wanderAngleZ += Math.sin(time * 0.5 + data.noiseOffset.z) * data.wanderSpeed.z;
            
            // Calculate 3D wandering position
            const wanderX = Math.cos(data.wanderAngleX) * data.wanderRadius;
            const wanderY = Math.sin(data.wanderAngleY) * data.wanderRadius * 0.5; // Less vertical movement
            const wanderZ = Math.sin(data.wanderAngleZ) * data.wanderRadius;
            
            // Calculate target position relative to player
            const targetPosition = new THREE.Vector3(
                this.camera.position.x + wanderX,
                this.camera.position.y + data.baseHeight + wanderY,
                this.camera.position.z + wanderZ
            );
            
            // Smooth current position towards target
            this.companionOrb.position.lerp(targetPosition, 0.02);
            
            // Keep orb within maximum distance
            const distanceToPlayer = this.companionOrb.position.distanceTo(this.camera.position);
            if (distanceToPlayer > data.maxDistance) {
                const direction = this.companionOrb.position.clone()
                    .sub(this.camera.position)
                    .normalize()
                    .multiplyScalar(data.maxDistance);
                this.companionOrb.position.copy(this.camera.position).add(direction);
            }

            // Update shader uniforms
            this.companionOrb.material.uniforms.time.value = time;
            this.companionOrb.material.uniforms.cameraPosition.value = this.camera.position;

            // Update light intensity based on distance from center position
            const light = this.companionOrb.children[0];
            const distanceFromCenter = Math.sqrt(wanderX * wanderX + wanderY * wanderY + wanderZ * wanderZ);
            const intensityVariation = 0.3 * (distanceFromCenter / data.wanderRadius);
            light.intensity = 0.7 + Math.sin(time * 1.5) * 0.2 + intensityVariation;
        }

        // Update regular foxes
        this.foxes.forEach(fox => {
            const data = fox.userData;
            
            // Update target position every few seconds
            if (time - data.updateTime > 5) {
                data.targetPosition.set(
                    (Math.random() - 0.5) * 800,
                    0.3,
                    (Math.random() - 0.5) * 800
                );
                data.updateTime = time;
            }
            
            // Calculate direction to target
            const direction = new THREE.Vector3()
                .subVectors(data.targetPosition, fox.position)
                .normalize();
            
            // Update velocity with some smoothing
            data.velocity.lerp(direction.multiplyScalar(data.speed), 0.02);
            
            // Update position
            fox.position.add(data.velocity);
            
            // Update rotation to face movement direction
            if (data.velocity.length() > 0.001) {
                // Fix rotation calculation
                const angle = Math.atan2(-data.velocity.x, -data.velocity.z);
                fox.rotation.y = angle;
            }
            
            // Animate tail and head slightly
            const tailWag = Math.sin(time * 10) * 0.2;
            fox.children[3].rotation.x = Math.PI / 4 + tailWag; // Updated tail animation axis
            fox.children[1].rotation.x = Math.sin(time * 5) * 0.1; // Updated head animation axis
        });
    }

    animate() {
        if (this.showingIntro) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        const currentTime = performance.now() * 0.001;
        this.deltaTime = currentTime - (this.lastTime || currentTime);
        this.lastTime = currentTime;

        requestAnimationFrame(() => this.animate());
        
        if (this.isDead) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        // Camera shake when hurt
        if (this.damageShakeIntensity > 0) {
            this.camera.position.x += (Math.random() - 0.5) * this.damageShakeIntensity * 0.2;
            this.camera.position.y += (Math.random() - 0.5) * this.damageShakeIntensity * 0.2;
            this.camera.position.z += (Math.random() - 0.5) * this.damageShakeIntensity * 0.2;
            this.damageShakeIntensity *= 0.9;
        }

        // Update sky time
        this.time += this.timeSpeed;
        if (this.sky && this.sky.material.uniforms) {
            this.sky.material.uniforms.time.value = this.time;
        }
        
        // Update foxes
        this.updateFoxes();
        
        // Add bear updates
        this.updateBears();
        
        // Update bullets
        this.updateBullets();
        
        // Update health packs
        this.updateHealthPacks();
        
        // Update gun position and rotation
        this.updateGun();
        
        this.handleMovement();

        // Update health regeneration
        this.updateHealth();
        
        // Add hunger update
        this.updateHunger();

        // Update survival timer
        this.updateSurvivalTimer();

        this.updateBirds();

        // Update sun glow effect
        if (this.sunGlow && this.sunGlow.material.uniforms) {
            const viewVector = new THREE.Vector3().subVectors(
                this.camera.position,
                this.sunGlow.position
            );
            this.sunGlow.material.uniforms.viewVector.value = viewVector;
        }

        // Update mystic creatures
        this.updateMysticCreatures();

        this.updateExplosions();

        // Update sun light position to match sun
        if (this.sunLight) {
            this.sunLight.position.copy(this.sunPosition);
            this.sunLight.target.position.set(0, 0, 0);
            this.sunLight.target.updateMatrixWorld();
        }

        // Update player shadow
        this.updatePlayerShadow();

        // Update fire effects
        const time = performance.now() * 0.001;
        this.firePits.forEach(fire => {
            fire.material.uniforms.time.value = time;
            
            // Flicker the fire light
            const light = fire.parent.children.find(child => child instanceof THREE.PointLight);
            if (light) {
                light.intensity = 1.5 + Math.sin(time * 10) * 0.5;
            }
        });

        // Update chests
        this.updateChests();

        // Update wolves along with other entities
        this.updateWolves();

        this.renderer.render(this.scene, this.camera);
    }

    createHealthBar() {
        // Create health bar container
        const healthContainer = document.createElement('div');
        healthContainer.style.position = 'fixed';
        healthContainer.style.bottom = '20px';
        healthContainer.style.left = '20px';
        healthContainer.style.width = '200px';
        healthContainer.style.height = '20px';
        healthContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        healthContainer.style.border = '2px solid #333';
        healthContainer.style.borderRadius = '10px';

        // Create health bar
        this.healthBar = document.createElement('div');
        this.healthBar.style.width = '100%';
        this.healthBar.style.height = '100%';
        this.healthBar.style.backgroundColor = '#ff3333';
        this.healthBar.style.borderRadius = '8px';
        this.healthBar.style.transition = 'width 0.2s';

        healthContainer.appendChild(this.healthBar);
        document.body.appendChild(healthContainer);
    }

    createAmmoBar() {
        // Create ammo bar container
        const ammoContainer = document.createElement('div');
        ammoContainer.style.position = 'fixed';
        ammoContainer.style.bottom = '50px';
        ammoContainer.style.left = '20px';
        ammoContainer.style.width = '200px';
        ammoContainer.style.height = '20px';
        ammoContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        ammoContainer.style.border = '2px solid #333';
        ammoContainer.style.borderRadius = '10px';

        // Create ammo bar
        this.ammoBar = document.createElement('div');
        this.ammoBar.style.width = '100%';
        this.ammoBar.style.height = '100%';
        this.ammoBar.style.backgroundColor = '#c0c0c0';
        this.ammoBar.style.borderRadius = '8px';
        this.ammoBar.style.transition = 'width 0.2s';

        ammoContainer.appendChild(this.ammoBar);
        document.body.appendChild(ammoContainer);
    }

    createStaminaBar() {
        // Create stamina bar container
        const staminaContainer = document.createElement('div');
        staminaContainer.style.position = 'fixed';
        staminaContainer.style.bottom = '80px'; // Position above ammo bar
        staminaContainer.style.left = '20px';
        staminaContainer.style.width = '200px';
        staminaContainer.style.height = '20px';
        staminaContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        staminaContainer.style.border = '2px solid #333';
        staminaContainer.style.borderRadius = '10px';

        // Create stamina bar
        this.staminaBar = document.createElement('div');
        this.staminaBar.style.width = '100%';
        this.staminaBar.style.height = '100%';
        this.staminaBar.style.backgroundColor = '#3498db'; // Blue color
        this.staminaBar.style.borderRadius = '8px';
        this.staminaBar.style.transition = 'width 0.2s';

        staminaContainer.appendChild(this.staminaBar);
        document.body.appendChild(staminaContainer);
    }

    createHungerBar() {
        // Create hunger bar container
        const hungerContainer = document.createElement('div');
        hungerContainer.style.position = 'fixed';
        hungerContainer.style.bottom = '110px'; // Position above stamina bar
        hungerContainer.style.left = '20px';
        hungerContainer.style.width = '200px';
        hungerContainer.style.height = '20px';
        hungerContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        hungerContainer.style.border = '2px solid #333';
        hungerContainer.style.borderRadius = '10px';

        // Create hunger bar
        this.hungerBar = document.createElement('div');
        this.hungerBar.style.width = '100%';
        this.hungerBar.style.height = '100%';
        this.hungerBar.style.backgroundColor = '#8B4513'; // Brown color
        this.hungerBar.style.borderRadius = '8px';
        this.hungerBar.style.transition = 'width 0.2s';

        hungerContainer.appendChild(this.hungerBar);
        document.body.appendChild(hungerContainer);
    }

    updateAmmoText() {
        this.ammoText.textContent = `${this.currentAmmo} / ${this.maxAmmo}`;
    }

    reload() {
        if (this.isReloading) return;
        
        // Allow reload even with full ammo
        this.isReloading = true;
        
        // Start reload animation
        this.reloadAnimation.active = true;
        this.reloadAnimation.startTime = performance.now() * 0.001;
        
        // Visual feedback - make ammo bar pulse
        this.ammoBar.style.transition = 'background-color 0.5s';
        this.ammoBar.style.backgroundColor = '#808080';
        
        setTimeout(() => {
            // Reset ammo
            this.currentAmmo = this.maxAmmo;
            
            // Update ammo bar
            this.ammoBar.style.width = '100%';
            this.ammoBar.style.backgroundColor = '#c0c0c0';
            
            // Reset reload states
            this.isReloading = false;
            
            // Make sure animation is complete
            this.reloadAnimation.active = false;
            this.gun.rotation.x = 0;
            this.gun.rotation.z = 0;
        }, this.reloadTime * 1000);
    }

    createBears() {
        // Clear existing bears
        this.bears.forEach(bear => this.scene.remove(bear));
        this.bears = [];
        this.deadBears = [];

        // Spawn bears near cabins
        this.cabins.forEach(cabin => {
            // Spawn 1-2 bears near each cabin
            const bearCount = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < bearCount; i++) {
                this.spawnBearNearTown(cabin);
            }
        });

        // Spawn remaining bears randomly in the world
        const remainingBears = Math.max(0, this.bearCount - this.bears.length);
        for (let i = 0; i < remainingBears; i++) {
            this.spawnBear(this.getSpreadOutPosition());
        }
    }

    getSpreadOutPosition() {
        const minDistance = 100; // Minimum distance between bears
        let position;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            position = new THREE.Vector3(
                (Math.random() - 0.5) * 800,
                1.2,
                (Math.random() - 0.5) * 800
            );

            // Check distance from other bears
            const isTooClose = this.bears.some(bear => 
                bear.position.distanceTo(position) < minDistance
            );

            if (!isTooClose || attempts >= maxAttempts) {
                return position;
            }
            attempts++;
        } while (true);
    }

    spawnBearNearTown(cabin) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 20; // 30-50 units from cabin
        
        const position = new THREE.Vector3(
            cabin.position.x + Math.cos(angle) * distance,
            1.2,
            cabin.position.z + Math.sin(angle) * distance
        );
        
        // Check if position is valid (not too close to other bears or objects)
        let validPosition = true;
        
        // Check distance from other bears
        for (const bear of this.bears) {
            if (bear.position.distanceTo(position) < 20) {
                validPosition = false;
                break;
            }
        }
        
        if (validPosition) {
            const bear = this.createBearModel();
            bear.position.copy(position);
            
            // Initialize bear properties
            bear.userData = {
                velocity: new THREE.Vector3(),
                targetPosition: new THREE.Vector3(),
                speed: 0.15 + Math.random() * 0.05,
                updateTime: 0,
                state: 'wandering',
                attackCooldown: 0,
                attackRange: 4,
                detectionRange: 30,
                damage: 20,
                lastAttackTime: 0,
                health: 3,
                maxHealth: 3,
                isHurt: false,
                attackStage: 'approach',
                attackDistance: 3,
                retreatTime: 1.5,
                retreatDistance: 8,
                lastStateChange: 0,
                homeCabin: cabin // Track which cabin this bear is associated with
            };
            
            this.bears.push(bear);
            this.scene.add(bear);
            return bear;
        }
        
        return null;
    }

    spawnBear(position) {
        const bearBody = new THREE.Group();
        
        // Bear body - make it more visible
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 4, 8);
        const bearMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3219,
            roughness: 0.7,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bearMaterial);
        body.rotation.z = Math.PI / 2;
        bearBody.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const head = new THREE.Mesh(headGeometry, bearMaterial);
        head.position.z = 0.6;
        head.position.y = 0.2;
        bearBody.add(head);

        // Ears
        const earGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const earLeft = new THREE.Mesh(earGeometry, bearMaterial);
        earLeft.position.z = 0.7;
        earLeft.position.y = 0.5;
        earLeft.position.x = 0.2;
        bearBody.add(earLeft);

        const earRight = earLeft.clone();
        earRight.position.x = -0.2;
        bearBody.add(earRight);

        const bear = bearBody.clone();
        bear.scale.set(2, 2, 2);
        bear.position.copy(position);

        bear.userData = {
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.15 + Math.random() * 0.05,
            updateTime: 0,
            state: 'wandering',
            attackCooldown: 0,
            attackRange: 4,
            detectionRange: 30,
            damage: 20,
            lastAttackTime: 0,
            health: 3,
            maxHealth: 3,
            isHurt: false,
            attackStage: 'approach',
            attackDistance: 3,
            retreatTime: 1.5,
            retreatDistance: 8,
            lastStateChange: 0
        };

        this.bears.push(bear);
        this.scene.add(bear);
        return bear;
    }

    killBear(bear) {
        // Store death position and original scale
        const deathPosition = bear.position.clone();
        const originalScale = bear.scale.clone();
        
        // Add to dead bears list
        this.deadBears.push({
            deathTime: performance.now() * 0.001,
            position: deathPosition,
            scale: originalScale
        });

        // Death animation
        const startRotation = bear.rotation.z;
        const startY = bear.position.y;
        const animationDuration = 1.0; // 1 second
        const startTime = performance.now() * 0.001;
        
        const deathAnimation = () => {
            const currentTime = performance.now() * 0.001;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Rotate and fall
            bear.rotation.z = startRotation + (Math.PI / 2) * progress;
            bear.position.y = startY * (1 - progress);
            
            // Add slight sideways tilt
            bear.rotation.x = Math.sin(progress * Math.PI) * 0.2;
            
            if (progress < 1) {
                requestAnimationFrame(deathAnimation);
            } else {
                // Fade out effect
                const fadeOut = () => {
                    bear.traverse(child => {
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity -= 0.05;
                        }
                    });
                    
                    if (bear.children[0].material.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.scene.remove(bear);
                        this.bears = this.bears.filter(b => b !== bear);
                    }
                };
                fadeOut();
            }
        };
        deathAnimation();
    }

    updateBears() {
        const time = performance.now() * 0.001;
        
        // Check for bear respawns
        for (let i = this.deadBears.length - 1; i >= 0; i--) {
            const deadBear = this.deadBears[i];
            if (time - deadBear.deathTime >= this.bearRespawnTime) {
                // Create explosion at respawn location
                const explosion = this.createExplosion(deadBear.position);
                
                // Create new bear
                const bear = this.createBearModel();
                bear.position.copy(deadBear.position);
                bear.scale.copy(deadBear.scale);
                
                // Initialize bear properties
                bear.userData = {
                    velocity: new THREE.Vector3(),
                    targetPosition: new THREE.Vector3(),
                    speed: 0.15 + Math.random() * 0.05,
                    updateTime: 0,
                    state: 'wandering',
                    attackCooldown: 0,
                    attackRange: 4,
                    detectionRange: 30,
                    damage: 20,
                    lastAttackTime: 0,
                    health: 3,
                    maxHealth: 3,
                    isHurt: false,
                    attackStage: 'approach',
                    attackDistance: 3,
                    retreatTime: 1.5,
                    retreatDistance: 8,
                    lastStateChange: 0
                };
                
                // Add bear to scene and bears array
                this.scene.add(bear);
                this.bears.push(bear);
                
                // Remove from dead bears list
                this.deadBears.splice(i, 1);
            }
        }

        this.bears.forEach(bear => {
            const data = bear.userData;
            const distanceToPlayer = bear.position.distanceTo(this.camera.position);
            
            // Update bear state based on distance to player
            if (distanceToPlayer <= data.detectionRange) {
                if (data.state !== 'attacking') {
                    data.state = 'attacking';
                    data.attackStage = 'approach';
                    data.lastStateChange = time;
                }
            } else {
                if (data.state !== 'wandering') {
                    data.state = 'wandering';
                    data.attackStage = 'approach';
                    // Set initial wander target when switching to wandering
                    data.targetPosition.set(
                        bear.position.x + (Math.random() - 0.5) * 100,
                        1.2,
                        bear.position.z + (Math.random() - 0.5) * 100
                    );
                }
            }

            // Handle states
            if (data.state === 'attacking') {
                switch (data.attackStage) {
                    case 'approach':
                        // Move towards player until reaching attack distance
                        if (distanceToPlayer <= data.attackDistance) {
                            data.attackStage = 'attack';
                            data.lastStateChange = time;
                        } else {
                            data.targetPosition.copy(this.camera.position);
                        }
                        break;

                    case 'attack':
                        // Stay in place and attack
                        if (distanceToPlayer <= data.attackRange) {
                            if (time - data.lastAttackTime >= 1.0) {
                                this.takeDamage(data.damage);
                                data.lastAttackTime = time;
                                // Switch to retreat after attack
                                data.attackStage = 'retreat';
                                data.lastStateChange = time;
                                
                                // Calculate retreat position
                                const retreatDir = new THREE.Vector3()
                                    .subVectors(bear.position, this.camera.position)
                                    .normalize()
                                    .multiplyScalar(data.retreatDistance);
                                data.targetPosition.copy(bear.position).add(retreatDir);
                            }
                        }
                        break;

                    case 'retreat':
                        // Retreat for a set time
                        if (time - data.lastStateChange >= data.retreatTime) {
                            data.attackStage = 'approach';
                            data.lastStateChange = time;
                        }
                        break;
                }
            } else if (data.state === 'wandering') {
                // Update wander target periodically or when close to current target
                const distanceToTarget = bear.position.distanceTo(data.targetPosition);
                if (distanceToTarget < 5 || time - data.updateTime > 10) {
                    // Set new wander target
                    data.targetPosition.set(
                        bear.position.x + (Math.random() - 0.5) * 100,
                        1.2,
                        bear.position.z + (Math.random() - 0.5) * 100
                    );
                    data.updateTime = time;
                }
            }

            // Calculate direction and update position
            const direction = new THREE.Vector3()
                .subVectors(data.targetPosition, bear.position)
                .normalize();
            
            // Adjust speed based on state and stage
            let currentSpeed = data.speed;
            if (data.state === 'attacking') {
                switch (data.attackStage) {
                    case 'approach':
                        currentSpeed *= 1.5;
                        break;
                    case 'attack':
                        currentSpeed *= 0.1;
                        break;
                    case 'retreat':
                        currentSpeed *= 2.0;
                        break;
                }
            } else {
                currentSpeed *= 0.5; // Slower wandering speed
            }
            
            data.velocity.lerp(direction.multiplyScalar(currentSpeed), 0.05);
            bear.position.add(data.velocity);
            
            // Update rotation
            if (data.velocity.length() > 0.001) {
                const angle = Math.atan2(-data.velocity.x, -data.velocity.z);
                bear.rotation.y = angle;
            }

            // Animate based on state
            const walkCycle = Math.sin(time * 5) * 0.1;
            bear.children[1].rotation.x = walkCycle;
            
            if (data.state === 'attacking') {
                switch (data.attackStage) {
                    case 'attack':
                        bear.children[1].rotation.x -= Math.sin(time * 20) * 0.3;
                        break;
                    case 'retreat':
                        bear.children[1].rotation.x = Math.sin(time * 8) * 0.15;
                        break;
                }
            }

            // If bear has a home cabin, stay relatively close to it
            if (data.homeCabin && data.state === 'wandering') {
                const distanceToCabin = bear.position.distanceTo(data.homeCabin.position);
                if (distanceToCabin > 70) { // If too far from cabin
                    // Set new target closer to cabin
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 30 + Math.random() * 20;
                    data.targetPosition.set(
                        data.homeCabin.position.x + Math.cos(angle) * distance,
                        1.2,
                        data.homeCabin.position.z + Math.sin(angle) * distance
                    );
                    data.updateTime = performance.now() * 0.001;
                }
            }
        });
    }

    createBearModel() {
        const bearBody = new THREE.Group();
        
        // Bear body - make it more visible
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 4, 8);
        const bearMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a3219,
            roughness: 0.7,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bearMaterial);
        body.rotation.z = Math.PI / 2;
        bearBody.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const head = new THREE.Mesh(headGeometry, bearMaterial);
        head.position.z = 0.6;
        head.position.y = 0.2;
        bearBody.add(head);

        // Ears
        const earGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const earLeft = new THREE.Mesh(earGeometry, bearMaterial);
        earLeft.position.z = 0.7;
        earLeft.position.y = 0.5;
        earLeft.position.x = 0.2;
        bearBody.add(earLeft);

        const earRight = earLeft.clone();
        earRight.position.x = -0.2;
        bearBody.add(earRight);

        // Set initial scale
        bearBody.scale.set(2, 2, 2);

        // Enable shadows for bear parts
        body.castShadow = true;
        body.receiveShadow = true;
        head.castShadow = true;
        head.receiveShadow = true;
        earLeft.castShadow = true;
        earLeft.receiveShadow = true;
        earRight.castShadow = true;
        earRight.receiveShadow = true;

        return bearBody;
    }

    createDamageOverlay() {
        // Create persistent damage overlay
        this.damageOverlay = document.createElement('div');
        this.damageOverlay.style.position = 'fixed';
        this.damageOverlay.style.top = '0';
        this.damageOverlay.style.left = '0';
        this.damageOverlay.style.width = '100%';
        this.damageOverlay.style.height = '100%';
        this.damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0)';
        this.damageOverlay.style.pointerEvents = 'none';
        this.damageOverlay.style.transition = 'background-color 0.2s';
        this.damageOverlay.style.zIndex = '1000';
        document.body.appendChild(this.damageOverlay);
    }

    createSurvivalTimer() {
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.style.position = 'fixed';
        this.timerDisplay.style.top = '20px';
        this.timerDisplay.style.right = '20px';
        this.timerDisplay.style.color = '#fff';
        this.timerDisplay.style.fontFamily = 'Arial, sans-serif';
        this.timerDisplay.style.fontSize = '24px';
        this.timerDisplay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(this.timerDisplay);
    }

    updateSurvivalTimer() {
        if (!this.isDead) {
            this.survivalTime = (performance.now() * 0.001) - this.startTime;
            const minutes = Math.floor(this.survivalTime / 60);
            const seconds = Math.floor(this.survivalTime % 60);
            this.timerDisplay.textContent = `Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    createRespawnScreen() {
        this.respawnScreen = document.createElement('div');
        this.respawnScreen.style.position = 'fixed';
        this.respawnScreen.style.top = '0';
        this.respawnScreen.style.left = '0';
        this.respawnScreen.style.width = '100%';
        this.respawnScreen.style.height = '100%';
        this.respawnScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.respawnScreen.style.display = 'none';
        this.respawnScreen.style.flexDirection = 'column';
        this.respawnScreen.style.alignItems = 'center';
        this.respawnScreen.style.justifyContent = 'center';
        this.respawnScreen.style.color = 'white';
        this.respawnScreen.style.fontFamily = 'Arial, sans-serif';
        this.respawnScreen.style.zIndex = '2000';
        
        const deathMessage = document.createElement('h1');
        deathMessage.textContent = 'YOU DIED';
        deathMessage.style.color = '#ff0000';
        deathMessage.style.fontSize = '120px';
        deathMessage.style.fontWeight = 'bold';
        deathMessage.style.textShadow = '0 0 20px #ff0000, 0 0 40px #ff0000';
        deathMessage.style.letterSpacing = '10px';
        deathMessage.style.marginBottom = '40px';
        deathMessage.style.animation = 'pulse 2s infinite';
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        const survivalTimeDisplay = document.createElement('h2');
        survivalTimeDisplay.style.fontSize = '36px';
        survivalTimeDisplay.style.marginBottom = '40px';
        survivalTimeDisplay.style.color = '#ddd';
        
        const respawnButton = document.createElement('button');
        respawnButton.textContent = 'Respawn';
        respawnButton.style.padding = '20px 40px';
        respawnButton.style.fontSize = '28px';
        respawnButton.style.backgroundColor = '#ff3333';
        respawnButton.style.border = 'none';
        respawnButton.style.borderRadius = '5px';
        respawnButton.style.color = 'white';
        respawnButton.style.cursor = 'pointer';
        respawnButton.style.transition = 'all 0.3s';
        respawnButton.style.textTransform = 'uppercase';
        respawnButton.style.letterSpacing = '2px';
        respawnButton.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        
        respawnButton.addEventListener('mouseover', () => {
            respawnButton.style.backgroundColor = '#ff6666';
            respawnButton.style.transform = 'scale(1.1)';
        });
        
        respawnButton.addEventListener('mouseout', () => {
            respawnButton.style.backgroundColor = '#ff3333';
            respawnButton.style.transform = 'scale(1)';
        });
        
        respawnButton.addEventListener('click', () => this.respawn());
        
        this.respawnScreen.appendChild(deathMessage);
        this.respawnScreen.appendChild(survivalTimeDisplay);
        this.respawnScreen.appendChild(respawnButton);
        document.body.appendChild(this.respawnScreen);

        // Store reference for updating
        this.survivalTimeDisplay = survivalTimeDisplay;
    }

    takeDamage(amount) {
        // Don't take damage if powered up
        if (this.isPoweredUp) return;
        
        if (this.isHurt || this.isDead) return;
        
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        this.healthBar.style.width = `${(this.currentHealth / this.maxHealth) * 100}%`;
        
        // Update last damage time for regen system
        this.lastDamageTime = performance.now() * 0.001;
        
        // Visual feedback
        this.isHurt = true;
        this.damageShakeIntensity = 1;
        
        // Update damage overlay
        this.damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        setTimeout(() => {
            this.damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0)';
        }, 100);

        // Check for death
        if (this.currentHealth <= 0) {
            this.die();
            return;
        }

        // Invulnerability period
        setTimeout(() => {
            this.isHurt = false;
        }, 1000);
    }

    die() {
        this.isDead = true;
        
        // Fade to red
        this.damageOverlay.style.transition = 'background-color 1s';
        this.damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        
        // Format survival time for display
        const minutes = Math.floor(this.survivalTime / 60);
        const seconds = Math.floor(this.survivalTime % 60);
        this.survivalTimeDisplay.textContent = 
            `You survived for ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Show respawn screen after fade
        setTimeout(() => {
            document.exitPointerLock();
            this.respawnScreen.style.display = 'flex';
        }, 1000);
    }

    respawn() {
        // Reset level and upgrades
        this.playerLevel = 0;
        this.updateLevelDisplay();

        // Reset all multipliers
        this.regenMultipliers = {
            health: 1,
            stamina: 1,
            hunger: 1,
            damage: 1
        };

        // Reset base stats to initial values
        this.maxHealth = 100;
        this.maxStamina = 200;
        this.hungerDrainRate = 2;
        this.bulletDamage = 1;

        // Reset current values
        this.currentHealth = this.maxHealth;
        this.currentStamina = this.maxStamina;
        this.currentHunger = this.maxHunger;
        this.currentGold = 0;

        // Update all bars
        this.healthBar.style.width = '100%';
        this.staminaBar.style.width = '100%';
        this.hungerBar.style.width = '100%';
        this.goldBar.style.width = '0%';
        
        // Reset position
        this.camera.position.set(0, 2, 5);
        this.rotation.set(0, 0, 0);
        this.camera.rotation.copy(this.rotation);
        
        // Reset movement
        this.moveDirection.set(0, 0, 0);
        this.verticalVelocity = 0;
        this.isJumping = false;
        
        // Clear visual effects
        this.damageOverlay.style.transition = 'background-color 0.2s';
        this.damageOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0)';
        this.damageShakeIntensity = 0;
        
        // Hide respawn screen
        this.respawnScreen.style.display = 'none';
        
        // Reset state
        this.isDead = false;
        this.isHurt = false;
        
        // Reset survival timer
        this.startTime = performance.now() * 0.001;
        this.survivalTime = 0;
        
        // Reset gold requirement to initial value
        this.maxGold = this.baseGoldRequirement;
        this.currentGold = 0;
        this.goldBar.style.width = '0%';
    }

    shoot() {
        const time = performance.now() * 0.001;
        if (time - this.lastShotTime < this.shootCooldown) return;
        if (this.isReloading) return;
        if (this.currentAmmo <= 0) {
            // Show reload hint when out of ammo
            this.reloadHint.style.opacity = '1';
            return;
        }
        
        // Create bullet
        const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        // Position bullet at gun muzzle
        const muzzlePosition = new THREE.Vector3(0, 0, -0.4);
        muzzlePosition.applyQuaternion(this.gun.quaternion);
        bullet.position.copy(this.gun.position).add(muzzlePosition);
        
        // Get direction camera is facing
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        // Store direction in bullet's userData
        bullet.userData = {
            velocity: direction.multiplyScalar(this.bulletSpeed),
            timeCreated: time
        };
        
        // Adjust recoil based on aiming
        this.gunRecoil = this.isAiming ? 0.05 : 0.1; // Less recoil when aiming
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
        this.lastShotTime = time;

        // Update ammo
        this.currentAmmo--;
        this.ammoBar.style.width = `${(this.currentAmmo / this.maxAmmo) * 100}%`;
        this.updateAmmoText();
        
        // Show reload hint when low on ammo
        if (this.currentAmmo <= 5) {
            this.reloadHint.style.opacity = '1';
        }
    }

    updateBullets() {
        const time = performance.now() * 0.001;
        
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Update bullet position
            bullet.position.add(bullet.userData.velocity);
            
            // Check for collisions with bears
            for (const bear of this.bears) {
                if (bear.userData.health <= 0) continue;
                const distance = bullet.position.distanceTo(bear.position);
                if (distance < 2) {
                    this.damageBear(bear);
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    return; // Exit after finding a collision
                }
            }
            
            // Check for collisions with wolves
            let wolfHit = false;
            for (const wolf of this.wolves) {
                if (wolf.userData.isHurt) continue;
                const distance = bullet.position.distanceTo(wolf.position);
                if (distance < 1) {
                    this.damageWolf(wolf);
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    wolfHit = true;
                    break;
                }
            }
            if (wolfHit) continue;
            
            // Check for collisions with foxes
            for (const fox of this.foxes) {
                if (fox.userData.isDead) continue;
                const distance = bullet.position.distanceTo(fox.position);
                if (distance < 1) {
                    this.killFox(fox);
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    return;
                }
            }

            // Check for collisions with birds
            for (const bird of this.birds) {
                if (bird.userData.isDead) continue;
                const distance = bullet.position.distanceTo(bird.position);
                if (distance < 1) {
                    this.killBird(bird);
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    return;
                }
            }
            
            // Remove bullets after 2 seconds
            if (time - bullet.userData.timeCreated > 2) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }

    damageBear(bear) {
        if (bear.userData.isHurt) return;
        
        bear.userData.health--;
        bear.userData.isHurt = true;
        
        // Visual feedback - flash bear red
        const originalMaterial = bear.children[0].material;
        bear.traverse(child => {
            if (child.material) {
                child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            }
        });
        
        // Reset material after flash
        setTimeout(() => {
            bear.traverse(child => {
                if (child.material) {
                    child.material = originalMaterial;
                }
            });
            bear.userData.isHurt = false;
        }, 100);
        
        // Check for death
        if (bear.userData.health <= 0) {
            // Restore hunger when killing a bear
            this.currentHunger = Math.min(this.maxHunger, this.currentHunger + 50);
            this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
            
            // Add gold reward for killing bear
            const goldReward = 15;  // Gold amount for killing a bear
            this.currentGold = Math.min(this.maxGold, this.currentGold + goldReward);
            this.goldBar.style.width = `${(this.currentGold / this.maxGold) * 100}%`;
            
            // Visual feedback for gold gain
            this.goldBar.style.boxShadow = '0 0 20px #FFD700';
            setTimeout(() => {
                this.goldBar.style.boxShadow = 'none';
            }, 300);
            
            // Create floating text showing gold gained
            const goldText = document.createElement('div');
            goldText.textContent = `+${goldReward} Gold`;
            goldText.style.position = 'fixed';
            goldText.style.color = '#FFD700';
            goldText.style.fontWeight = 'bold';
            goldText.style.fontSize = '20px';
            goldText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            goldText.style.transition = 'all 1s';
            goldText.style.zIndex = '1000';
            
            // Position text above gold bar
            const goldBarRect = this.goldBar.getBoundingClientRect();
            goldText.style.left = `${goldBarRect.left}px`;
            goldText.style.top = `${goldBarRect.top - 30}px`;
            
            document.body.appendChild(goldText);
            
            // Animate text floating up and fading
            setTimeout(() => {
                goldText.style.transform = 'translateY(-20px)';
                goldText.style.opacity = '0';
            }, 50);
            
            // Remove text after animation
            setTimeout(() => {
                document.body.removeChild(goldText);
            }, 1000);
            
            // Set hunger pause time
            this.hungerPauseTime = performance.now() * 0.001;
            
            // Visual feedback for hunger restoration
            this.hungerBar.style.boxShadow = '0 0 10px rgba(139, 69, 19, 0.8)';
            setTimeout(() => {
                this.hungerBar.style.boxShadow = 'none';
            }, 300);
            
            this.killBear(bear);
        }
    }

    killFox(fox) {
        if (fox.userData.isDead) return;
        fox.userData.isDead = true;
        
        // Add to dead foxes list
        this.deadFoxes.push({
            position: fox.position.clone(),
            deathTime: performance.now() * 0.001
        });
        
        // Restore hunger
        this.currentHunger = Math.min(this.maxHunger, this.currentHunger + this.foxFoodValue);
        this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
        
        // Death animation
        const startRotation = fox.rotation.z;
        const startY = fox.position.y;
        const animationDuration = 0.6; // Fastest animation
        const startTime = performance.now() * 0.001;
        
        const deathAnimation = () => {
            const currentTime = performance.now() * 0.001;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Quick spin and fall
            fox.rotation.z = startRotation + (Math.PI * 1.5) * progress;
            fox.position.y = startY * (1 - progress) + Math.sin(progress * Math.PI * 2) * 0.3;
            
            // Add tumble
            fox.rotation.x = Math.sin(progress * Math.PI * 3) * 0.4;
            
            if (progress < 1) {
                requestAnimationFrame(deathAnimation);
            } else {
                // Fade out effect
                const fadeOut = () => {
                    fox.traverse(child => {
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity -= 0.05;
                        }
                    });
                    
                    if (fox.children[0].material.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.scene.remove(fox);
                        this.foxes = this.foxes.filter(f => f !== fox);
                    }
                };
                fadeOut();
            }
        };
        deathAnimation();
    }

    createHealthPack() {
        const healthPack = new THREE.Group();
        
        // Create cross shape
        const crossGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.1);
        const crossMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        
        const horizontalPart = new THREE.Mesh(crossGeometry, crossMaterial);
        const verticalPart = new THREE.Mesh(crossGeometry, crossMaterial);
        verticalPart.rotation.z = Math.PI / 2;
        
        healthPack.add(horizontalPart);
        healthPack.add(verticalPart);
        
        // Add white border
        const borderGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.z = -0.03;
        healthPack.add(border);
        
        // Add floating animation data
        healthPack.userData = {
            spawnTime: performance.now() * 0.001,
            baseHeight: 1.0,
            rotationSpeed: 0.001
        };
        
        return healthPack;
    }

    spawnHealthPacks() {
        // Clear existing health packs
        this.healthPacks.forEach(pack => this.scene.remove(pack));
        this.healthPacks = [];
        
        // Spawn new health packs
        for (let i = 0; i < this.healthPackCount; i++) {
            const healthPack = this.createHealthPack();
            
            // Random position
            healthPack.position.set(
                (Math.random() - 0.5) * 800,
                healthPack.userData.baseHeight,
                (Math.random() - 0.5) * 800
            );
            
            this.healthPacks.push(healthPack);
            this.scene.add(healthPack);
        }
    }

    updateHealthPacks() {
        const time = performance.now() * 0.001;
        
        // Check if we need to spawn more health packs
        if (this.healthPacks.length < this.healthPackCount && 
            time - this.lastHealthPackSpawn > this.healthPackRespawnTime) {
            const healthPack = this.createHealthPack();
            healthPack.position.set(
                (Math.random() - 0.5) * 800,
                healthPack.userData.baseHeight,
                (Math.random() - 0.5) * 800
            );
            this.healthPacks.push(healthPack);
            this.scene.add(healthPack);
            this.lastHealthPackSpawn = time;
        }
        
        // Update existing health packs
        this.healthPacks.forEach(pack => {
            // Floating animation
            pack.position.y = pack.userData.baseHeight + Math.sin(time * 2) * 0.2;
            pack.rotation.y += pack.userData.rotationSpeed;
            
            // Check for collection
            const distance = pack.position.distanceTo(this.camera.position);
            if (distance < 2) {
                this.collectHealthPack(pack);
            }
        });
    }

    collectHealthPack(pack) {
        // Heal player
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + this.healthPackValue);
        this.healthBar.style.width = `${(this.currentHealth / this.maxHealth) * 100}%`;
        
        // Activate power-up effects
        this.isPoweredUp = true;
        this.powerUpEndTime = performance.now() * 0.001 + this.powerUpDuration;
        
        // Restore full stamina
        this.currentStamina = this.maxStamina;
        this.staminaBar.style.width = '100%';
        
        // Temporary sprint speed boost and hunger drain reduction
        this.sprintSpeed = this.powerUpSprintSpeed;
        this.hungerDrainRate = this.powerUpHungerDrainRate;
        
        // Visual feedback for health
        this.healthBar.style.boxShadow = '0 0 20px #00ff00, 0 0 40px #00ff00';
        
        // Visual feedback for stamina power-up
        this.staminaBar.style.boxShadow = '0 0 20px #00ffff, 0 0 40px #00ffff';
        
        // Visual feedback for hunger power-up
        this.hungerBar.style.boxShadow = '0 0 20px #8B4513, 0 0 40px #8B4513';
        
        // Remove health pack
        this.scene.remove(pack);
        this.healthPacks = this.healthPacks.filter(p => p !== pack);
        this.lastHealthPackSpawn = performance.now() * 0.001;
        
        // Restore some hunger
        this.currentHunger = Math.min(this.maxHunger, this.currentHunger + this.healthPackValue);
        this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
        
        // Set up power-up expiration
        setTimeout(() => {
            if (!this.isDead) {
                this.isPoweredUp = false;
                this.sprintSpeed = this.normalSprintSpeed;
                this.hungerDrainRate = this.normalHungerDrainRate;
                this.healthBar.style.boxShadow = 'none';
                this.staminaBar.style.boxShadow = 'none';
                this.hungerBar.style.boxShadow = 'none';
            }
        }, this.powerUpDuration * 1000);
    }

    createGun() {
        const gun = new THREE.Group();
        
        // Create gun parts
        const barrelGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.4);
        const barrelMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.8,
            roughness: 0.2
        });
        const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
        barrel.position.z = -0.2;
        gun.add(barrel);
        
        // Handle
        const handleGeometry = new THREE.BoxGeometry(0.08, 0.2, 0.1);
        const handleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.5,
            roughness: 0.5
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = -0.15;
        handle.rotation.x = Math.PI / 6;
        gun.add(handle);
        
        // Add muzzle
        const muzzleGeometry = new THREE.CylinderGeometry(0.05, 0.06, 0.05, 8);
        const muzzle = new THREE.Mesh(muzzleGeometry, barrelMaterial);
        muzzle.rotation.x = Math.PI / 2;
        muzzle.position.z = -0.4;
        gun.add(muzzle);

        this.gun = gun;
        this.scene.add(gun);
    }

    updateGun() {
        if (!this.gun) return;
        
        // Update FOV for aim transition
        const targetFOV = this.isAiming ? this.aimFOV : this.defaultFOV;
        this.currentFOV += (targetFOV - this.currentFOV) * this.aimTransitionSpeed;
        this.camera.fov = this.currentFOV;
        this.camera.updateProjectionMatrix();
        
        // Update gun position for aim transition
        const targetOffset = this.isAiming ? this.aimGunOffset : this.defaultGunOffset;
        this.gunOffset.lerp(targetOffset, this.aimTransitionSpeed);
        
        // Position gun relative to camera
        const cameraDirection = new THREE.Vector3(0, 0, -1);
        cameraDirection.applyQuaternion(this.camera.quaternion);
        
        // Apply gun position with recoil
        this.gun.position.copy(this.camera.position)
            .add(this.gunOffset.clone()
                .applyQuaternion(this.camera.quaternion))
            .add(cameraDirection.multiplyScalar(this.gunRecoil));
        
        // Reset gun rotation
        this.gun.rotation.set(0, 0, 0);
        
        // Apply reload animation
        if (this.reloadAnimation.active) {
            const time = performance.now() * 0.001;
            const animationProgress = (time - this.reloadAnimation.startTime) / this.reloadTime;
            
            // Only animate if we haven't reached the end of the reload time
            if (animationProgress <= 1.0) {
                // Create a more dramatic reload animation
                const rotationX = Math.sin(animationProgress * Math.PI) * (Math.PI / 2);
                const rotationZ = Math.sin(animationProgress * Math.PI * 2) * 0.3;
                
                this.gun.rotation.x = rotationX;
                this.gun.rotation.z = rotationZ;
                
                // Add a slight downward position offset during reload
                const verticalOffset = Math.sin(animationProgress * Math.PI) * 0.2;
                this.gun.position.y -= verticalOffset;
            } else {
                // Reset rotations when animation is complete
                this.gun.rotation.x = 0;
                this.gun.rotation.z = 0;
                this.reloadAnimation.active = false;
            }
        }
        
        // Apply camera rotation after reload animation
        const cameraRotation = new THREE.Quaternion().setFromEuler(this.camera.rotation);
        this.gun.quaternion.setFromEuler(this.gun.rotation);
        this.gun.quaternion.multiply(cameraRotation);
        
        // Apply recoil animation with reduced effect while aiming
        if (this.gunRecoil > 0) {
            const recoilDamping = this.isAiming ? 0.9 : 0.8;
            this.gunRecoil *= recoilDamping;
        }
    }

    updateHealth() {
        if (this.isDead || this.currentHealth >= this.maxHealth) return;
        
        const currentTime = performance.now() * 0.001;
        const timeSinceLastDamage = currentTime - this.lastDamageTime;
        
        // Start regenerating health after delay
        if (timeSinceLastDamage > this.healthRegenDelay) {
            const regenAmount = (this.healthRegenRate * this.deltaTime);
            this.currentHealth = Math.min(this.maxHealth, this.currentHealth + regenAmount);
            this.healthBar.style.width = `${(this.currentHealth / this.maxHealth) * 100}%`;
            
            // Add subtle visual feedback during regen
            if (this.currentHealth < this.maxHealth) {
                this.healthBar.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
            } else {
                this.healthBar.style.boxShadow = 'none';
            }
        }
    }

    updateHunger() {
        const time = performance.now() * 0.001;
        
        // Only drain hunger when moving and not powered up and not in pause period
        if (this.moveDirection.length() > 0 && 
            !this.isPoweredUp && 
            time - this.hungerPauseTime > this.hungerPauseDuration) {
            // Drain hunger over time, drain faster when sprinting
            const hungerDrainMultiplier = this.isRunning ? 1.5 : 1.0;
            this.currentHunger = Math.max(0, this.currentHunger - 
                (this.hungerDrainRate * this.deltaTime * hungerDrainMultiplier));
        }
        
        // Update hunger bar
        this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
        
        // Add pulsing effect to hunger bar during power-up
        if (this.isPoweredUp) {
            const pulseIntensity = Math.sin(time * 10) * 0.3 + 0.7;
            this.hungerBar.style.boxShadow = `0 0 ${20 * pulseIntensity}px #8B4513, 0 0 ${40 * pulseIntensity}px #8B4513`;
        }
        
        // Deal damage when starving
        if (this.currentHunger <= 0 && time - this.lastHungerDamage > this.hungerDamageInterval) {
            this.takeDamage(this.hungerDamageRate);
            this.lastHungerDamage = time;
            
            // Visual feedback for starvation
            this.hungerBar.style.boxShadow = '0 0 10px rgba(139, 69, 19, 0.5)';
            setTimeout(() => {
                if (!this.isPoweredUp) {  // Only remove glow if not powered up
                    this.hungerBar.style.boxShadow = 'none';
                }
            }, 200);
        }
    }

    createIntroScreen() {
        this.introScreen = document.createElement('div');
        this.introScreen.style.position = 'fixed';
        this.introScreen.style.top = '0';
        this.introScreen.style.left = '0';
        this.introScreen.style.width = '100%';
        this.introScreen.style.height = '100%';
        this.introScreen.style.backgroundColor = 'black';
        this.introScreen.style.display = 'flex';
        this.introScreen.style.flexDirection = 'column';
        this.introScreen.style.alignItems = 'center';
        this.introScreen.style.justifyContent = 'center';
        this.introScreen.style.zIndex = '3000';

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: scale(0.8); }
                20% { opacity: 1; transform: scale(1); }
                80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.2); }
            }
            @keyframes fadeInOutSecond {
                0% { opacity: 0; transform: translateY(20px); }
                20% { opacity: 0; transform: translateY(20px); }
                40% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        // First text
        const titleText = document.createElement('h1');
        titleText.textContent = 'Generative Survival Game!!';
        titleText.style.color = '#fff';
        titleText.style.fontSize = '64px';
        titleText.style.fontFamily = 'Arial, sans-serif';
        titleText.style.fontWeight = 'bold';
        titleText.style.textAlign = 'center';
        titleText.style.animation = 'fadeInOut 3s forwards';
        titleText.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        titleText.style.letterSpacing = '3px';

        // Second text
        const subtitleText = document.createElement('h2');
        subtitleText.textContent = 'How long can you survive???';
        subtitleText.style.color = '#ff3333';
        subtitleText.style.fontSize = '48px';
        subtitleText.style.fontFamily = 'Arial, sans-serif';
        subtitleText.style.marginTop = '20px';
        subtitleText.style.textAlign = 'center';
        subtitleText.style.animation = 'fadeInOutSecond 3s forwards';
        subtitleText.style.textShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        subtitleText.style.letterSpacing = '2px';

        this.introScreen.appendChild(titleText);
        this.introScreen.appendChild(subtitleText);
        document.body.appendChild(this.introScreen);

        // Don't show controls overlay during intro anymore
        this.controlsOverlay.style.display = 'none';
        this.controlsOverlay.style.opacity = '0';

        this.introTimer = setTimeout(() => {
            this.showingIntro = false;
            this.introScreen.style.display = 'none';
            this.init();
        }, 5000);
    }

    createBird() {
        const bird = new THREE.Group();
        
        // Bird body
        const bodyGeometry = new THREE.CapsuleGeometry(0.1, 0.2, 4, 8);
        const birdMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, birdMaterial);
        body.rotation.z = Math.PI / 2;
        bird.add(body);

        // Wings
        const wingGeometry = new THREE.PlaneGeometry(0.4, 0.2);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            side: THREE.DoubleSide
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.x = 0.2;
        bird.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.x = -0.2;
        bird.add(rightWing);

        // Add bird properties
        bird.userData = {
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.2 + Math.random() * 0.1,
            updateTime: 0,
            wingAngle: 0,
            isDead: false,
            height: 20 + Math.random() * 30 // Random height between 20-50 units
        };

        // Enable shadows for bird parts
        body.castShadow = true;
        leftWing.castShadow = true;
        rightWing.castShadow = true;

        return bird;
    }

    createBirds() {
        for (let i = 0; i < this.birdCount; i++) {
            const bird = this.createBird();
            
            // Random starting position high in the sky
            bird.position.set(
                (Math.random() - 0.5) * 800,
                bird.userData.height,
                (Math.random() - 0.5) * 800
            );
            
            this.birds.push(bird);
            this.scene.add(bird);
        }
    }

    updateBirds() {
        const time = performance.now() * 0.001;
        
        this.birds.forEach(bird => {
            if (bird.userData.isDead) return;
            
            // Update target position periodically
            if (time - bird.userData.updateTime > 5) {
                bird.userData.targetPosition.set(
                    (Math.random() - 0.5) * 800,
                    bird.userData.height,
                    (Math.random() - 0.5) * 800
                );
                bird.userData.updateTime = time;
            }
            
            // Calculate direction to target
            const direction = new THREE.Vector3()
                .subVectors(bird.userData.targetPosition, bird.position)
                .normalize();
            
            // Update velocity with smooth turning
            bird.userData.velocity.lerp(direction.multiplyScalar(bird.userData.speed), 0.02);
            
            // Update position
            bird.position.add(bird.userData.velocity);
            
            // Update rotation to face movement direction
            if (bird.userData.velocity.length() > 0.001) {
                const angle = Math.atan2(-bird.userData.velocity.x, -bird.userData.velocity.z);
                bird.rotation.y = angle;
            }
            
            // Animate wings
            bird.userData.wingAngle += 0.2;
            const wingFlap = Math.sin(bird.userData.wingAngle) * 0.5;
            bird.children[1].rotation.z = wingFlap; // Left wing
            bird.children[2].rotation.z = -wingFlap; // Right wing
        });
    }

    killBird(bird) {
        if (bird.userData.isDead) return;
        bird.userData.isDead = true;
        
        // Add to dead birds list for respawn
        this.deadBirds.push({
            position: bird.position.clone(),
            deathTime: performance.now() * 0.001
        });
        
        // Restore hunger
        this.currentHunger = Math.min(this.maxHunger, this.currentHunger + this.birdFoodValue);
        this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
        
        // Death animation with spiral fall
        const startPosition = bird.position.clone();
        const startRotation = bird.rotation.clone();
        const animationDuration = 1.2; // Longer fall animation
        const startTime = performance.now() * 0.001;
        
        const deathAnimation = () => {
            const currentTime = performance.now() * 0.001;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Spiral fall
            const spirals = 3;
            const radius = 2 * (1 - progress);
            bird.position.x = startPosition.x + Math.cos(progress * Math.PI * 2 * spirals) * radius;
            bird.position.z = startPosition.z + Math.sin(progress * Math.PI * 2 * spirals) * radius;
            bird.position.y = startPosition.y * (1 - progress);
            
            // Tumbling rotation
            bird.rotation.x = startRotation.x + progress * Math.PI * 4;
            bird.rotation.z = startRotation.z + progress * Math.PI * 3;
            
            // Wings droop
            bird.children[1].rotation.z = Math.PI / 2 * progress; // Left wing
            bird.children[2].rotation.z = -Math.PI / 2 * progress; // Right wing
            
            if (progress < 1) {
                requestAnimationFrame(deathAnimation);
            } else {
                // Fade out effect
                const fadeOut = () => {
                    bird.traverse(child => {
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity -= 0.05;
                        }
                    });
                    
                    if (bird.children[0].material.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.scene.remove(bird);
                        this.birds = this.birds.filter(b => b !== bird);
                    }
                };
                fadeOut();
            }
        };
        deathAnimation();
    }

    createFox() {
        const foxBody = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(0.2, 0.4, 4, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd67d3e });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.rotation.y = Math.PI / 2;
        foxBody.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.z = 0.3;
        head.position.y = 0.1;
        foxBody.add(head);

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.05, 0.1, 4);
        const earLeft = new THREE.Mesh(earGeometry, bodyMaterial);
        earLeft.position.z = 0.35;
        earLeft.position.y = 0.25;
        earLeft.position.x = 0.05;
        foxBody.add(earLeft);

        const earRight = earLeft.clone();
        earRight.position.x = -0.05;
        foxBody.add(earRight);

        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.05, 0.02, 0.4, 8);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.z = -0.3;
        tail.position.y = 0.1;
        tail.rotation.x = Math.PI / 4;
        foxBody.add(tail);

        // Add movement properties
        foxBody.userData = {
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.05 + Math.random() * 0.05,
            updateTime: 0,
            isDead: false
        };

        // Enable shadows for fox parts
        body.castShadow = true;
        head.castShadow = true;
        earLeft.castShadow = true;
        earRight.castShadow = true;
        tail.castShadow = true;

        return foxBody;
    }

    createMysticCreature() {
        const creature = new THREE.Group();
        
        // Create core glow using shader material
        const coreGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    vec3 pink = vec3(1.0, 0.4, 0.8);
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    float glow = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 color = mix(pink, vec3(1.0), glow) * (0.8 + pulse * 0.2);
                    gl_FragColor = vec4(color, 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        creature.add(core);
        
        // Add misty particles around core
        const particleCount = 20;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.2;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = Math.sin(angle) * radius;
            positions[i + 2] = (Math.random() - 0.5) * 0.2;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff69b4,
            size: 0.05,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        creature.add(particles);
        
        // Add point light
        const light = new THREE.PointLight(0xff69b4, 0.5, 2);
        creature.add(light);
        
        // Add movement properties
        creature.userData = {
            baseHeight: 3 + Math.random() * 4, // Random height under trees
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.02 + Math.random() * 0.02,
            updateTime: 0,
            wobbleOffset: Math.random() * Math.PI * 2,
            particleRotation: 0
        };
        
        return creature;
    }

    createMysticCreatures() {
        for (let i = 0; i < this.mysticCreatureCount; i++) {
            const creature = this.createMysticCreature();
            
            // Random starting position under tree canopy
            creature.position.set(
                (Math.random() - 0.5) * 800,
                creature.userData.baseHeight,
                (Math.random() - 0.5) * 800
            );
            
            this.mysticCreatures.push(creature);
            this.scene.add(creature);
        }
    }

    updateMysticCreatures() {
        const time = performance.now() * 0.001;
        
        this.mysticCreatures.forEach(creature => {
            const data = creature.userData;
            
            // Update target position periodically
            if (time - data.updateTime > 3) {
                data.targetPosition.set(
                    (Math.random() - 0.5) * 800,
                    data.baseHeight + (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 800
                );
                data.updateTime = time;
            }
            
            // Calculate direction to target
            const direction = new THREE.Vector3()
                .subVectors(data.targetPosition, creature.position)
                .normalize();
            
            // Update velocity with very smooth movement
            data.velocity.lerp(direction.multiplyScalar(data.speed), 0.01);
            
            // Add wobble movement
            const wobble = new THREE.Vector3(
                Math.sin(time + data.wobbleOffset) * 0.01,
                Math.cos(time * 0.7 + data.wobbleOffset) * 0.01,
                Math.sin(time * 0.5 + data.wobbleOffset) * 0.01
            );
            
            // Update position
            creature.position.add(data.velocity).add(wobble);
            
            // Rotate particles
            data.particleRotation += 0.01;
            creature.children[1].rotation.z = data.particleRotation;
            
            // Update shader uniforms
            if (creature.children[0].material.uniforms) {
                creature.children[0].material.uniforms.time.value = time;
            }
            
            // Update light intensity with subtle pulsing
            creature.children[2].intensity = 0.4 + Math.sin(time * 2 + data.wobbleOffset) * 0.1;
        });
    }

    createExplosion(position) {
        // Create particle system for explosion
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const scales = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // Random sphere distribution
            const angle = Math.random() * Math.PI * 2;
            const z = Math.random() * 2 - 1;
            const radius = Math.sqrt(1 - z * z);
            
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            // Store velocity for animation
            velocities.push(new THREE.Vector3(
                radius * Math.cos(angle) * (0.5 + Math.random()),
                z * (0.5 + Math.random()),
                radius * Math.sin(angle) * (0.5 + Math.random())
            ));
            
            scales[i] = Math.random() * 0.5 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        
        // Create bright yellow particle material with glow
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float scale;
                varying float vAlpha;
                uniform float time;
                
                void main() {
                    vAlpha = 1.0 - time * 2.0;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = scale * (30.0 - time * 20.0) * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying float vAlpha;
                
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    vec3 color = mix(vec3(1.0, 0.9, 0.5), vec3(1.0, 0.7, 0.0), d * 2.0);
                    gl_FragColor = vec4(color, vAlpha * (1.0 - d * 2.0));
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            velocities: velocities,
            startTime: performance.now() * 0.001
        };
        
        // Add point light for extra glow
        const light = new THREE.PointLight(0xffff00, 2, 10);
        light.position.copy(position);
        this.scene.add(light);
        
        // Remove light after explosion
        setTimeout(() => {
            this.scene.remove(light);
        }, 500);
        
        this.scene.add(particles);
        
        // Remove particles after animation
        setTimeout(() => {
            this.scene.remove(particles);
        }, 1000);
        
        return particles;
    }

    updateExplosions() {
        const time = performance.now() * 0.001;
        this.scene.children.forEach(child => {
            if (child instanceof THREE.Points && child.userData.velocities) {
                const positions = child.geometry.attributes.position.array;
                const velocities = child.userData.velocities;
                const elapsed = time - child.userData.startTime;
                
                // Update particle positions
                for (let i = 0; i < velocities.length; i++) {
                    positions[i * 3] += velocities[i].x * 0.1;
                    positions[i * 3 + 1] += velocities[i].y * 0.1;
                    positions[i * 3 + 2] += velocities[i].z * 0.1;
                    
                    // Add gravity effect
                    velocities[i].y -= 0.01;
                }
                
                child.geometry.attributes.position.needsUpdate = true;
                child.material.uniforms.time.value = elapsed;
            }
        });
    }

    createSmallExplosion(position, color = 0xffff00) {
        // Similar to createExplosion but with smaller parameters
        const particleCount = 50; // Fewer particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        const scales = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const z = Math.random() * 2 - 1;
            const radius = Math.sqrt(1 - z * z);
            
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            // Smaller velocities
            velocities.push(new THREE.Vector3(
                radius * Math.cos(angle) * (0.3 + Math.random() * 0.2),
                z * (0.3 + Math.random() * 0.2),
                radius * Math.sin(angle) * (0.3 + Math.random() * 0.2)
            ));
            
            scales[i] = Math.random() * 0.3 + 0.2; // Smaller particles
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(color) }
            },
            vertexShader: `
                attribute float scale;
                varying float vAlpha;
                uniform float time;
                
                void main() {
                    vAlpha = 1.0 - time * 2.0;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = scale * (20.0 - time * 15.0) * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vAlpha;
                
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    vec3 finalColor = mix(color, vec3(1.0), d * 2.0);
                    gl_FragColor = vec4(finalColor, vAlpha * (1.0 - d * 2.0));
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData = {
            velocities: velocities,
            startTime: performance.now() * 0.001
        };
        
        // Smaller, shorter-lived light
        const light = new THREE.PointLight(color, 1, 5);
        light.position.copy(position);
        this.scene.add(light);
        
        setTimeout(() => {
            this.scene.remove(light);
        }, 300);
        
        this.scene.add(particles);
        
        setTimeout(() => {
            this.scene.remove(particles);
        }, 800);
        
        return particles;
    }

    createCabin() {
        const cabin = new THREE.Group();
        
        // Create main cabin body
        const bodyGeometry = new THREE.BoxGeometry(6, 4, 8);
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, woodMaterial);
        body.position.y = 2;
        cabin.add(body);
        
        // Create roof
        const roofGeometry = new THREE.ConeGeometry(5, 3, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x4A2811,
            roughness: 0.8
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5.5;
        roof.rotation.y = Math.PI / 4;
        cabin.add(roof);
        
        // Add door
        const doorGeometry = new THREE.PlaneGeometry(1.2, 2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x4A2811,
            roughness: 1
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.5, 4.01);
        cabin.add(door);
        
        // Add windows
        const windowGeometry = new THREE.PlaneGeometry(1, 1);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaff,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x444444
        });
        
        // Add two windows on front
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-2, 2.5, 4.01);
        cabin.add(window1);
        
        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(2, 2.5, 4.01);
        cabin.add(window2);
        
        // Add chimney
        const chimneyGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const chimney = new THREE.Mesh(chimneyGeometry, woodMaterial);
        chimney.position.set(2, 6.5, -2);
        cabin.add(chimney);
        
        // Enable shadows for all cabin parts
        body.castShadow = true;
        body.receiveShadow = true;
        roof.castShadow = true;
        roof.receiveShadow = true;
        door.castShadow = true;
        door.receiveShadow = true;
        window1.castShadow = true;
        window1.receiveShadow = true;
        window2.castShadow = true;
        window2.receiveShadow = true;
        chimney.castShadow = true;
        chimney.receiveShadow = true;
        
        return cabin;
    }

    createCabins() {
        // Create cabins with minimum spacing
        for (let i = 0; i < this.cabinCount; i++) {
            const cabin = this.createCabin();
            
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 100; // Increased from 50
            
            do {
                let x = (Math.random() - 0.5) * 700;
                let z = (Math.random() - 0.5) * 700;
                
                // Keep away from spawn
                if (Math.sqrt(x * x + z * z) < 100) {
                    continue;
                }
                
                cabin.position.set(x, 0, z);
                validPosition = true;
                
                // Check distance from other cabins (reduced minimum distance)
                for (const otherCabin of this.cabins) {
                    const dx = cabin.position.x - otherCabin.position.x;
                    const dz = cabin.position.z - otherCabin.position.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    if (distance < 30 || distance > 100) { // Keep cabins between 30-100 units apart
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            } while (!validPosition && attempts < maxAttempts);

            if (validPosition) {
                cabin.rotation.y = Math.random() * Math.PI * 2;
                this.cabins.push(cabin);
                this.scene.add(cabin);
            }
        }

        // Create paths between nearby cabins
        for (let i = 0; i < this.cabins.length; i++) {
            for (let j = i + 1; j < this.cabins.length; j++) {
                const cabin1 = this.cabins[i];
                const cabin2 = this.cabins[j];
                const distance = cabin1.position.distanceTo(cabin2.position);
                
                // Only create paths between cabins that are close enough
                if (distance < 60) {
                    const path = this.createPath(cabin1.position, cabin2.position);
                    this.paths.push(path);
                    this.scene.add(path);
                }
            }
        }

        // Clear areas around paths for trees
        this.pathClearings = this.paths.map(path => {
            const start = new THREE.Vector3();
            const end = new THREE.Vector3();
            path.geometry.computeBoundingBox();
            path.geometry.boundingBox.getCenter(start);
            start.applyMatrix4(path.matrixWorld);
            return {
                position: start,
                width: path.geometry.parameters.width + 4 // Path width plus clearance
            };
        });
    }

    createPlayerShadow() {
        const shadowGeometry = new THREE.PlaneGeometry(0.8, 1.6); // Smaller, more player-sized
        const shadowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                opacity: { value: 0.7 }  // More visible
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float opacity;
                varying vec2 vUv;
                void main() {
                    // Simpler, more visible silhouette
                    float body = smoothstep(0.2, 0.8, 1.0 - length((vUv - vec2(0.5, 0.5)) * vec2(2.0, 1.0)));
                    float head = smoothstep(0.2, 0.8, 1.0 - length((vUv - vec2(0.5, 0.8)) * vec2(1.5, 1.5)));
                    float gun = step(0.45, vUv.x) * step(vUv.x, 0.9) * step(0.4, vUv.y) * step(vUv.y, 0.6);
                    
                    float shadow = max(max(body, head), gun);
                    gl_FragColor = vec4(0.0, 0.0, 0.0, shadow * opacity);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending  // Changed from MultiplyBlending
        });

        this.playerShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.playerShadow.rotation.x = -Math.PI / 2;
        this.playerShadow.position.y = 0.01;
        this.scene.add(this.playerShadow);
    }

    updatePlayerShadow() {
        if (!this.playerShadow) return;

        // Get sun direction
        const sunDirection = new THREE.Vector3()
            .subVectors(this.sunPosition, new THREE.Vector3(0, 0, 0))
            .normalize();

        // Calculate shadow position
        const shadowPos = this.camera.position.clone();
        shadowPos.y = 0.01;

        // Calculate offset based on player height and sun position
        const playerHeight = this.camera.position.y;
        const offsetMultiplier = Math.max(0.5, Math.min(1.5, playerHeight));
        const shadowOffset = new THREE.Vector3()
            .copy(sunDirection)
            .multiplyScalar(-offsetMultiplier);
        shadowPos.add(shadowOffset);

        // Update position and rotation
        this.playerShadow.position.copy(shadowPos);
        this.playerShadow.rotation.y = this.camera.rotation.y;

        // Update opacity based on sun height
        const sunHeight = this.sunPosition.y;
        const normalizedSunHeight = sunHeight / 300;
        const shadowOpacity = Math.max(0.5, Math.min(0.7, 0.7 * (1 - normalizedSunHeight * 0.5)));
        this.playerShadow.material.uniforms.opacity.value = shadowOpacity;

        // Update shadow stretch
        const shadowStretch = 1 + (1 - normalizedSunHeight) * 1.5;
        this.playerShadow.scale.x = 1;
        this.playerShadow.scale.z = shadowStretch;
    }

    createPath(startPos, endPos) {
        // Calculate path direction and length
        const direction = new THREE.Vector3().subVectors(endPos, startPos);
        const length = direction.length();
        direction.normalize();

        // Create path geometry
        const pathWidth = 2;
        const pathGeometry = new THREE.PlaneGeometry(length, pathWidth);
        const pathMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 1,
            metalness: 0,
            map: this.createPathTexture(),
            polygonOffset: true,
            polygonOffsetFactor: -0.1,  // Reduced offset
            polygonOffsetUnits: -0.1
        });

        const path = new THREE.Mesh(pathGeometry, pathMaterial);
        
        // Correct rotation for ground alignment
        path.rotation.x = Math.PI / 2;  // Changed from -Math.PI/2
        
        // Position at ground level
        path.position.set(
            startPos.x + direction.x * (length / 2),
            0.001,  // Tiny offset from ground
            startPos.z + direction.z * (length / 2)
        );
        
        // Rotate to point in correct direction
        path.rotation.y = Math.atan2(direction.x, direction.z);
        
        path.receiveShadow = true;
        return path;
    }

    createPathTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, 128, 128);

        // Add dirt texture
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            const size = Math.random() * 3 + 1;
            ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.5 + 0.5})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add some gravel
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            const size = Math.random() * 2 + 1;
            ctx.fillStyle = `rgba(169, 169, 169, ${Math.random() * 0.3 + 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(length / 2, 1);
        return texture;
    }

    createCampsite() {
        const campsite = new THREE.Group();
        
        // Make fire pit larger and more visible
        const pitGeometry = new THREE.CylinderGeometry(1.0, 1.2, 0.4, 8);  // Doubled size
        const pitMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            roughness: 0.9
        });
        const pit = new THREE.Mesh(pitGeometry, pitMaterial);
        pit.position.y = 0.2;
        pit.castShadow = true;
        pit.receiveShadow = true;
        campsite.add(pit);

        // Larger stones
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const stoneGeometry = new THREE.SphereGeometry(0.4 + Math.random() * 0.2, 4, 4);
            const stoneMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x888888,
                roughness: 0.9
            });
            const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
            stone.position.x = Math.cos(angle) * 1.4;  // Wider circle
            stone.position.z = Math.sin(angle) * 1.4;
            stone.position.y = 0.2;
            stone.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            stone.castShadow = true;
            stone.receiveShadow = true;
            campsite.add(stone);
        }

        // Larger logs
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
            const logGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 6);  // Longer logs
            const logMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x4a2f1b,
                roughness: 0.9
            });
            const log = new THREE.Mesh(logGeometry, logMaterial);
            log.position.x = Math.cos(angle) * 2.4;  // Wider circle
            log.position.z = Math.sin(angle) * 2.4;
            log.position.y = 0.2;
            log.rotation.y = angle + Math.PI/2;
            log.rotation.z = Math.random() * 0.2;
            log.castShadow = true;
            log.receiveShadow = true;
            campsite.add(log);
        }

        // Larger, more visible fire effect
        const fireGeometry = new THREE.BufferGeometry();
        const fireCount = 200;  // More particles
        const firePositions = new Float32Array(fireCount * 3);
        
        for (let i = 0; i < fireCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.6;  // Wider fire
            firePositions[i] = Math.cos(angle) * radius;
            firePositions[i + 1] = 0;
            firePositions[i + 2] = Math.sin(angle) * radius;
        }
        
        fireGeometry.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));

        // Brighter fire light
        const fireLight = new THREE.PointLight(0xff6600, 3, 15);  // Stronger, wider light
        fireLight.position.set(0, 1.0, 0);
        campsite.add(fireLight);

        // Add tent
        const tentGroup = new THREE.Group();
        
        // Tent body (triangular prism shape)
        const tentGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            // Front triangle
            -1.5, 0, 1,
            1.5, 0, 1,
            0, 2, 1,
            // Back triangle
            -1.5, 0, -1,
            1.5, 0, -1,
            0, 2, -1,
            // Bottom rectangle
            -1.5, 0, 1,
            1.5, 0, 1,
            1.5, 0, -1,
            -1.5, 0, -1,
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2, // front
            5, 4, 3, // back
            0, 2, 5, 0, 5, 3, // left side
            1, 4, 5, 1, 5, 2, // right side
            6, 7, 8, 6, 8, 9  // bottom
        ]);
        
        tentGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        tentGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        tentGeometry.computeVertexNormals();
        
        const tentMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        
        const tent = new THREE.Mesh(tentGeometry, tentMaterial);
        tent.castShadow = true;
        tent.receiveShadow = true;
        
        // Position tent relative to fire pit
        tent.position.set(3, 0, 0);
        tent.rotation.y = Math.random() * Math.PI * 2;
        
        campsite.add(tent);

        return campsite;
    }

    createCampsites() {
        for (let i = 0; i < this.campsiteCount; i++) {
            const campsite = this.createCampsite();
            
            let validPosition = false;
            let attempts = 0;
            const maxAttempts = 50;
            
            do {
                let x = (Math.random() - 0.5) * 700;
                let z = (Math.random() - 0.5) * 700;
                
                // Keep away from spawn and cabins
                if (Math.sqrt(x * x + z * z) < 100) {
                    continue;
                }
                
                campsite.position.set(x, 0, z);
                validPosition = true;
                
                // Check distance from cabins
                for (const cabin of this.cabins) {
                    const distance = campsite.position.distanceTo(cabin.position);
                    if (distance < 50) { // Keep campsites away from cabins
                        validPosition = false;
                        break;
                    }
                }
                
                // Check distance from other campsites
                for (const otherCampsite of this.campsites) {
                    const distance = campsite.position.distanceTo(otherCampsite.position);
                    if (distance < 30) {
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
            } while (!validPosition && attempts < maxAttempts);

            if (validPosition) {
                campsite.rotation.y = Math.random() * Math.PI * 2;
                this.campsites.push(campsite);
                this.scene.add(campsite);
            }
        }
    }

    createGoldBar() {
        // Create gold bar container
        const goldContainer = document.createElement('div');
        goldContainer.style.position = 'fixed';
        goldContainer.style.bottom = '140px'; // Position above hunger bar
        goldContainer.style.left = '20px';
        goldContainer.style.width = '200px';
        goldContainer.style.height = '20px';
        goldContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        goldContainer.style.border = '2px solid #333';
        goldContainer.style.borderRadius = '10px';

        // Create gold bar
        this.goldBar = document.createElement('div');
        this.goldBar.style.width = '0%';
        this.goldBar.style.height = '100%';
        this.goldBar.style.backgroundColor = '#FFD700';
        this.goldBar.style.borderRadius = '8px';
        this.goldBar.style.transition = 'width 0.2s';

        goldContainer.appendChild(this.goldBar);
        document.body.appendChild(goldContainer);
    }

    createUpgradeMenu() {
        this.upgradeMenu = document.createElement('div');
        this.upgradeMenu.style.position = 'fixed';
        this.upgradeMenu.style.top = '50%';
        this.upgradeMenu.style.left = '50%';
        this.upgradeMenu.style.transform = 'translate(-50%, -50%)';
        this.upgradeMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        this.upgradeMenu.style.padding = '20px';
        this.upgradeMenu.style.borderRadius = '10px';
        this.upgradeMenu.style.display = 'none';
        this.upgradeMenu.style.color = 'white';
        this.upgradeMenu.style.zIndex = '1000';

        const title = document.createElement('h2');
        title.textContent = 'Choose Upgrade';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        this.upgradeMenu.appendChild(title);

        const upgrades = ['Health', 'Stamina', 'Hunger', 'Damage'];
        upgrades.forEach(upgrade => {
            const button = document.createElement('button');
            button.textContent = `Upgrade ${upgrade}`;
            button.style.display = 'block';
            button.style.width = '200px';
            button.style.padding = '10px';
            button.style.margin = '10px auto';
            button.style.backgroundColor = '#FFD700';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                // Check if hunger upgrade has reached its limit
                if (upgrade.toLowerCase() === 'hunger' && 
                    this.hungerDrainRate <= 1) { // 1 is half of initial rate (2)
                    button.style.backgroundColor = '#888';
                    button.style.cursor = 'not-allowed';
                    button.textContent = 'Hunger Maxed Out';
                    return;
                }
                this.applyUpgrade(upgrade.toLowerCase());
                this.upgradeMenu.style.display = 'none';
                document.exitPointerLock();
            });

            // Store button reference for hunger limit check
            if (upgrade.toLowerCase() === 'hunger') {
                this.hungerUpgradeButton = button;
            }

            this.upgradeMenu.appendChild(button);
        });

        document.body.appendChild(this.upgradeMenu);
    }

    createTownChest() {
        const chest = new THREE.Group();
        
        // Create larger chest body
        const bodyGeometry = new THREE.BoxGeometry(3, 2, 2); // Doubled size
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0.7,  // More metallic
            roughness: 0.3   // Smoother
        });
        const body = new THREE.Mesh(bodyGeometry, chestMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        chest.add(body);

        // Create larger chest lid
        const lidGeometry = new THREE.BoxGeometry(3.2, 1, 2.2);
        const lid = new THREE.Mesh(lidGeometry, chestMaterial);
        lid.position.y = 1.5;
        lid.castShadow = true;
        lid.receiveShadow = true;
        chest.add(lid);

        // Add golden decorations
        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.9,
            roughness: 0.1
        });

        // Add decorative bands
        const bandGeometry = new THREE.BoxGeometry(3.3, 0.3, 2.3);
        const band = new THREE.Mesh(bandGeometry, goldMaterial);
        band.position.y = 0.5;
        band.castShadow = true;
        chest.add(band);

        // Add larger glow effect
        const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    vec3 gold = vec3(1.0, 0.843, 0.0);
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    gl_FragColor = vec4(gold, intensity * (0.5 + pulse * 0.5));
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.scale.multiplyScalar(2);
        chest.add(glow);

        // Add stronger point light
        const light = new THREE.PointLight(0xffd700, 2, 20);
        light.position.y = 2;
        chest.add(light);

        chest.userData = {
            type: 'town',
            value: this.townChestValue,
            collected: false
        };

        return chest;
    }

    createCampsiteChest() {
        const chest = new THREE.Group();
        
        // Smaller chest for campsites
        const bodyGeometry = new THREE.BoxGeometry(1, 0.7, 0.7);
        const chestMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, chestMaterial);
        chest.add(body);

        const lidGeometry = new THREE.BoxGeometry(1.1, 0.3, 0.8);
        const lid = new THREE.Mesh(lidGeometry, chestMaterial);
        lid.position.y = 0.5;
        chest.add(lid);

        // Subtle glow
        const light = new THREE.PointLight(0xffd700, 0.5, 5);
        light.position.y = 0.5;
        chest.add(light);

        chest.userData = {
            type: 'campsite',
            value: this.campsiteChestValue,
            collected: false
        };

        return chest;
    }

    spawnChests() {
        // Find center points of cabin clusters to place town chests
        const clusterRadius = 50;  // Consider cabins within this radius as a cluster
        const processedCabins = new Set();
        
        this.cabins.forEach(cabin => {
            if (processedCabins.has(cabin)) return;
            
            // Find all cabins in this cluster
            const clusterCabins = this.cabins.filter(otherCabin => {
                if (processedCabins.has(otherCabin)) return false;
                return cabin.position.distanceTo(otherCabin.position) <= clusterRadius;
            });
            
            // Mark all cabins in cluster as processed
            clusterCabins.forEach(c => processedCabins.add(c));
            
            // Calculate cluster center
            const center = new THREE.Vector3();
            clusterCabins.forEach(c => center.add(c.position));
            center.divideScalar(clusterCabins.length);
            
            // Create a single large chest for the cluster
            const chest = this.createTownChest();
            
            // Find suitable position outside of cabins
            const angle = Math.random() * Math.PI * 2;
            const distance = clusterRadius * 0.7; // Position at 70% of cluster radius
            chest.position.set(
                center.x + Math.cos(angle) * distance,
                1.5,  // Raised higher for better visibility
                center.z + Math.sin(angle) * distance
            );
            chest.rotation.y = Math.random() * Math.PI * 2;
            
            // Make the chest larger and more prominent
            chest.scale.set(1.5, 1.5, 1.5);
            
            // Increase the glow and light intensity
            const glow = chest.children[2];
            glow.scale.multiplyScalar(1.5);
            const light = chest.children[3];
            light.intensity = 3;
            light.distance = 30;
            
            this.chests.push(chest);
            this.scene.add(chest);
        });

        // Spawn smaller chests at campsites
        this.campsites.forEach(campsite => {
            const chest = this.createCampsiteChest();
            chest.position.copy(campsite.position);
            chest.position.x += 2;
            chest.position.y = 0.35;
            this.chests.push(chest);
            this.scene.add(chest);
        });
    }

    updateChests() {
        const time = performance.now() * 0.001;

        this.chests.forEach(chest => {
            if (chest.userData.collected) return;

            // Update glow effect for town chests
            if (chest.userData.type === 'town') {
                const glow = chest.children[2];
                if (glow.material.uniforms) {
                    glow.material.uniforms.time.value = time;
                }
                
                // Animate light intensity
                const light = chest.children[3];
                light.intensity = 1 + Math.sin(time * 2) * 0.3;
            }

            // Check for collection
            const distance = chest.position.distanceTo(this.camera.position);
            if (distance < 2) {
                this.collectChest(chest);
            }
        });
    }

    collectChest(chest) {
        if (chest.userData.collected) return;

        chest.userData.collected = true;
        this.currentGold = Math.min(this.maxGold, this.currentGold + chest.userData.value);
        this.goldBar.style.width = `${(this.currentGold / this.maxGold) * 100}%`;

        // Visual feedback
        this.goldBar.style.boxShadow = '0 0 20px #FFD700';
        setTimeout(() => {
            this.goldBar.style.boxShadow = 'none';
        }, 300);

        // Create collection effect
        const particles = this.createGoldParticles(chest.position);
        
        // Remove chest after collection
        setTimeout(() => {
            this.scene.remove(chest);
            this.scene.remove(particles);
        }, 1000);

        // Check if gold meter is full
        if (this.currentGold >= this.maxGold) {
            this.showUpgradeMenu();
        }
    }

    createGoldParticles(position) {
        // Similar to createExplosion but with gold particles
        // ... (implementation similar to explosion effect but with gold colors)
    }

    showUpgradeMenu() {
        document.exitPointerLock();
        this.upgradeMenu.style.display = 'block';
    }

    applyUpgrade(type) {
        // Increment player level
        this.playerLevel++;
        this.updateLevelDisplay();
        
        // Update gold requirement for next level
        this.updateGoldRequirement();
        
        // Flash level display with new requirement
        this.levelDisplay.style.color = '#FFD700';
        this.levelDisplay.style.fontSize = '32px';
        setTimeout(() => {
            this.levelDisplay.style.color = '#fff';
            this.levelDisplay.style.fontSize = '24px';
        }, 1000);

        // Create popup showing new gold requirement
        const goldRequirementPopup = document.createElement('div');
        goldRequirementPopup.style.position = 'fixed';
        goldRequirementPopup.style.padding = '10px 20px';
        goldRequirementPopup.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
        goldRequirementPopup.style.borderRadius = '5px';
        goldRequirementPopup.style.color = 'black';
        goldRequirementPopup.style.fontWeight = 'bold';
        goldRequirementPopup.style.fontSize = '16px';
        goldRequirementPopup.style.zIndex = '1000';
        goldRequirementPopup.style.transition = 'all 1s';
        goldRequirementPopup.style.opacity = '1';
        goldRequirementPopup.textContent = `Next Level: ${this.maxGold} Gold`;

        // Position popup near gold bar
        const goldBarRect = this.goldBar.getBoundingClientRect();
        goldRequirementPopup.style.left = `${goldBarRect.right + 20}px`;
        goldRequirementPopup.style.top = `${goldBarRect.top}px`;
        document.body.appendChild(goldRequirementPopup);

        // Animate and remove popup
        setTimeout(() => {
            goldRequirementPopup.style.opacity = '0';
            goldRequirementPopup.style.transform = 'translateX(20px)';
        }, 2000);
        setTimeout(() => {
            document.body.removeChild(goldRequirementPopup);
        }, 3000);

        // Rest of existing upgrade code...
        // ... (keep existing upgrade logic)

        // Reset gold after upgrade
        this.currentGold = 0;
        this.goldBar.style.width = '0%';
    }

    updateBars() {
        // Update health bar with glow effect if recently upgraded
        const healthPercent = (this.currentHealth / this.maxHealth) * 100;
        this.healthBar.style.width = `${healthPercent}%`;
        
        const staminaPercent = (this.currentStamina / this.maxStamina) * 100;
        this.staminaBar.style.width = `${staminaPercent}%`;
        
        const hungerPercent = (this.currentHunger / this.maxHunger) * 100;
        this.hungerBar.style.width = `${hungerPercent}%`;

        // Add glow effect to recently upgraded stat
        const time = performance.now() * 0.001;
        if (time - this.upgradeFlashTime < this.upgradeFlashDuration) {
            const intensity = Math.sin(time * 5) * 0.5 + 0.5; // Pulsing effect
            const glowColor = `rgba(255, 215, 0, ${intensity})`;
            
            switch(this.lastUpgradedStat) {
                case 'health':
                    this.healthBar.style.boxShadow = `0 0 20px ${glowColor}`;
                    break;
                case 'stamina':
                    this.staminaBar.style.boxShadow = `0 0 20px ${glowColor}`;
                    break;
                case 'hunger':
                    this.hungerBar.style.boxShadow = `0 0 20px ${glowColor}`;
                    break;
                case 'damage':
                    // Flash the ammo bar for damage upgrades
                    this.ammoBar.style.boxShadow = `0 0 20px ${glowColor}`;
                    break;
            }
        } else {
            // Remove glow effects
            this.healthBar.style.boxShadow = '';
            this.staminaBar.style.boxShadow = '';
            this.hungerBar.style.boxShadow = '';
            this.ammoBar.style.boxShadow = '';
        }
    }

    updateStats(deltaTime) {
        // Apply regeneration multipliers to healing rates
        if (performance.now() * 0.001 - this.lastDamageTime > this.healthRegenDelay) {
            this.currentHealth = Math.min(this.maxHealth, 
                this.currentHealth + this.healthRegenRate * deltaTime * this.regenMultipliers.health);
        }

        if (performance.now() * 0.001 - this.lastStaminaUse > this.staminaRegenDelay) {
            this.currentStamina = Math.min(this.maxStamina, 
                this.currentStamina + this.staminaRegenRate * deltaTime * this.regenMultipliers.stamina);
        }

        // Hunger drains slower with higher regen multiplier
        if (this.moveDirection.length() > 0 && !this.isPoweredUp) {
            this.currentHunger = Math.max(0, 
                this.currentHunger - (this.hungerDrainRate * deltaTime / this.regenMultipliers.hunger));
        }

        // Update bars with potential glow effects
        this.updateBars();
    }

    updateGoldRequirement() {
        // Calculate new gold requirement based on level
        this.maxGold = Math.round(this.baseGoldRequirement * Math.pow(this.goldScalingFactor, this.playerLevel));
        
        // Update gold bar width to reflect new requirement
        this.goldBar.style.width = `${(this.currentGold / this.maxGold) * 100}%`;
    }

    createWaterTower() {
        const tower = new THREE.Group();
        
        // Create much larger tank
        const tankGeometry = new THREE.CylinderGeometry(8, 8, 12, 16);  // Doubled size
        const tankMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.7,
            roughness: 0.3
        });
        const tank = new THREE.Mesh(tankGeometry, tankMaterial);
        tank.position.y = 35; // Positioned higher
        tank.castShadow = true;
        tank.receiveShadow = true;
        tower.add(tank);

        // Create larger tank top (dome)
        const domeGeometry = new THREE.SphereGeometry(8, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeometry, tankMaterial);
        dome.position.y = 41; // Above larger tank
        dome.castShadow = true;
        dome.receiveShadow = true;
        tower.add(dome);

        // Create support legs (keep relatively thin for contrast)
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const legGeometry = new THREE.BoxGeometry(1.5, 35, 1.5); // Taller but still thin
            const legMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.5,
                roughness: 0.5
            });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            
            // Position legs at corners, wider spread
            leg.position.x = Math.cos(angle) * 6;  // Wider base
            leg.position.z = Math.sin(angle) * 6;
            leg.position.y = 17.5; // Half height of legs
            
            // Tilt legs slightly outward
            leg.rotation.x = Math.sin(angle) * 0.2;
            leg.rotation.z = Math.cos(angle) * 0.2;
            
            leg.castShadow = true;
            leg.receiveShadow = true;
            tower.add(leg);

            // Add cross supports between legs
            if (i < 3) {
                const nextAngle = ((i + 1) / 4) * Math.PI * 2;
                const dx = Math.cos(nextAngle) * 6 - Math.cos(angle) * 6;
                const dz = Math.sin(nextAngle) * 6 - Math.sin(angle) * 6;
                const length = Math.sqrt(dx * dx + dz * dz);
                
                const crossGeometry = new THREE.BoxGeometry(length, 0.75, 0.75);
                const cross = new THREE.Mesh(crossGeometry, legMaterial);
                
                // Position cross beams at different heights
                cross.position.x = Math.cos(angle + Math.PI/8) * 6;
                cross.position.z = Math.sin(angle + Math.PI/8) * 6;
                cross.position.y = 8 + (i * 8); // Stagger heights more
                
                cross.rotation.y = angle + Math.PI/4;
                cross.castShadow = true;
                cross.receiveShadow = true;
                tower.add(cross);
            }
        }

        // Add taller ladder
        const ladderGeometry = new THREE.BoxGeometry(0.4, 42, 0.4);
        const ladder = new THREE.Mesh(ladderGeometry, tankMaterial);
        ladder.position.x = 8;  // Further out due to larger tank
        ladder.position.y = 21;
        tower.add(ladder);

        // Add more ladder rungs
        for (let i = 0; i < 20; i++) {  // More rungs for taller tower
            const rungGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.2);
            const rung = new THREE.Mesh(rungGeometry, tankMaterial);
            rung.position.x = 8;
            rung.position.y = 2 + (i * 2);
            tower.add(rung);
        }

        return tower;
    }

    spawnWaterTowers() {
        // Find center points of cabin clusters (similar to chest spawning)
        const clusterRadius = 50;
        const processedCabins = new Set();
        
        this.cabins.forEach(cabin => {
            if (processedCabins.has(cabin)) return;
            
            // Find all cabins in this cluster
            const clusterCabins = this.cabins.filter(otherCabin => {
                if (processedCabins.has(otherCabin)) return false;
                return cabin.position.distanceTo(otherCabin.position) <= clusterRadius;
            });
            
            // Mark all cabins in cluster as processed
            clusterCabins.forEach(c => processedCabins.add(c));
            
            // Calculate cluster center
            const center = new THREE.Vector3();
            clusterCabins.forEach(c => center.add(c.position));
            center.divideScalar(clusterCabins.length);
            
            // Create water tower for this cluster
            const tower = this.createWaterTower();
            
            // Position tower outside the cluster
            const angle = Math.random() * Math.PI * 2;
            const distance = clusterRadius * 1.2; // Further out than chests
            tower.position.set(
                center.x + Math.cos(angle) * distance,
                0,
                center.z + Math.sin(angle) * distance
            );
            
            // Random rotation
            tower.rotation.y = Math.random() * Math.PI * 2;
            
            this.scene.add(tower);
        });
    }

    createWolf() {
        const wolf = new THREE.Group();
        
        // Wolf body - longer and leaner than bears
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
        const wolfMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4a4a4a,  // Grey color
            roughness: 0.8,
            metalness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, wolfMaterial);
        body.rotation.z = Math.PI / 2;
        wolf.add(body);

        // Head - more pointed than bear
        const headGeometry = new THREE.ConeGeometry(0.25, 0.6, 8);
        const head = new THREE.Mesh(headGeometry, wolfMaterial);
        head.position.z = 0.8;
        head.position.y = 0.1;
        head.rotation.x = -Math.PI / 2;
        wolf.add(head);

        // Ears - pointier than bear ears
        const earGeometry = new THREE.ConeGeometry(0.08, 0.2, 4);
        const earLeft = new THREE.Mesh(earGeometry, wolfMaterial);
        earLeft.position.z = 0.6;
        earLeft.position.y = 0.3;
        earLeft.position.x = 0.15;
        wolf.add(earLeft);

        const earRight = earLeft.clone();
        earRight.position.x = -0.15;
        wolf.add(earRight);

        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.6, 4);
        const tail = new THREE.Mesh(tailGeometry, wolfMaterial);
        tail.position.z = -0.7;
        tail.position.y = 0.2;
        tail.rotation.x = Math.PI / 4;
        wolf.add(tail);

        return wolf;
    }

    spawnWolves() {
        // Clear existing wolves
        this.wolves.forEach(wolf => this.scene.remove(wolf));
        this.wolves = [];
        this.deadWolves = [];

        // Spawn wolves near campsites
        this.campsites.forEach(campsite => {
            const wolfCount = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < wolfCount; i++) {
                this.spawnWolfNearCampsite(campsite);
            }
        });

        // Spawn remaining wolves in forest
        const remainingWolves = Math.max(0, this.wolfCount - this.wolves.length);
        for (let i = 0; i < remainingWolves; i++) {
            this.spawnWolfInForest();
        }
    }

    spawnWolfNearCampsite(campsite) {
        // Increase wolves per campsite
        const wolfCount = 2 + Math.floor(Math.random() * 2); // 2-3 wolves per campsite
        for (let i = 0; i < wolfCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 10; // Closer to campsite
            
            const position = new THREE.Vector3(
                campsite.position.x + Math.cos(angle) * distance,
                1.2,
                campsite.position.z + Math.sin(angle) * distance
            );
            
            if (this.isValidWolfPosition(position)) {
                const wolf = this.createWolf();
                wolf.position.copy(position);
                wolf.userData = this.createWolfData(campsite);
                this.wolves.push(wolf);
                this.scene.add(wolf);
            }
        }
    }

    isValidWolfPosition(position) {
        for (const wolf of this.wolves) {
            if (wolf.position.distanceTo(position) < 10) {
                return false;
            }
        }
        return true;
    }

    createWolfData(campsite = null) {
        return {
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.25 + Math.random() * 0.05,  // Slightly faster
            updateTime: 0,
            state: 'wandering',
            attackCooldown: 0,
            attackRange: 3.5,
            detectionRange: 30,  // Increased detection range
            damage: 15,
            lastAttackTime: 0,
            health: 2,
            maxHealth: 2,
            isHurt: false,
            attackStage: 'approach',
            attackDistance: 2.5,
            retreatTime: 0.8,  // Faster retreat
            retreatDistance: 6,
            lastStateChange: 0,
            homeCampsite: campsite
        };
    }

    spawnWolfInForest() {
        const position = this.getSpreadOutPosition();
        const wolf = this.createWolf();
        wolf.position.copy(position);
        
        wolf.userData = {
            // Same properties as campsite wolves
            velocity: new THREE.Vector3(),
            targetPosition: new THREE.Vector3(),
            speed: 0.25 + Math.random() * 0.05,
            updateTime: 0,
            state: 'wandering',
            attackCooldown: 0,
            attackRange: 3.5,
            detectionRange: 30,
            damage: 15,
            lastAttackTime: 0,
            health: 2,
            maxHealth: 2,
            isHurt: false,
            attackStage: 'approach',
            attackDistance: 2.5,
            retreatTime: 0.8,
            retreatDistance: 6,
            lastStateChange: 0
        };
        
        this.wolves.push(wolf);
        this.scene.add(wolf);
    }

    updateWolves() {
        const time = performance.now() * 0.001;
        
        this.wolves.forEach(wolf => {
            const data = wolf.userData;
            const distanceToPlayer = wolf.position.distanceTo(this.camera.position);
            
            // Update wolf state based on distance to player
            if (distanceToPlayer <= data.detectionRange) {
                if (data.state !== 'attacking') {
                    data.state = 'attacking';
                    data.attackStage = 'approach';
                    data.lastStateChange = time;
                }
            } else {
                if (data.state !== 'wandering') {
                    data.state = 'wandering';
                    data.lastStateChange = time;
                }
            }

            // Handle states
            if (data.state === 'attacking') {
                switch(data.attackStage) {
                    case 'approach':
                        if (distanceToPlayer <= data.attackDistance) {
                            data.attackStage = 'attack';
                            data.lastStateChange = time;
                        } else {
                            data.targetPosition.copy(this.camera.position);
                        }
                        break;

                    case 'attack':
                        if (distanceToPlayer <= data.attackRange && time - data.lastAttackTime >= 0.8) {
                            this.takeDamage(data.damage);
                            data.lastAttackTime = time;
                            data.attackStage = 'retreat';
                            data.lastStateChange = time;
                        }
                        break;

                    case 'retreat':
                        if (time - data.lastStateChange >= data.retreatTime) {
                            data.attackStage = 'approach';
                            data.lastStateChange = time;
                        } else {
                            const retreatDir = new THREE.Vector3()
                                .subVectors(wolf.position, this.camera.position)
                                .normalize()
                                .multiplyScalar(data.retreatDistance);
                            data.targetPosition.copy(wolf.position).add(retreatDir);
                        }
                        break;
                }
            } else if (data.state === 'wandering') {
                if (time - data.updateTime > 3) {
                    if (data.homeCampsite) {
                        // Stay closer to home campsite
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 15 + Math.random() * 10;
                        data.targetPosition.set(
                            data.homeCampsite.position.x + Math.cos(angle) * distance,
                            1.2,
                            data.homeCampsite.position.z + Math.sin(angle) * distance
                        );
                    } else {
                        // Forest wolves roam more freely
                        data.targetPosition.set(
                            wolf.position.x + (Math.random() - 0.5) * 40,
                            1.2,
                            wolf.position.z + (Math.random() - 0.5) * 40
                        );
                    }
                    data.updateTime = time;
                }
            }

            // Calculate direction and update position
            const direction = new THREE.Vector3()
                .subVectors(data.targetPosition, wolf.position)
                .normalize();
            
            // Update velocity with smooth movement
            data.velocity.lerp(direction.multiplyScalar(data.speed), 0.05);
            wolf.position.add(data.velocity);
            
            // Update rotation to face movement direction
            if (data.velocity.length() > 0.001) {
                const angle = Math.atan2(-data.velocity.x, -data.velocity.z);
                wolf.rotation.y = angle;
            }

            // Animate based on state
            const walkCycle = Math.sin(time * 8) * 0.1; // Faster animation than bears
            wolf.children[1].rotation.x = walkCycle; // Head bob
            wolf.children[4].rotation.x = Math.PI / 4 + Math.sin(time * 8) * 0.2; // Tail wag
        });

        // Handle wolf respawns
        for (let i = this.deadWolves.length - 1; i >= 0; i--) {
            const deadWolf = this.deadWolves[i];
            if (time - deadWolf.deathTime >= this.wolfRespawnTime) {
                if (Math.random() < 0.5) {
                    // Respawn near a random campsite
                    const campsite = this.campsites[Math.floor(Math.random() * this.campsites.length)];
                    this.spawnWolfNearCampsite(campsite);
                } else {
                    // Respawn in forest
                    this.spawnWolfInForest();
                }
                this.deadWolves.splice(i, 1);
            }
        }
    }

    damageWolf(wolf) {
        if (wolf.userData.isHurt) return;
        
        wolf.userData.health--;
        wolf.userData.isHurt = true;
        
        // Visual feedback - flash wolf red
        const originalMaterial = wolf.children[0].material;
        wolf.traverse(child => {
            if (child.material) {
                child.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            }
        });
        
        // Reset material after flash
        setTimeout(() => {
            wolf.traverse(child => {
                if (child.material) {
                    child.material = originalMaterial;
                }
            });
            wolf.userData.isHurt = false;
        }, 100);
        
        // Check for death
        if (wolf.userData.health <= 0) {
            // Restore hunger when killing a wolf
            this.currentHunger = Math.min(this.maxHunger, this.currentHunger + 30);
            this.hungerBar.style.width = `${(this.currentHunger / this.maxHunger) * 100}%`;
            
            // Add gold reward for killing wolf
            const goldReward = 10;  // Less gold than bears
            this.currentGold = Math.min(this.maxGold, this.currentGold + goldReward);
            this.goldBar.style.width = `${(this.currentGold / this.maxGold) * 100}%`;
            
            // Visual feedback for gold gain
            this.goldBar.style.boxShadow = '0 0 20px #FFD700';
            setTimeout(() => {
                this.goldBar.style.boxShadow = 'none';
            }, 300);
            
            // Create floating text showing gold gained
            const goldText = document.createElement('div');
            goldText.textContent = `+${goldReward} Gold`;
            goldText.style.position = 'fixed';
            goldText.style.color = '#FFD700';
            goldText.style.fontWeight = 'bold';
            goldText.style.fontSize = '20px';
            goldText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            goldText.style.transition = 'all 1s';
            goldText.style.zIndex = '1000';
            
            const goldBarRect = this.goldBar.getBoundingClientRect();
            goldText.style.left = `${goldBarRect.left}px`;
            goldText.style.top = `${goldBarRect.top - 30}px`;
            
            document.body.appendChild(goldText);
            
            setTimeout(() => {
                goldText.style.transform = 'translateY(-20px)';
                goldText.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                document.body.removeChild(goldText);
            }, 1000);
            
            // Set hunger pause time
            this.hungerPauseTime = performance.now() * 0.001;
            
            // Visual feedback for hunger restoration
            this.hungerBar.style.boxShadow = '0 0 10px rgba(139, 69, 19, 0.8)';
            setTimeout(() => {
                this.hungerBar.style.boxShadow = 'none';
            }, 300);
            
            this.killWolf(wolf);
        }
    }

    killWolf(wolf) {
        // Add to dead wolves array
        this.deadWolves.push({
            position: wolf.position.clone(),
            deathTime: performance.now() * 0.001
        });
        
        // Death animation
        const startRotation = wolf.rotation.z;
        const startY = wolf.position.y;
        const animationDuration = 0.8; // Slightly faster than bear
        const startTime = performance.now() * 0.001;
        
        const deathAnimation = () => {
            const currentTime = performance.now() * 0.001;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Rotate and fall with a slight jump
            wolf.rotation.z = startRotation + (Math.PI / 2) * progress;
            wolf.position.y = startY * (1 - progress) + Math.sin(progress * Math.PI) * 0.5;
            
            // Add dramatic roll
            wolf.rotation.x = Math.sin(progress * Math.PI * 2) * 0.3;
            
            if (progress < 1) {
                requestAnimationFrame(deathAnimation);
            } else {
                // Fade out effect
                const fadeOut = () => {
                    wolf.traverse(child => {
                        if (child.material) {
                            child.material.transparent = true;
                            child.material.opacity -= 0.05;
                        }
                    });
                    
                    if (wolf.children[0].material.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.scene.remove(wolf);
                        this.wolves = this.wolves.filter(w => w !== wolf);
                    }
                };
                fadeOut();
            }
        };
        deathAnimation();
    }
} 
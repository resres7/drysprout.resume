// Graph background script using Voronoi
document.addEventListener('DOMContentLoaded', function() {
    console.log('Graph script loaded');

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'graph-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1'; // Behind content
    canvas.style.pointerEvents = 'none'; // Don't interfere with interactions
    document.body.appendChild(canvas);
    console.log('Canvas appended');

    const ctx = canvas.getContext('2d');

    let nodes = [];
    let edges = [];
    let mouseX = 0;
    let mouseY = 0;

    // Force constants for consistent behavior
    const MAX_FORCE = 4; // Maximum force value for normalization
    const MOUSE_ATTRACTION_DISTANCE = 250; // Distance within which mouse attracts nodes
    const SPRING_FORCE = 0.02; // Spring strength for returning to original position
    const LERP_FACTOR = 0.1; // Interpolation factor for smooth movement (0.05-0.2)

    // Node configuration constants
    const NUM_NODES = 200; // Increased number of nodes
    const MIN_NODE_SIZE = 3; // Minimum node radius
    const MAX_NODE_SIZE = 5; // Maximum node radius

    // Screen margin constants (15% of screen size)
    const SCREEN_MARGIN_X = 0.15; // 15% of screen width
    const SCREEN_MARGIN_Y = 0.15; // 15% of screen height

    // Color constants
    const NODE_DEFAULT_COLOR = 'rgba(120, 100, 100, 1)'; 
    const NODE_FROM_COLOR = 'rgba(105, 153, 46, 1)';
    const NODE_TO_COLOR = 'rgba(140, 37, 14, 1)';
    const NODE_SATURATION = 70; // Higher saturation for vibrant orange-to-red
    const NODE_LIGHTNESS = 55; // Good visibility for warm colors
    const NODE_HUE_START = 25; // Starting hue (orange)
    const NODE_HUE_RANGE = 35; // Hue range (orange to light red)

    // Edge constants
    const EDGE_DEFAULT_COLOR = 'rgba(150, 150, 150, 0.4)'; 
    const EDGE_FROM_COLOR = 'rgba(73, 168, 54, 0.7)'; 
    const EDGE_TO_COLOR = 'rgba(255, 83, 31, 0.45)'; 
    const EDGE_WIDTH = 1; // Line width for edges
    const EDGE_OPACITY_MIN = 0.4; // Minimum edge opacity
    const EDGE_OPACITY_RANGE = 0.3; // Edge opacity variation range

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        // Account for potential canvas scaling
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });

    let lastTouchY = 0;
    let isScrolling = false;
    let touchStartTime = 0;

    // Track touch position for mobile devices
    document.addEventListener('touchmove', (e) => {
        // Only prevent default if we're actively interacting with the graph
        // Don't interfere with normal scrolling
        if (e.touches.length === 1 && !isScrolling) {
            const touch = e.touches[0];
            
            // Detect if user is scrolling (significant vertical movement)
            const deltaY = Math.abs(touch.clientY - lastTouchY);
            const timeSinceStart = Date.now() - touchStartTime;
            
            // If significant vertical movement in short time, likely scrolling
            if (deltaY > 10 && timeSinceStart < 200) {
                isScrolling = true;
                return;
            }
            
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            mouseX = (touch.clientX - rect.left) * scaleX;
            mouseY = (touch.clientY - rect.top) * scaleY;
            
            lastTouchY = touch.clientY;
        }
    }, { passive: true }); // Use passive listener to not block scrolling

    // Handle touch start to initialize position
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            lastTouchY = touch.clientY;
            touchStartTime = Date.now();
            isScrolling = false;
            
            // Only set mouse position if we're not at the very top of the page
            // This prevents interference with pull-to-refresh
            if (window.scrollY > 5) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                mouseX = (touch.clientX - rect.left) * scaleX;
                mouseY = (touch.clientY - rect.top) * scaleY;
            }
        }
    }, { passive: true });

    // Reset position when touch ends
    document.addEventListener('touchend', () => {
        // Move mouse position off-screen to stop attraction
        mouseX = -1000;
        mouseY = -1000;
        isScrolling = false;
    }, { passive: true });

    // Lerp function for smooth interpolation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Helper function to interpolate between two RGBA colors
    function interpolateRGBA(color1, color2, factor) {
        // Parse RGBA values from strings like "rgba(255, 140, 80, 1.0)"
        const rgba1 = color1.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
        const rgba2 = color2.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
        
        if (!rgba1 || !rgba2) return color1;
        
        const r1 = parseInt(rgba1[1]), g1 = parseInt(rgba1[2]), b1 = parseInt(rgba1[3]), a1 = parseFloat(rgba1[4] || 1);
        const r2 = parseInt(rgba2[1]), g2 = parseInt(rgba2[2]), b2 = parseInt(rgba2[3]), a2 = parseFloat(rgba2[4] || 1);
        
        const r = Math.round(lerp(r1, r2, factor));
        const g = Math.round(lerp(g1, g2, factor));
        const b = Math.round(lerp(b1, b2, factor));
        const a = lerp(a1, a2, factor);
        
        return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
    }

    // Node class
    class Node {
        constructor(x, y, radius) {
            this.x = x;
            this.y = y;
            this.originalX = x;
            this.originalY = y;
            this.radius = radius;
            this.opacity = 1.0; // Fully opaque
            this.vx = 0; // velocity x
            this.vy = 0; // velocity y
            this.mouseForceMagnitude = 0; // Track mouse attraction force
        }

        draw() {
            // Only draw nodes within 15% of screen boundaries
            const marginX = canvas.width * SCREEN_MARGIN_X;
            const marginY = canvas.height * SCREEN_MARGIN_Y;
            
            if (this.x < -marginX || this.x > canvas.width + marginX ||
                this.y < -marginY || this.y > canvas.height + marginY) {
                return; // Don't draw nodes outside the margin
            }

            // Color based on mouse force
            let fillStyle;
            if (this.mouseForceMagnitude === 0) {
                fillStyle = NODE_DEFAULT_COLOR; // Gray when no mouse force
            } else {
                // Interpolate between from and to colors based on force
                const normalizedForce = Math.min(this.mouseForceMagnitude / MAX_FORCE, 1);
                fillStyle = interpolateRGBA(NODE_FROM_COLOR, NODE_TO_COLOR, normalizedForce);
            }
            
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            // Spring force back to original position
            const springDx = this.originalX - this.x;
            const springDy = this.originalY - this.y;
            const springFx = springDx * SPRING_FORCE;
            const springFy = springDy * SPRING_FORCE;

            // Mouse attraction force
            let mouseFx = 0;
            let mouseFy = 0;
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_ATTRACTION_DISTANCE && dist > 0) {
                const mouseForce = (MOUSE_ATTRACTION_DISTANCE - dist) / MOUSE_ATTRACTION_DISTANCE * MAX_FORCE;
                mouseFx = dx / dist * mouseForce;
                mouseFy = dy / dist * mouseForce;
            }

            // Store mouse force magnitude for coloring
            this.mouseForceMagnitude = Math.sqrt(mouseFx * mouseFx + mouseFy * mouseFy);

            // Dynamic node size based on mouse distance
            if (dist >= MOUSE_ATTRACTION_DISTANCE) {
                this.radius = MIN_NODE_SIZE;
            } else {
                // Interpolate size: MIN_NODE_SIZE when far, MAX_NODE_SIZE when close
                const sizeRatio = 1 - (dist / MOUSE_ATTRACTION_DISTANCE);
                this.radius = MIN_NODE_SIZE + (MAX_NODE_SIZE - MIN_NODE_SIZE) * sizeRatio;
            }

            // Calculate desired position
            const desiredX = this.x + springFx + mouseFx;
            const desiredY = this.y + springFy + mouseFy;

            // Lerp towards desired position
            this.x = lerp(this.x, desiredX, LERP_FACTOR);
            this.y = lerp(this.y, desiredY, LERP_FACTOR);

            // No boundary constraints - allow nodes to move outside screen
        }
    }

    // Edge class
    class Edge {
        constructor(nodeIndex1, nodeIndex2) {
            this.nodeIndex1 = nodeIndex1;
            this.nodeIndex2 = nodeIndex2;
            this.opacity = Math.random() * EDGE_OPACITY_RANGE + EDGE_OPACITY_MIN;
        }

        draw() {
            const node1 = nodes[this.nodeIndex1];
            const node2 = nodes[this.nodeIndex2];
            if (node1 && node2) {
                // Check if both nodes are within drawing bounds (15% margin)
                const marginX = canvas.width * SCREEN_MARGIN_X;
                const marginY = canvas.height * SCREEN_MARGIN_Y;
                
                const node1InBounds = !(node1.x < -marginX || node1.x > canvas.width + marginX ||
                                      node1.y < -marginY || node1.y > canvas.height + marginY);
                const node2InBounds = !(node2.x < -marginX || node2.x > canvas.width + marginX ||
                                      node2.y < -marginY || node2.y > canvas.height + marginY);
                
                // Only draw edge if at least one node is visible
                if (!node1InBounds && !node2InBounds) {
                    return; // Don't draw edges where both nodes are outside bounds
                }

                // Determine edge color based on connected nodes
                const force1 = node1.mouseForceMagnitude;
                const force2 = node2.mouseForceMagnitude;
                const avgForce = (force1 + force2) / 2;
                
                let strokeStyle;
                if (avgForce === 0) {
                    strokeStyle = EDGE_DEFAULT_COLOR; // Gray when no force
                } else {
                    // Interpolate between from and to colors based on average force
                    const normalizedForce = Math.min(avgForce / MAX_FORCE, 1);
                    strokeStyle = interpolateRGBA(EDGE_FROM_COLOR, EDGE_TO_COLOR, normalizedForce);
                }
                
                ctx.strokeStyle = strokeStyle;
                ctx.lineWidth = EDGE_WIDTH;
                ctx.beginPath();
                ctx.moveTo(node1.x, node1.y);
                ctx.lineTo(node2.x, node2.y);
                ctx.stroke();
            }
        }
    }

    // Set canvas size
    function resizeCanvas() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Only resize and regenerate if size actually changed significantly
        if (Math.abs(canvas.width - newWidth) > 10 || Math.abs(canvas.height - newHeight) > 10) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            console.log('Canvas resized to', canvas.width, canvas.height);
            generateGraph();
        }
    }
    
    // Initial resize
    resizeCanvas();
    
    // Handle window resize with debouncing to prevent excessive regeneration
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 150); // Wait 150ms before resizing
    });
    
    // Handle viewport changes on mobile (address bar show/hide)
    let lastHeight = window.innerHeight;
    function handleViewportChange() {
        const currentHeight = window.innerHeight;
        const heightDiff = Math.abs(currentHeight - lastHeight);
        
        // Only resize if height change is significant (more than 50px)
        // This prevents minor changes from triggering expensive regeneration
        if (heightDiff > 50) {
            lastHeight = currentHeight;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100);
        }
    }
    
    // Listen for viewport changes (mobile browser UI changes)
    window.addEventListener('orientationchange', () => {
        setTimeout(handleViewportChange, 500); // Delay to let orientation settle
    });
    
    // Use visualViewport if available (better mobile support)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    function generateGraph() {
        console.log('Generating graph');
        nodes = [];
        edges = [];

        const numPoints = NUM_NODES; // Number of Voronoi sites
        const points = [];
        const centroids = [];

        // Generate random points (including outside screen boundaries)
        const marginX = canvas.width * SCREEN_MARGIN_X;
        const marginY = canvas.height * SCREEN_MARGIN_Y;
        const extendedWidth = canvas.width + 2 * marginX;
        const extendedHeight = canvas.height + 2 * marginY;
        
        for (let i = 0; i < numPoints; i++) {
            points.push([
                Math.random() * extendedWidth - marginX, // Range: -marginX to canvas.width + marginX
                Math.random() * extendedHeight - marginY  // Range: -marginY to canvas.height + marginY
            ]);
        }
        console.log('Points generated:', points.length);

        // Check if d3 is loaded
        if (typeof d3 === 'undefined') {
            console.error('D3 is not loaded');
            return;
        }

        // Compute Voronoi (extended to include margin areas)
        const voronoi = d3.voronoi().extent([[-marginX, -marginY], [canvas.width + marginX, canvas.height + marginY]]);
        const diagram = voronoi(points);
        console.log('Voronoi computed');

        // Get centroids of Voronoi cells
        diagram.polygons().forEach((polygon, index) => {
            if (polygon) {
                const centroid = d3.polygonCentroid(polygon);
                centroids[index] = centroid;
                const radius = Math.random() * (MAX_NODE_SIZE - MIN_NODE_SIZE) + MIN_NODE_SIZE;
                nodes.push(new Node(centroid[0], centroid[1], radius));
            }
        });
        console.log('Nodes created:', nodes.length);

        // Find neighboring sites
        const neighbors = {};
        diagram.edges.forEach(edge => {
            if (edge.left && edge.right) {
                const site1 = edge.left.index;
                const site2 = edge.right.index;
                if (!neighbors[site1]) neighbors[site1] = new Set();
                if (!neighbors[site2]) neighbors[site2] = new Set();
                neighbors[site1].add(site2);
                neighbors[site2].add(site1);
            }
        });

        // Create edges between neighboring centroids
        for (let i = 0; i < centroids.length; i++) {
            if (neighbors[i]) {
                neighbors[i].forEach(j => {
                    if (i < j) { // To avoid duplicate edges
                        edges.push(new Edge(i, j));
                    }
                });
            }
        }
        console.log('Edges created:', edges.length);
    }

    // Draw function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw edges first
        edges.forEach(edge => edge.draw());
        // Then nodes
        nodes.forEach(node => node.draw());
    }

    // Animation loop
    function animate() {
        // Update nodes
        nodes.forEach(node => node.update());
        // Draw
        draw();
        requestAnimationFrame(animate);
    }

    // Initial generation
    generateGraph();
    // Start animation
    animate();
});

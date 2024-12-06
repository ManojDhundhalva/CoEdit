import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const w = (window.innerWidth);
        const h = (window.innerHeight) * 0.9;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        renderer.shadowMap.enabled = true; // Enable shadow map
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
        containerRef.current.appendChild(renderer.domElement);

        // Camera
        const fov = 80;
        const aspect = w / h;
        const near = 0.1;
        const far = 10;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(1, 1, 2); // Adjusted position for better angle

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("white");

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.03;
        controls.enableZoom = false; // Disable zooming

        // Geometry and Materials
        const geo = new THREE.IcosahedronGeometry(1.0, 4.0);
        const mat = new THREE.MeshStandardMaterial({
            color: "#012A4A",
            flatShading: true,
            transparent: true,
            opacity: 1.0,
        });
        const wireMat = new THREE.MeshBasicMaterial({
            color: "white", // Black wireframe for better contrast
            wireframe: true,
        });
        const wireMesh = new THREE.Mesh(geo, wireMat);
        wireMesh.scale.setScalar(1.001);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.add(wireMesh);
        mesh.castShadow = true; // Allow the mesh to cast shadows
        scene.add(mesh);

        // Ground Plane to receive shadows
        const planeGeo = new THREE.PlaneGeometry(10, 10);
        const planeMat = new THREE.ShadowMaterial({ opacity: 0.3 });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2; // Rotate to horizontal
        plane.position.y = -1.5; // Position below the object
        plane.receiveShadow = true; // Allow the plane to receive shadows
        scene.add(plane);

        // Hemisphere Light (Subtle ambient light)
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
        scene.add(hemiLight);

        // Point Light (Primary light source)
        const pointLight = new THREE.AmbientLight(0xffffff, 1, 10);
        pointLight.position.set(2, 2, 3);
        scene.add(pointLight);

        // Update light position based on cursor
        const handleMouseMove = (event) => {
            const x = (event.clientX / w) * 2 - 1; // Convert to normalized device coordinates
            const y = -(event.clientY / h) * 2 + 1;

            // Update light position dynamically
            pointLight.position.set(x * 5, y * 5, 3);
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the model
            mesh.rotation.y += 0.003; // Rotate on Y-axis
            mesh.rotation.x -= 0.002; // Rotate on X-axis

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup on unmount
        return () => {
            if (containerRef.current) {
                renderer.dispose();
                controls.dispose();
                window.removeEventListener("mousemove", handleMouseMove);
                containerRef.current.removeChild(renderer.domElement);
            }
        };

    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;

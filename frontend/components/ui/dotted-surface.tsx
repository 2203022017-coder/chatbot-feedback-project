'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DottedSurface({ className, ...props }: any) {
	const { theme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<any>(null);

	useEffect(() => {
		if (!containerRef.current) return;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(0, 355, 1220);
		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		containerRef.current.appendChild(renderer.domElement);

		const geometry = new THREE.BufferGeometry();
		const positions = [];
		const colors = [];
		for (let ix = 0; ix < 40; ix++) {
			for (let iy = 0; iy < 60; iy++) {
				positions.push(ix * 150 - 3000, 0, iy * 150 - 4500);
				colors.push(0.5, 0.5, 0.5);
			}
		}
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		const material = new THREE.PointsMaterial({ size: 8, vertexColors: true, transparent: true, opacity: 0.5 });
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		const animate = () => {
			const animId = requestAnimationFrame(animate);
			const positions = geometry.attributes.position.array as any;
			let i = 0;
			for (let ix = 0; ix < 40; ix++) {
				for (let iy = 0; iy < 60; iy++) {
					positions[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}
			geometry.attributes.position.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
			sceneRef.current = { animId, renderer };
		};
		animate();
		return () => { if(sceneRef.current) cancelAnimationFrame(sceneRef.current.animId); };
	}, [theme]);

	return <div ref={containerRef} className={cn('pointer-events-none fixed inset-0 -z-10', className)} {...props} />;
}
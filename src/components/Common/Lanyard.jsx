/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Html } from '@react-three/drei';
import { Mail, Lock, User, KeyRound, Leaf } from 'lucide-react';

// Relative assets paths
import cardGLB from '../../assets/lanyard/card.glb';
import lanyard from '../../assets/lanyard/lanyard.png';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({
  position = [0, 1.2, 9.5],
  gravity = [0, -40, 0],
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  onLogin,
  onSignup,
  loading = false,
  errorMsg = '',
  setErrorMsg
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            onLogin={onLogin}
            onSignup={onSignup}
            loading={loading}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  onLogin,
  onSignup,
  loading = false,
  errorMsg = '',
  setErrorMsg
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef(),
    cardGroup = useRef();

  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();

  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardImage || lanyard);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Authentication State
  const [flipped, setFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img, rect) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    
    // Smooth lerping the 180 deg flip rotation inside Card Group
    if (cardGroup.current) {
      const targetRotationY = flipped ? Math.PI : 0;
      cardGroup.current.rotation.y = THREE.MathUtils.lerp(cardGroup.current.rotation.y, targetRotationY, 0.1);
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      
      // If focused, lock the card so it doesn't spin wildly during typing
      if (isFocused) {
        card.current?.setNextKinematicTranslation({ x: 0, y: -0.5, z: 0 });
        card.current?.setAngvel({ x: 0, y: 0, z: 0 });
      } else {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      if (setErrorMsg) setErrorMsg('Passwords do not match');
      return;
    }
    if (onSignup) onSignup(name, email, password);
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        
        {/* RigidBody locks to fixed during focused typing, otherwise dynamic or kinematic during drag */}
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : isFocused ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardGroup}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={e => (
              !isFocused && e.target.setPointerCapture(e.pointerId),
              !isFocused && drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

            {/* Front Side: LOGIN FORM */}
            <Html
              position={[0, 0.51, 0.038]}
              transform
              occlude
              distanceFactor={1.38}
              style={{
                pointerEvents: flipped ? 'none' : 'auto',
                opacity: flipped ? 0 : 1,
                transition: 'opacity 0.4s ease'
              }}
            >
              <div className="lanyard-card-container">
                <div className="lanyard-card-header">
                  <div className="lanyard-card-logo flex items-center gap-1.5 text-emerald-500 font-black">
                    <Leaf className="w-3.5 h-3.5" /> EcoEats
                  </div>
                  <div className="lanyard-card-badge">Access</div>
                </div>
                
                <h4 className="lanyard-card-title">Employee Portal</h4>
                
                {errorMsg && !flipped && (
                  <div className="text-[7.5px] text-red-400 text-center font-bold bg-red-950/30 p-1 border border-red-500/20 rounded">
                    {errorMsg}
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit} className="lanyard-form">
                  <div className="lanyard-input-group">
                    <label>Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="name@ecoeats.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <div className="lanyard-input-group">
                    <label>Password</label>
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="lanyard-submit-btn">
                    {loading ? 'Verifying...' : 'Sign In'}
                  </button>
                </form>

                <div 
                  onClick={() => { setFlipped(true); if (setErrorMsg) setErrorMsg(''); }}
                  className="lanyard-toggle-link"
                >
                  Create partner profile
                </div>
              </div>
            </Html>

            {/* Back Side: REGISTER FORM */}
            <Html
              position={[0, 0.51, -0.038]}
              rotation={[0, Math.PI, 0]}
              transform
              occlude
              distanceFactor={1.38}
              style={{
                pointerEvents: flipped ? 'auto' : 'none',
                opacity: flipped ? 1 : 0,
                transition: 'opacity 0.4s ease'
              }}
            >
              <div className="lanyard-card-container">
                <div className="lanyard-card-header">
                  <div className="lanyard-card-logo flex items-center gap-1.5 text-emerald-500 font-black">
                    <Leaf className="w-3.5 h-3.5" /> EcoEats
                  </div>
                  <div className="lanyard-card-badge">Partner</div>
                </div>

                <h4 className="lanyard-card-title">Registration</h4>

                {errorMsg && flipped && (
                  <div className="text-[7.5px] text-red-400 text-center font-bold bg-red-950/30 p-1 border border-red-500/20 rounded">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="lanyard-form">
                  <div className="lanyard-input-group">
                    <label>Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <div className="lanyard-input-group">
                    <label>Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="partner@ecoeats.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <div className="lanyard-input-group">
                    <label>Password</label>
                    <input 
                      type="password"
                      required
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <div className="lanyard-input-group">
                    <label>Confirm</label>
                    <input 
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="lanyard-input"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="lanyard-submit-btn">
                    {loading ? 'Creating...' : 'Register'}
                  </button>
                </form>

                <div 
                  onClick={() => { setFlipped(false); if (setErrorMsg) setErrorMsg(''); }}
                  className="lanyard-toggle-link"
                >
                  Already have profile? Sign In
                </div>
              </div>
            </Html>
          </group>
        </RigidBody>
      </group>
      
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
useTexture.preload(lanyard);

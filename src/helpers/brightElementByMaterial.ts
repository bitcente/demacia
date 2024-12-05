import gsap from "gsap";
import { ShaderMaterial } from "three";

export const brightElementByMaterial = ({ material, brightness = 2 }: { material: ShaderMaterial; brightness?: number }) => {
    if (!material.uniforms.u_colorFilter) return;
    gsap.to(material.uniforms.u_colorFilter.value, {
        x: brightness,
        y: brightness,
        z: brightness,
        duration: 1.5,
    });
}
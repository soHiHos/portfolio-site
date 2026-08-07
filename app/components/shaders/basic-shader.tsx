"use client"

import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

export default function BasicShader() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Animated Gradient Background */}
      <ShaderGradientCanvas 
        style={{ position: 'absolute', inset: 0, zIndex: -2 }}
        pixelDensity={1.5}
        fov={45}
      >
        <ShaderGradient
          control='query'
          urlString='https://shadergradient.co/customize?animate=on&axesHelper=off&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%234000ff&color2=%23000086&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false'
        />
      </ShaderGradientCanvas>
    </div>
  )
}

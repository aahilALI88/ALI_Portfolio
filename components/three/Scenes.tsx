"use client";

// Concrete scene components. Import them via ./index (lazy, client-only),
// never directly from server components.
import SceneCanvas from "./SceneCanvas";
import AtomsBitsCore from "./AtomsBitsCore";
import SadcGlobe from "./SadcGlobe";
import NeusEnergyBars from "./NeusEnergyBars";
import EducationStack, { type StackLevel } from "./EducationStack";
import { projectModels } from "./ProjectModels";

export function HeroScene({ className = "" }: { className?: string }) {
  return (
    <SceneCanvas
      className={className}
      camera={[0, 0, 7.5]}
      orbit={false}
      label="Interactive 3D atom surrounded by a field of data bits, representing Atoms and Bits"
    >
      <AtomsBitsCore />
    </SceneCanvas>
  );
}

export function CompanyScene({ className = "" }: { className?: string }) {
  return (
    <SceneCanvas
      className={className}
      camera={[0, 0, 7]}
      autoRotate
      autoRotateSpeed={0.8}
      label="Atoms and Bits 3D signature: an atom inside a cloud of bits. Drag to rotate."
    >
      <AtomsBitsCore scale={0.95} />
    </SceneCanvas>
  );
}

export function ProjectScene({ slug, className = "" }: { slug: string; className?: string }) {
  const model = projectModels[slug];
  if (!model) return null;
  const Model = model.component;
  return (
    <SceneCanvas
      key={slug}
      className={className}
      camera={model.camera}
      autoRotate
      autoRotateSpeed={0.5}
      label={`Interactive 3D model: ${model.hint}. Drag to rotate.`}
    >
      <Model />
    </SceneCanvas>
  );
}

export function GlobeScene({ className = "" }: { className?: string }) {
  return (
    <SceneCanvas
      className={className}
      camera={[0, 0.4, 5.6]}
      label="Interactive globe linking Gaborone to SADC partners, the IAEA in Vienna and the UK. Drag to rotate."
    >
      <SadcGlobe />
    </SceneCanvas>
  );
}

export function NeusScene({ className = "" }: { className?: string }) {
  return (
    <SceneCanvas
      className={className}
      camera={[0, 2.4, 6.4]}
      label="3D bar chart of Botswana household final energy consumption by fuel, NEUS 2022/23"
    >
      <NeusEnergyBars />
    </SceneCanvas>
  );
}

export function EducationScene({
  levels,
  active,
  onSelect,
  className = "",
}: {
  levels: StackLevel[];
  active: number | null;
  onSelect: (i: number | null) => void;
  className?: string;
}) {
  return (
    <SceneCanvas className={className} camera={[0, 1.2, 6]} label="3D stack of degrees: BEng, MBA and PhD. Hover a level.">
      <EducationStack levels={levels} active={active} onSelect={onSelect} />
    </SceneCanvas>
  );
}

export { projectModels };

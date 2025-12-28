declare module 'occt-import-js' {
  export interface OcctMesh {
    attributes: {
      position: { array: Float32Array };
      normal?: { array: Float32Array };
    };
    index: { array: Uint32Array | Uint16Array };
    name: string;
    color?: [number, number, number];
  }

  export interface OcctResult {
    meshes: OcctMesh[];
  }

  export interface OcctInstance {
    ReadStepFile(buffer: Uint8Array, params: any): OcctResult;
  }

  export default function occtimportjs(options?: any): Promise<OcctInstance>;
}


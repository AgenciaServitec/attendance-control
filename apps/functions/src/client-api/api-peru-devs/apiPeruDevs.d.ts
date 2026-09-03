interface Person {
  estado: boolean;
  mensaje: string;
  resultado: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    genero: string;
    fecha_nacimiento: string;
    codigo_verificacion: string;
  };
}

interface Company {
  estado: boolean;
  mensaje: string;
  resultado: {
    razon_social: string;
    condicion: string;
    nombre_comercial: string;
    tipo: string;
    fecha_inscripcion: string;
    estado: string;
    direccion: string;
    sistema_emision: string;
    actividad_exterior: string;
    sistema_contabilidad: string;
    fecha_emision_electronica: string;
    fecha_ple: string;
    oficio: string | null;
    actividades_economicas: {
      0: string;
      1?: string;
      2?: string;
    };
    comprobante_pago: {
      0: string;
    };
    sistema_emision_electronica: {
      0: string;
      1?: string;
    };
    padrones: {
      0: string;
    };
    departamento: string | null;
    provincia: string | null;
    distrito: string | null;
    representantes_legales: string | null;
    id: string;
  };
}

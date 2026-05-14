export type DiplomadoModulo = {
  numero: number;
  titulo: string;
  horas: number;
};

export type DiplomadoInversion = {
  inscripcion?: string;
  matricula?: string;
  planPagos?: string;
  medioPago?: string;
  cuentaBancaria?: string;
  notaTemporal?: string;
  botonInscripcionUrl?: string;
};

export type DiplomadoContenido = {
  shortname: string;
  tituloCorto: string;
  tituloLargo: string;
  resumenCorto: string;
  duracionHoras: number;
  modalidad: string;
  duracionPorModulo: string;
  tipoPrograma: string;
  publicoObjetivo: string;
  objetivos: string[];
  modulos: DiplomadoModulo[];
  metodologia: string[];
  certificacion: string[];
  beneficios: string[];
  registroAcademico?: string;
  inversion?: DiplomadoInversion;
};

export const diplomadosContenido: Record<string, DiplomadoContenido> = {
  "GAEE-UP": {
    shortname: "GAEE-UP",
    tituloCorto: "Gestión Administrativa y Estructura Empresarial",
    tituloLargo:
      "Diplomado en Gestión Administrativa y Estructura Empresarial para Unidades Productivas",
    resumenCorto:
      "Diplomado 100% virtual de 160 horas enfocado en fortalecer competencias administrativas, de seguridad social, finanzas y gestión empresarial. Modalidad modular con certificación por módulo y diploma final. Ideal para emprendedores y personal administrativo de pymes.",
    duracionHoras: 160,
    modalidad: "100% virtual (clases en vivo + contenido asincrónico)",
    duracionPorModulo:
      "Flexible: puedes tomar módulos individuales o el diplomado completo.",
    tipoPrograma:
      "Formación Académica en Educación para el Trabajo y el Desarrollo Humano (ETDH).",
    publicoObjetivo:
      "Emprendedores, dueños de unidades productivas, auxiliares administrativos, coordinadores operativos, colaboradores de pymes y todas aquellas personas que gestionan o desean fortalecer procesos administrativos, de seguridad social y organización empresarial.",
    objetivos: [
      "Diseñar y comprender la estructura funcional de una empresa o unidad productiva.",
      "Gestionar de forma eficiente los procesos administrativos diarios.",
      "Cumplir correctamente las obligaciones del Sistema de Seguridad Social colombiano.",
      "Aplicar herramientas prácticas de finanzas y control operativo.",
      "Identificar riesgos y proponer mejoras reales en la operación empresarial.",
      "Formalizar y fortalecer la sostenibilidad de tu negocio o el de tus clientes.",
    ],
    modulos: [
      { numero: 1, titulo: "Fundamentos de Estructura y Organización Empresarial", horas: 30 },
      { numero: 2, titulo: "Gestión Administrativa Aplicada", horas: 30 },
      { numero: 3, titulo: "Sistema de Seguridad Social y Obligaciones Empresariales", horas: 30 },
      { numero: 4, titulo: "Finanzas Básicas y Control Financiero para Unidades Productivas", horas: 30 },
      { numero: 5, titulo: "Emprendimiento, Formalización y Sostenibilidad Empresarial", horas: 20 },
      { numero: 6, titulo: "Taller Integrador y Proyecto Aplicado", horas: 20 },
    ],
    metodologia: [
      "40% conceptual y 60% práctico.",
      "Clases en vivo, material asincrónico, estudios de caso reales, talleres aplicados y simulaciones empresariales.",
      "Aprendizaje basado en proyectos con mentoría.",
      "Evaluación por competencias (talleres, casos prácticos y proyecto final).",
    ],
    certificacion: [
      "Certificado por módulo al aprobar el componente correspondiente.",
      "Certificado final del Diplomado al completar los 6 módulos.",
    ],
    beneficios: [
      "Formación 100% práctica y aplicable desde el primer día.",
      "Flexibilidad total: estudia a tu ritmo.",
      "Enfoque en el contexto colombiano y del Eje Cafetero.",
      "Herramientas reales para mejorar tu empresa o potenciar tu perfil profesional.",
    ],
    registroAcademico:
      "Programa registrado como: Conocimientos Académicos en Gestión Administrativa y Estructura Empresarial para Unidades Productivas, ante la Secretaría de Educación.",
    inversion: {
      inscripcion: "$150.000 COP",
      matricula: "$1.500.000 COP",
      planPagos: "Pagos mensuales de $500.000 COP.",
      medioPago:
        "Transferencia bancaria a las cuentas de la empresa. Después de realizar el pago, envía el comprobante a info@secampus.com para confirmar tu cupo.",
      cuentaBancaria: "Bancolombia · Cuenta de ahorros · xxxxxxxxxxxx",
      notaTemporal:
        "Datos bancarios temporales mientras se actualiza la información oficial.",
    },
  },
};

export function getDiplomadoContenido(
  shortname: string
): DiplomadoContenido | null {
  if (!shortname) return null;
  return diplomadosContenido[shortname.toUpperCase()] ?? null;
}

export function listDiplomadosContenido(): DiplomadoContenido[] {
  return Object.values(diplomadosContenido);
}

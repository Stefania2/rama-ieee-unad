import { googleLogout } from '@react-oauth/google';

const API_URL = import.meta.env.VITE_API_URL || '';

const MOCK_PROYECTOS = [
  { id: 1, capitulo: 'AESS', nombre: 'Telemetría para Picosatélites', descripcion: 'Sistema de telemetría para CubeSats orientado a misiones educativas.', lider: 'Carlos Mendoza', estado: 'ACTIVO', avance: 65, fecha_inicio: '2025-01-15', fecha_fin: '2025-12-20', presupuesto: 8500000, link_drive: '' },
  { id: 2, capitulo: 'WIE', nombre: 'Mentorías STEM para Niñas', descripcion: 'Programa de mentorías en ciencia y tecnología para estudiantes de colegio.', lider: 'Laura Ramírez', estado: 'ACTIVO', avance: 40, fecha_inicio: '2025-03-01', fecha_fin: '2025-11-30', presupuesto: 3200000, link_drive: '' },
  { id: 3, capitulo: 'CS', nombre: 'Plataforma de Algoritmos', descripcion: 'Plataforma web interactiva para aprender y practicar algoritmos computacionales.', lider: 'Andrés Torres', estado: 'FINALIZADO', avance: 100, fecha_inicio: '2024-06-01', fecha_fin: '2025-05-15', presupuesto: 12000000, link_drive: '' },
  { id: 4, capitulo: 'AESS', nombre: 'Estación Meteorológica IoT', descripcion: 'Estación meteorológica de bajo costo con sensores IoT para monitoreo ambiental.', lider: 'Diana Rojas', estado: 'ACTIVO', avance: 25, fecha_inicio: '2025-05-01', fecha_fin: '2026-04-30', presupuesto: 5600000, link_drive: '' },
  { id: 5, capitulo: 'WIE', nombre: 'Talleres de Robótica Educativa', descripcion: 'Talleres prácticos de robótica para fomentar vocaciones STEAM en jóvenes.', lider: 'Valentina Gómez', estado: 'PLANEADO', avance: 0, fecha_inicio: '2025-08-01', fecha_fin: '2026-06-30', presupuesto: 4500000, link_drive: '' },
  { id: 6, capitulo: 'CS', nombre: 'Sistema de Recomendación ML', descripcion: 'Motor de recomendaciones basado en machine learning para contenido académico.', lider: 'Felipe Ortiz', estado: 'ACTIVO', avance: 55, fecha_inicio: '2025-02-01', fecha_fin: '2025-10-30', presupuesto: 9200000, link_drive: '' },
];

const MOCK_EVENTOS = [
  { id: 1, capitulo: 'AESS', nombre: 'Lanzamiento de Globos Sonda', fecha: '2025-07-15', lugar: 'Campus UNAD', descripcion: 'Prueba de lanzamiento de globos sonda con sensores atmosféricos.' },
  { id: 2, capitulo: 'WIE', nombre: 'Día de la Mujer en la Ingeniería', fecha: '2025-06-23', lugar: 'Auditorio UNAD', descripcion: 'Conferencias y paneles con mujeres líderes en ingeniería.' },
  { id: 3, capitulo: 'CS', nombre: 'Hackathon de Programación', fecha: '2025-08-10', lugar: 'Laboratorio de Cómputo', descripcion: 'Competencia de programación de 24 horas con desafíos algorítmicos.' },
  { id: 4, capitulo: 'AESS', nombre: 'Taller de Propulsión', fecha: '2025-09-05', lugar: 'Taller de Ingeniería', descripcion: 'Taller práctico sobre principios de propulsión de cohetes.' },
];

const MOCK_MIEMBROS = [
  { email: 'stefania@unad.edu.co', nombre: 'Stefania Aguilar', rol: 'ADMIN', capitulo: 'GLOBAL' },
  { email: 'carlos@unad.edu.co', nombre: 'Carlos Mendoza', rol: 'LIDER', capitulo: 'AESS' },
  { email: 'laura@unad.edu.co', nombre: 'Laura Ramírez', rol: 'LIDER', capitulo: 'WIE' },
  { email: 'andres@unad.edu.co', nombre: 'Andrés Torres', rol: 'LIDER', capitulo: 'CS' },
  { email: 'diana@unad.edu.co', nombre: 'Diana Rojas', rol: 'MIEMBRO', capitulo: 'AESS' },
  { email: 'valentina@unad.edu.co', nombre: 'Valentina Gómez', rol: 'MIEMBRO', capitulo: 'WIE' },
  { email: 'felipe@unad.edu.co', nombre: 'Felipe Ortiz', rol: 'MIEMBRO', capitulo: 'CS' },
  { email: 'maria@unad.edu.co', nombre: 'María Torres', rol: 'MIEMBRO', capitulo: 'AESS' },
  { email: 'juan@unad.edu.co', nombre: 'Juan Pérez', rol: 'MIEMBRO', capitulo: 'WIE' },
  { email: 'catalina@unad.edu.co', nombre: 'Catalina Silva', rol: 'MIEMBRO', capitulo: 'CS' },
];

let nextId = 7;

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getProyectos() {
  await delay();
  const stored = localStorage.getItem('ieee_proyectos');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  return [...MOCK_PROYECTOS];
}

export async function createProyecto(data) {
  await delay();
  const proyectos = await getProyectos();
  const nuevo = { ...data, id: nextId++ };
  proyectos.push(nuevo);
  localStorage.setItem('ieee_proyectos', JSON.stringify(proyectos));
  return nuevo;
}

export async function updateProyecto(id, data) {
  await delay();
  const proyectos = await getProyectos();
  const idx = proyectos.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Proyecto no encontrado');
  proyectos[idx] = { ...proyectos[idx], ...data };
  localStorage.setItem('ieee_proyectos', JSON.stringify(proyectos));
  return proyectos[idx];
}

export async function deleteProyecto(id) {
  await delay();
  let proyectos = await getProyectos();
  proyectos = proyectos.filter(p => p.id !== id);
  localStorage.setItem('ieee_proyectos', JSON.stringify(proyectos));
  return true;
}

export async function getEventos() {
  await delay();
  const stored = localStorage.getItem('ieee_eventos');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  return [...MOCK_EVENTOS];
}

export async function createEvento(data) {
  await delay();
  const eventos = await getEventos();
  const nuevo = { ...data, id: Date.now() };
  eventos.push(nuevo);
  localStorage.setItem('ieee_eventos', JSON.stringify(eventos));
  return nuevo;
}

export async function deleteEvento(id) {
  await delay();
  let eventos = await getEventos();
  eventos = eventos.filter(e => e.id !== id);
  localStorage.setItem('ieee_eventos', JSON.stringify(eventos));
  return true;
}

export async function getMiembros() {
  await delay();
  const stored = localStorage.getItem('ieee_miembros');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  return [...MOCK_MIEMBROS];
}

export async function createMiembro(data) {
  await delay();
  const miembros = await getMiembros();
  if (miembros.find(m => m.email === data.email)) {
    throw new Error('El correo ya está registrado');
  }
  miembros.push(data);
  localStorage.setItem('ieee_miembros', JSON.stringify(miembros));
  return data;
}

export async function updateMiembro(email, data) {
  await delay();
  const miembros = await getMiembros();
  const idx = miembros.findIndex(m => m.email === email);
  if (idx === -1) throw new Error('Miembro no encontrado');
  miembros[idx] = { ...miembros[idx], ...data };
  localStorage.setItem('ieee_miembros', JSON.stringify(miembros));
  return miembros[idx];
}

export async function deleteMiembro(email) {
  await delay();
  let miembros = await getMiembros();
  miembros = miembros.filter(m => m.email !== email);
  localStorage.setItem('ieee_miembros', JSON.stringify(miembros));
  return true;
}

export async function getUserByEmail(email) {
  await delay();
  const miembros = await getMiembros();
  return miembros.find(m => m.email === email) || null;
}

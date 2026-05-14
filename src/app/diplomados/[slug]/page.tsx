import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDiplomadoByShortname,
  getDiplomadoContents,
  moodleCourseUrl,
  type MoodleCourse,
  type MoodleCourseContents,
} from "@/lib/moodle";
import {
  getDiplomadoContenido,
  type DiplomadoContenido,
} from "@/lib/diplomados-content";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function limpiarTexto(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const shortname = slug.toUpperCase();
  const contenido = getDiplomadoContenido(shortname);

  if (contenido) {
    return {
      title: `${contenido.tituloLargo} | Campus Solución Empresarial`,
      description: contenido.resumenCorto.slice(0, 160),
    };
  }

  try {
    const course = await getDiplomadoByShortname(shortname);
    if (!course) return { title: "Diplomado no encontrado" };
    return {
      title: `${course.fullname} | Campus Solución Empresarial`,
      description: limpiarTexto(course.summary).slice(0, 160),
    };
  } catch {
    return { title: "Diplomado | Campus Solución Empresarial" };
  }
}

export default async function DiplomadoDetalle({ params }: PageProps) {
  const { slug } = await params;
  const shortname = slug.toUpperCase();
  const contenido = getDiplomadoContenido(shortname);

  let course: MoodleCourse | null = null;
  let secciones: MoodleCourseContents[] = [];
  try {
    course = await getDiplomadoByShortname(shortname);
    if (course) {
      secciones = await getDiplomadoContents(course.id);
    }
  } catch {
    // Moodle puede estar fuera de línea o sin el curso publicado todavía.
  }

  if (!course && !contenido) notFound();

  const titulo = contenido?.tituloLargo ?? course?.fullname ?? "Diplomado";
  const subtituloModulos = contenido?.modulos.length ?? secciones.filter((s) => s.section >= 1).length;
  const horasTotales = contenido?.duracionHoras;
  const asunto = encodeURIComponent(`Interés en ${titulo}`);

  return (
    <>
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-700 text-white grid place-items-center font-bold text-lg">
              SE
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">Campus Solución Empresarial</div>
              <div className="text-xs text-slate-500">Formación empresarial práctica</div>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
            <Link href="/#diplomados" className="hover:text-slate-900">Diplomados</Link>
            <Link href="/#contacto" className="hover:text-slate-900">Contacto</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Link href="/" className="text-sm text-blue-700 hover:underline">
              ← Volver al catálogo
            </Link>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              {titulo}
            </h1>
            {contenido?.resumenCorto && (
              <p className="mt-4 text-lg text-slate-600 max-w-3xl">
                {contenido.resumenCorto}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {horasTotales !== undefined && (
                <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 font-medium">
                  {horasTotales} horas
                </span>
              )}
              {subtituloModulos > 0 && (
                <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                  {subtituloModulos} módulos
                </span>
              )}
              {contenido?.modalidad && (
                <span className="rounded-full bg-emerald-50 text-emerald-800 px-3 py-1">
                  {contenido.modalidad}
                </span>
              )}
              <span className="rounded-full bg-amber-50 text-amber-800 px-3 py-1">
                Inscripciones próximamente
              </span>
            </div>
            {contenido?.tipoPrograma && (
              <p className="mt-5 text-sm text-slate-500">{contenido.tipoPrograma}</p>
            )}
          </div>
        </section>

        {contenido ? (
          <ContenidoEstructurado contenido={contenido} />
        ) : (
          course && (
            <section className="mx-auto max-w-4xl px-6 py-12">
              <div
                className="prose prose-slate max-w-none [&_ul]:list-disc [&_ul]:pl-6 [&_p]:my-3"
                dangerouslySetInnerHTML={{ __html: course.summary }}
              />
            </section>
          )
        )}

        {!contenido && course && (
          <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">Contenido del programa</h2>
            <p className="mt-2 text-slate-600 text-sm">
              {secciones.filter((s) => s.section >= 1).length} módulos estructurados. Avanza a tu ritmo,
              con seguimiento de tu progreso y evaluación por módulo.
            </p>
            <ol className="mt-8 space-y-3">
              {secciones
                .filter((s) => s.section >= 1)
                .map((m, idx) => (
                  <li
                    key={m.id}
                    className="flex items-start gap-4 rounded-lg border border-slate-200 p-4"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 text-blue-800 grid place-items-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{m.name}</h3>
                      {m.modules.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          {m.modules.length} actividad{m.modules.length === 1 ? "" : "es"}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </section>
        )}

        <section id="inversion" className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
          <div className="rounded-xl bg-slate-50 p-8">
            <h3 className="text-2xl font-semibold text-slate-900 text-center">
              Inversión y acceso
            </h3>

            {contenido?.inversion ? (
              <>
                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  {contenido.inversion.inscripcion && (
                    <div className="rounded-lg bg-white border border-slate-200 p-5 text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                        Inscripción
                      </div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">
                        {contenido.inversion.inscripcion}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Pago único</div>
                    </div>
                  )}
                  {contenido.inversion.matricula && (
                    <div className="rounded-lg bg-white border border-slate-200 p-5 text-center">
                      <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                        Matrícula
                      </div>
                      <div className="mt-2 text-xl font-semibold text-slate-900">
                        {contenido.inversion.matricula}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">Valor del diplomado</div>
                    </div>
                  )}
                  {contenido.inversion.planPagos && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-5 text-center">
                      <div className="text-xs uppercase tracking-wide text-blue-800 font-medium">
                        Plan de pagos
                      </div>
                      <div className="mt-2 text-base font-semibold text-slate-900">
                        {contenido.inversion.planPagos}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">Financiación directa</div>
                    </div>
                  )}
                </div>

                {(contenido.inversion.medioPago || contenido.inversion.cuentaBancaria) && (
                  <div className="mt-6 rounded-lg bg-white border border-slate-200 p-5">
                    <div className="text-sm font-semibold text-slate-900">Medio de pago</div>
                    {contenido.inversion.medioPago && (
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {contenido.inversion.medioPago}
                      </p>
                    )}
                    {contenido.inversion.cuentaBancaria && (
                      <div className="mt-4 rounded-md bg-slate-50 border border-slate-200 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                          Cuenta para transferencia
                        </div>
                        <div className="mt-1 font-mono text-sm text-slate-900">
                          {contenido.inversion.cuentaBancaria}
                        </div>
                        {contenido.inversion.notaTemporal && (
                          <p className="mt-2 text-xs text-amber-700">
                            {contenido.inversion.notaTemporal}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-center text-slate-600 max-w-xl mx-auto text-sm">
                Las inscripciones abren pronto. Escríbenos para reservar tu cupo,
                conocer precios y formas de pago.
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              {contenido?.inversion?.botonInscripcionUrl ? (
                <a
                  href={contenido.inversion.botonInscripcionUrl}
                  className="inline-block rounded-md bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800 text-center"
                >
                  Inscríbete ahora
                </a>
              ) : (
                <a
                  href={`mailto:info@secampus.com?subject=${asunto}`}
                  className="inline-block rounded-md bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800 text-center"
                >
                  Solicitar inscripción
                </a>
              )}
              {course && (
                <a
                  href={moodleCourseUrl(course.id)}
                  className="inline-block rounded-md border border-slate-300 px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 text-center"
                >
                  Acceso al aula virtual
                </a>
              )}
            </div>
            {contenido?.registroAcademico && (
              <p className="mt-6 text-xs text-slate-500 text-center max-w-2xl mx-auto">
                {contenido.registroAcademico}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-semibold text-slate-700">Campus Solución Empresarial</div>
              <div>Solución Empresarial Uno A S.A.S — NIT 901328235-1</div>
            </div>
            <div className="text-xs">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function ContenidoEstructurado({ contenido }: { contenido: DiplomadoContenido }) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium">Duración</div>
            <div className="mt-1 text-slate-900 font-medium">{contenido.duracionHoras} horas</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium">Modalidad</div>
            <div className="mt-1 text-slate-900 font-medium">{contenido.modalidad}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium">Duración por módulo</div>
            <div className="mt-1 text-slate-900">{contenido.duracionPorModulo}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium">Tipo de programa</div>
            <div className="mt-1 text-slate-900">{contenido.tipoPrograma}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">¿Para quién es este diplomado?</h2>
        <p className="mt-4 text-slate-700 leading-relaxed">{contenido.publicoObjetivo}</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">¿Qué lograrás al finalizar?</h2>
        <p className="mt-2 text-slate-600 text-sm">Al terminar el diplomado estarás en capacidad de:</p>
        <ul className="mt-6 space-y-3">
          {contenido.objetivos.map((obj, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-blue-700 grid place-items-center text-xs font-bold">
                ✓
              </span>
              <span className="text-slate-700">{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">
          Estructura modular ({contenido.duracionHoras} horas)
        </h2>
        <p className="mt-2 text-slate-600 text-sm">
          Cada módulo puede tomarse de forma independiente y otorga certificado individual.
          Al completar los {contenido.modulos.length} módulos obtienes el certificado del diplomado completo.
        </p>
        <ol className="mt-8 space-y-3">
          {contenido.modulos.map((m) => (
            <li
              key={m.numero}
              className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 hover:border-blue-300 transition-colors"
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 text-blue-800 grid place-items-center text-sm font-semibold">
                {m.numero}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">
                  Módulo {m.numero}: {m.titulo}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{m.horas} horas</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Metodología</h2>
        <ul className="mt-6 space-y-2 list-disc pl-6 text-slate-700">
          {contenido.metodologia.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Certificación</h2>
        <ul className="mt-6 space-y-2 list-disc pl-6 text-slate-700">
          {contenido.certificacion.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        {contenido.registroAcademico && (
          <p className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-4 border border-slate-200">
            {contenido.registroAcademico}
          </p>
        )}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Beneficios clave</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {contenido.beneficios.map((b, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 p-4 bg-white"
            >
              <p className="text-slate-700 text-sm">{b}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { listDiplomados, slugify, type MoodleCourse } from "@/lib/moodle";
import {
  getDiplomadoContenido,
  listDiplomadosContenido,
} from "@/lib/diplomados-content";

type DiplomadoTarjeta = {
  shortname: string;
  titulo: string;
  resumen: string;
  horas: number | null;
  modulos: number | null;
  modalidad: string | null;
  matricula: string | null;
  enMoodle: boolean;
};

function extraerHoras(summary: string): number | null {
  const m = summary.match(/(\d{2,4})\s*horas/i);
  return m ? Number(m[1]) : null;
}

function extraerModulos(summary: string): number | null {
  const m = summary.match(/(\d+)\s*m[óo]dulos/i);
  return m ? Number(m[1]) : null;
}

function construirCatalogo(moodleCursos: MoodleCourse[]): DiplomadoTarjeta[] {
  const porShortname = new Map<string, DiplomadoTarjeta>();

  for (const c of moodleCursos) {
    const stat = getDiplomadoContenido(c.shortname);
    porShortname.set(c.shortname.toUpperCase(), {
      shortname: c.shortname,
      titulo: stat?.tituloCorto ?? c.fullname.replace(/^Diplomado en\s+/i, ""),
      resumen:
        stat?.resumenCorto ??
        c.summary.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 180),
      horas: stat?.duracionHoras ?? extraerHoras(c.summary),
      modulos: stat?.modulos.length ?? extraerModulos(c.summary),
      modalidad: stat?.modalidad ?? null,
      matricula: stat?.inversion?.matricula ?? null,
      enMoodle: true,
    });
  }

  for (const s of listDiplomadosContenido()) {
    const key = s.shortname.toUpperCase();
    if (!porShortname.has(key)) {
      porShortname.set(key, {
        shortname: s.shortname,
        titulo: s.tituloCorto,
        resumen: s.resumenCorto,
        horas: s.duracionHoras,
        modulos: s.modulos.length,
        modalidad: s.modalidad,
        matricula: s.inversion?.matricula ?? null,
        enMoodle: false,
      });
    }
  }

  return Array.from(porShortname.values());
}

export const revalidate = 300;

export default async function Home() {
  let moodleCursos: MoodleCourse[] = [];
  let errorMoodle = false;
  try {
    moodleCursos = await listDiplomados();
  } catch {
    errorMoodle = true;
  }

  const diplomados = construirCatalogo(moodleCursos);
  const mostrarErrorCatalogo = errorMoodle && diplomados.length === 0;

  return (
    <>
      <header className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-700 text-white grid place-items-center font-bold text-lg">
              SE
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">Campus Solución Empresarial</div>
              <div className="text-xs text-slate-500">Formación empresarial práctica</div>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
            <a href="#diplomados" className="hover:text-slate-900">Diplomados</a>
            <a href="#metodologia" className="hover:text-slate-900">Metodología</a>
            <a href="#contacto" className="hover:text-slate-900">Contacto</a>
            <a
              href="https://campussempresarial.moodlecloud.com"
              className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
            >
              Aula virtual
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28 text-center">
            <p className="inline-block rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-medium">
              Educación para el Trabajo y el Desarrollo Humano
            </p>
            <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Forma tu unidad productiva
              <br className="hidden sm:block" /> con criterio empresarial.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Diplomados 100% virtuales, modulares y prácticos, diseñados para emprendedores,
              pymes y personal administrativo que quiere ordenar su negocio, profesionalizar su
              gestión y certificarse.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              <a
                href="#diplomados"
                className="rounded-md bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800"
              >
                Ver diplomados
              </a>
              <a
                href="#contacto"
                className="rounded-md border border-slate-300 px-6 py-3 text-slate-700 font-medium hover:bg-slate-50"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </section>

        <section id="diplomados" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Diplomados disponibles
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Programas estructurados con certificado por módulo y diploma final al completar el
            plan de estudios. Estudia desde cero o complementa tu experiencia.
          </p>

          {mostrarErrorCatalogo && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              No pudimos cargar el catálogo en este momento. Intenta de nuevo en unos minutos.
            </div>
          )}

          {!mostrarErrorCatalogo && diplomados.length === 0 && (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              Estamos preparando nuestros primeros diplomados. Vuelve pronto.
            </div>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diplomados.map((d) => {
              const slug = slugify(d.shortname);
              return (
                <article
                  key={d.shortname}
                  className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="text-xs font-medium text-amber-700 bg-amber-50 inline-block rounded px-2 py-1 self-start">
                    Próximamente
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Diplomado en {d.titulo}
                  </h3>
                  {d.resumen && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-4">
                      {d.resumen}
                    </p>
                  )}
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    {d.horas !== null && (
                      <div>
                        <dt className="text-slate-500">Duración</dt>
                        <dd className="font-medium text-slate-900">{d.horas} horas</dd>
                      </div>
                    )}
                    {d.modulos !== null && (
                      <div>
                        <dt className="text-slate-500">Módulos</dt>
                        <dd className="font-medium text-slate-900">{d.modulos}</dd>
                      </div>
                    )}
                  </dl>
                  {d.modalidad && (
                    <p className="mt-3 text-xs text-slate-500">{d.modalidad}</p>
                  )}
                  {d.matricula && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="text-xs text-slate-500">Matrícula</div>
                      <div className="text-lg font-semibold text-slate-900">{d.matricula}</div>
                    </div>
                  )}
                  <Link
                    href={`/diplomados/${slug}`}
                    className="mt-6 w-full rounded-md bg-blue-700 px-4 py-2 text-white text-sm font-medium hover:bg-blue-800 text-center"
                  >
                    Ver detalle
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section id="metodologia" className="bg-white border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center">
              Una metodología pensada para aplicar
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-center">
              Aprendizaje basado en proyectos, evaluación por competencias y enfoque en el
              contexto empresarial colombiano.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="text-3xl font-semibold text-blue-700">60%</div>
                <div className="mt-2 font-medium text-slate-900">Práctico</div>
                <p className="mt-1 text-sm text-slate-600">
                  Estudios de caso, talleres aplicados y simulaciones empresariales.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="text-3xl font-semibold text-blue-700">100%</div>
                <div className="mt-2 font-medium text-slate-900">Virtual</div>
                <p className="mt-1 text-sm text-slate-600">
                  Clases en vivo y contenido asincrónico para estudiar a tu ritmo.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="text-3xl font-semibold text-blue-700">Modular</div>
                <div className="mt-2 font-medium text-slate-900">Flexible</div>
                <p className="mt-1 text-sm text-slate-600">
                  Toma módulos individuales o el diplomado completo, según tu objetivo.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <div className="text-3xl font-semibold text-blue-700">ETDH</div>
                <div className="mt-2 font-medium text-slate-900">Certificación</div>
                <p className="mt-1 text-sm text-slate-600">
                  Programa registrado ante la Secretaría de Educación, con certificado por
                  módulo y diploma final.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              ¿Quieres ser parte del primer grupo?
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Déjanos tu correo y te avisamos en cuanto abramos inscripciones para el próximo
              diplomado.
            </p>
            <a
              href="mailto:info@secampus.com"
              className="mt-6 inline-block rounded-md bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800"
            >
              info@secampus.com
            </a>
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

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDiplomadoByShortname,
  getDiplomadoContents,
  moodleCourseUrl,
} from "@/lib/moodle";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = await getDiplomadoByShortname(slug.toUpperCase());
  if (!course) return { title: "Diplomado no encontrado" };
  return {
    title: `${course.fullname} | Campus Solución Empresarial`,
    description: course.summary
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160),
  };
}

export default async function DiplomadoDetalle({ params }: PageProps) {
  const { slug } = await params;
  const course = await getDiplomadoByShortname(slug.toUpperCase());
  if (!course) notFound();

  const contents = await getDiplomadoContents(course.id);
  const modulos = contents.filter((s) => s.section >= 1);

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
              {course.fullname}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1">
                Online
              </span>
              <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                {modulos.length} módulos
              </span>
              <span className="rounded-full bg-amber-50 text-amber-800 px-3 py-1">
                Inscripciones próximamente
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div
            className="prose prose-slate max-w-none [&_ul]:list-disc [&_ul]:pl-6 [&_p]:my-3"
            dangerouslySetInnerHTML={{ __html: course.summary }}
          />
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">Contenido del programa</h2>
          <p className="mt-2 text-slate-600 text-sm">
            {modulos.length} módulos estructurados. Avanza a tu ritmo, con seguimiento de
            tu progreso y evaluación por módulo.
          </p>

          <ol className="mt-8 space-y-3">
            {modulos.map((m, idx) => (
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

        <section className="mx-auto max-w-4xl px-6 py-12 border-t border-slate-200">
          <div className="rounded-xl bg-slate-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Sé de los primeros en inscribirte
            </h3>
            <p className="mt-2 text-slate-600 max-w-xl mx-auto text-sm">
              Las inscripciones abren pronto. Escríbenos para reservar tu cupo o
              recibir información del programa.
            </p>
            <a
              href={`mailto:info@secampus.com?subject=Interés en ${encodeURIComponent(course.fullname)}`}
              className="mt-5 inline-block rounded-md bg-blue-700 px-6 py-3 text-white font-medium hover:bg-blue-800"
            >
              Solicitar información
            </a>
            <p className="mt-4 text-xs text-slate-500">
              <a href={moodleCourseUrl(course.id)} className="hover:text-slate-700">
                Acceso al aula virtual →
              </a>
            </p>
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

const diplomados = [
  {
    titulo: "Gestión Administrativa y Estructura Empresarial",
    subtitulo: "Para Unidades Productivas",
    horas: 160,
    modulos: 8,
    estado: "Próximamente",
  },
];

export default function Home() {
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
              Plataforma educativa online
            </p>
            <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              Forma tu unidad productiva
              <br className="hidden sm:block" /> con criterio empresarial.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              Diplomados prácticos diseñados para emprendedores y dueños de pequeñas
              empresas que quieren ordenar su negocio, profesionalizar su gestión y
              certificarse oficialmente.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
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
          <p className="mt-2 text-slate-600">
            Programas estructurados con certificación al completar el 100% del plan de estudios.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diplomados.map((d) => (
              <article
                key={d.titulo}
                className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-medium text-amber-700 bg-amber-50 inline-block rounded px-2 py-1">
                  {d.estado}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Diplomado en {d.titulo}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{d.subtitulo}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Duración</dt>
                    <dd className="font-medium text-slate-900">{d.horas} horas</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Módulos</dt>
                    <dd className="font-medium text-slate-900">{d.modulos}</dd>
                  </div>
                </dl>
                <button
                  disabled
                  className="mt-6 w-full rounded-md bg-slate-100 px-4 py-2 text-slate-500 text-sm font-medium cursor-not-allowed"
                >
                  Inscripciones próximamente
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="contacto" className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              ¿Quieres ser parte del primer grupo?
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">
              Déjanos tu correo y te avisamos en cuanto abramos inscripciones para el
              próximo diplomado.
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

import "server-only";

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;
const DIPLOMADOS_CATEGORY_ID = Number(
  process.env.MOODLE_DIPLOMADOS_CATEGORY_ID ?? "3"
);

if (!MOODLE_URL || !MOODLE_TOKEN) {
  throw new Error("MOODLE_URL y MOODLE_TOKEN deben estar definidos en el entorno");
}

type Primitive = string | number | boolean;
type ParamValue = Primitive | Primitive[] | Record<string, Primitive> | ParamObject | ParamArray;
type ParamObject = { [k: string]: ParamValue };
type ParamArray = ParamValue[];

function flatten(obj: ParamValue, prefix = "", out: Record<string, string> = {}) {
  if (obj === null || obj === undefined) return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, prefix ? `${prefix}[${i}]` : String(i), out));
    return out;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}[${k}]` : k;
      flatten(v as ParamValue, key, out);
    }
    return out;
  }
  out[prefix] = String(obj);
  return out;
}

type MoodleError = {
  exception: string;
  errorcode: string;
  message: string;
};

async function callMoodle<T>(
  wsfunction: string,
  params: ParamObject = {},
  { revalidate = 300 }: { revalidate?: number | false } = {}
): Promise<T> {
  const url = `${MOODLE_URL}/webservice/rest/server.php`;
  const body = new URLSearchParams({
    wstoken: MOODLE_TOKEN!,
    wsfunction,
    moodlewsrestformat: "json",
    ...flatten(params),
  });
  const res = await fetch(url, {
    method: "POST",
    body,
    next: revalidate === false ? { revalidate: 0 } : { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Moodle ${wsfunction}: HTTP ${res.status}`);
  }
  const data = (await res.json()) as T | MoodleError;
  if (data && typeof data === "object" && "exception" in data) {
    const err = data as MoodleError;
    throw new Error(`Moodle ${wsfunction}: ${err.errorcode} - ${err.message}`);
  }
  return data as T;
}

export type MoodleCourse = {
  id: number;
  fullname: string;
  shortname: string;
  categoryid: number;
  summary: string;
  summaryformat: number;
  format: string;
  startdate: number;
  enddate: number;
  visible: number;
  enablecompletion: number;
  lang: string;
};

export type MoodleCourseContents = {
  id: number;
  name: string;
  section: number;
  visible: number;
  summary: string;
  modules: Array<{
    id: number;
    name: string;
    modname: string;
    visible: number;
    description?: string;
    url?: string;
  }>;
};

export async function listDiplomados(): Promise<MoodleCourse[]> {
  const all = await callMoodle<MoodleCourse[]>("core_course_get_courses");
  return all.filter(
    (c) => c.categoryid === DIPLOMADOS_CATEGORY_ID && c.visible === 1
  );
}

export async function getDiplomadoByShortname(
  shortname: string
): Promise<MoodleCourse | null> {
  const res = await callMoodle<{ courses: MoodleCourse[] }>(
    "core_course_get_courses_by_field",
    { field: "shortname", value: shortname }
  );
  return res.courses?.[0] ?? null;
}

export async function getDiplomadoContents(
  courseid: number
): Promise<MoodleCourseContents[]> {
  return callMoodle<MoodleCourseContents[]>("core_course_get_contents", {
    courseid,
  });
}

export function slugify(shortname: string): string {
  return shortname.toLowerCase();
}

export function moodleCourseUrl(courseid: number): string {
  return `${MOODLE_URL}/course/view.php?id=${courseid}`;
}

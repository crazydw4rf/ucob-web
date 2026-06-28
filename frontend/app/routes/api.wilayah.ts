import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const code = url.searchParams.get("code");

  try {
    if (type === "districts") {
      // 33.02 is Banyumas
      const res = await fetch("https://wilayah.id/api/districts/33.02.json");
      const data = await res.json();
      return Response.json(data);
    } else if (type === "villages" && code) {
      const res = await fetch(`https://wilayah.id/api/villages/${code}.json`);
      const data = await res.json();
      return Response.json(data);
    }
    return Response.json({ error: "Invalid type or missing code" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch from wilayah API" }, { status: 500 });
  }
}

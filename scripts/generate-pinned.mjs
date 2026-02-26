import fs from "node:fs";
import path from "node:path";

const USERNAME = process.env.GH_USERNAME || "IceliosPY";
const TOKEN = process.env.GH_TOKEN;

if (!TOKEN) {
  console.error("Missing GH_TOKEN env var.");
  process.exit(1);
}

const query = `
query($login:String!) {
  user(login:$login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          id
          name
          nameWithOwner
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          updatedAt
          isArchived
          isPrivate
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
}
`;

async function main() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GraphQL error: ${res.status} ${text}`);
  }

  const json = await res.json();
  const nodes = json?.data?.user?.pinnedItems?.nodes ?? [];

  const output = nodes
    .filter(Boolean)
    .filter((r) => !r.isPrivate) // sécurité supplémentaire
    .map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.nameWithOwner,
      description: r.description ?? "",
      url: r.url,
      homepageUrl: r.homepageUrl ?? "",
      stars: r.stargazerCount ?? 0,
      forks: r.forkCount ?? 0,
      language: r.primaryLanguage?.name ?? "",
      languageColor: r.primaryLanguage?.color ?? "#999",
      updatedAt: r.updatedAt,
      archived: !!r.isArchived,
    }));

  const outDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "pinned.generated.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

  console.log(`✅ Generated ${outPath} (${output.length} pinned repos)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
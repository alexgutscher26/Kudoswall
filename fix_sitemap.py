with open('apps/web/src/app/sitemap.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '  const projects = await db.query.project.findMany({\n    where: isNotNull(project.collectionSlug),\n  });',
    '  let projects: any[] = [];\n  try {\n    projects = await db.query.project.findMany({\n      where: isNotNull(project.collectionSlug),\n    });\n  } catch (error) {\n    console.error("Failed to fetch projects for sitemap, returning empty array during build", error);\n    projects = [];\n  }'
)

with open('apps/web/src/app/sitemap.ts', 'w') as f:
    f.write(content)
print("done sitemap")

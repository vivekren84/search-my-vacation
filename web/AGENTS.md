<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Supabase environment routing

Read `docs/09-Development/SUPABASE-ENVIRONMENTS.md` before Supabase coding, local runs, migrations, imports, or database verification.

- Production Vercel deployments use Production Supabase. Preview, Development, and local development use the separate Pre-Prod project.
- The runtime requires `SUPABASE_PROJECT_REF` to match the hostname in `NEXT_PUBLIC_SUPABASE_URL`; missing or mismatched configuration must fail closed.
- Never run tests or development writes against Production. For CLI database changes, inspect the exact project ref before applying anything; do not rely on an unverified linked project.
- Never print, commit, or send Supabase keys. `SUPABASE_SECRET_KEY` is server-only. Keep `.env.local` untracked.

## Release branch rule

R1.3 must be reanalyzed and reassessed before implementation resumes. When authorized, start from the R1.2 `main` baseline and merge R1.3 work only on top of that baseline. Verify that `main` contains only the approved R1.2 code before branching. If `main` contains R1.3 work, stop and resolve the baseline; do not force-reset `main` or merge the legacy R1.3 branches into it.

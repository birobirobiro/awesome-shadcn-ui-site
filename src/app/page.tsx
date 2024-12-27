import { Suspense } from 'react'
import { DataTable } from '@/components/data-table'
import { fetchReadmeContent } from '@/lib/github'

export default async function Page() {
  const data = await fetchReadmeContent()
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="sticky top-0 z-50 bg-emerald-500 p-2 text-center text-sm text-white">
        This site is a repository on GitHub, and I parse the README in HTML format. To add something to the list,{' '}
        <a 
          href="https://github.com/birobirobiro/awesome-shadcn-ui" 
          className="underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          please send me a pull request
        </a>
      </div>

      <div className="container mx-auto py-10 space-y-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-32 h-32">
            <img 
              src="https://raw.githubusercontent.com/birobirobiro/awesome-shadcn-ui/64729b2c178e3fdcb42c0c7bf341bcde7ae502ea/assets/logo.svg" 
              alt="Awesome shadcn/ui logo"
              className="w-full h-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-center">awesome-shadcn/ui</h1>
          <p className="text-center text-zinc-400 max-w-xl">
            A curated list of awesome things related to shadcn/ui
          </p>
          <div className="text-center text-sm text-zinc-400">
            Created by:{' '}
            <a 
              href="https://birobirobiro.dev" 
              className="text-zinc-200 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              birobirobiro.dev
            </a>
          </div>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <DataTable data={data} />
        </Suspense>
      </div>
    </div>
  )
}


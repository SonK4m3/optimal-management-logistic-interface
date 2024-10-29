import { router } from '@/Router.tsx'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Suspense } from 'react'
import AppSkeleton from '@/components/skeleton/AppSkeleton.tsx'

function App() {
    return (
        <Suspense fallback={<AppSkeleton />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}

export default App

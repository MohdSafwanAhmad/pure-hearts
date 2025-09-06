import { createServerSupabaseClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/logout-button'

export default async function DashboardPage(){
     const supabase = await createServerSupabaseClient()  
     const { data, error } = await supabase.auth.getUser()  

     if (error) {
         return (
             <div className="flex items-center justify-center min-h-screen">
                 <h1 className="text-4xl font-bold text-red-600">Error loading user data</h1>
             </div>
         )
     }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Dashboard Page</h1>
                <p className="mt-4">Welcome, {data?.user?.email || 'User'}</p>
                <div className="mt-6">
                    <LogoutButton />
                </div>
            </div>         
        </div>
    )
}
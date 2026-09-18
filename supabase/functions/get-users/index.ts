import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Initialize Supabase client with service role key
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            { auth: { persistSession: false } }
        );

        console.log('Fetching all users with emails...');

        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            return new Response(
                JSON.stringify({ error: profilesError.message }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Fetch all auth users to get emails
        const { data: authData, error: authError } = await supabaseClient.auth.admin.listUsers();

        if (authError) {
            console.error('Error fetching auth users:', authError);
            return new Response(
                JSON.stringify({ error: authError.message }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Merge email data with profiles
        const usersWithEmail = profiles?.map(profile => {
            const authUser = authData.users.find((u: any) => u.id === profile.id);
            return {
                ...profile,
                email: authUser?.email || 'N/A'
            };
        }) || [];

        console.log(`Successfully fetched ${usersWithEmail.length} users`);

        return new Response(
            JSON.stringify({ users: usersWithEmail }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Unexpected error in get-users function:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
                type: 'unexpected_error'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let client: Client | null = null

  try {
    // Parse request body
    const { 
      nombre, 
      telefono, 
      motivo, 
      descripcion, 
      whatsapp_url, 
      whatsapp_number,
      user_agent,
      referrer,
      session_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    } = await req.json()

    // Validate required fields
    if (!nombre || !telefono || !motivo || !descripcion || !whatsapp_url || !whatsapp_number) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Connect directly to PostgreSQL database
    const databaseUrl = Deno.env.get('SUPABASE_DB_URL') || 
      `postgresql://postgres:${Deno.env.get('DB_PASSWORD')}@db.ghghxoxvyvztddeorhed.supabase.co:5432/postgres`
    
    client = new Client(databaseUrl)
    await client.connect()

    // Insert directly using SQL query (bypasses PostgREST entirely)
    const result = await client.queryObject(`
      INSERT INTO asesorias_logs (
        nombre, telefono, motivo, descripcion, whatsapp_url, whatsapp_number,
        user_agent, referrer, session_id, utm_source, utm_medium, 
        utm_campaign, utm_term, utm_content, status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
      ) RETURNING id, created_at
    `, [
      nombre,
      telefono,
      motivo,
      descripcion,
      whatsapp_url,
      whatsapp_number,
      user_agent || null,
      referrer || null,
      session_id || null,
      utm_source || null,
      utm_medium || null,
      utm_campaign || null,
      utm_term || null,
      utm_content || null,
      'submitted'
    ])

    await client.end()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Asesoría logged successfully via direct SQL',
        data: result.rows[0]
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    // Ensure client is closed
    if (client) {
      try {
        await client.end()
      } catch (closeError) {
        console.error('Error closing client:', closeError)
      }
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

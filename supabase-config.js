"use strict";

const SUPABASE_URL =
    "https://hzvyjqrfuqjrcjnxaxba.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_82_ljFQJ90xSiWS3s-odAg_BvPvU5D6";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dnlqcXJmdXFqcmNqbnhheGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjM2MzEsImV4cCI6MjEwODU5OTYzMX0.1ojvh7YOqh6nAHG52Grpunc7lXs3k_4RCh2fJwUJvb0";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
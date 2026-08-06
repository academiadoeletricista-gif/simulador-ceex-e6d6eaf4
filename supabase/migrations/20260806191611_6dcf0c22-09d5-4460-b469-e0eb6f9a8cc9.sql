-- RESTRINGIR EXECUÇÃO DA FUNÇÃO SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;

-- AJUSTAR SEARCH PATH PARA SEGURANÇA
ALTER FUNCTION public.handle_new_user() SET search_path = public;

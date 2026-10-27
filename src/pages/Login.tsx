import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authErrorMessage, loginUser, resendConfirmation } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Dictionary } from "@/i18n/translations";
import memorizLogo from "@/assets/logo.png";

const makeLoginSchema = (t: Dictionary) =>
  z.object({
    email: z.string().email(t.auth.validation.email),
    // Length rules apply at sign-up; older accounts may have shorter passwords
    password: z.string().min(1, t.auth.validation.passwordMin),
  });

type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [linkFailed, setLinkFailed] = useState(false);
  const [resending, setResending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(makeLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  // Arriving from a confirmation email: either signed in already, or the link failed
  useEffect(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    const errorCode = params.get("error_code");
    if (errorCode) {
      setLinkFailed(true);
      // Never show error_description: anyone can put text in a link to this page
      toast.error(t.auth.errors[errorCode] ?? t.auth.genericError);
      navigate(location.pathname, { replace: true }); // drop the error from the address bar
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/language", { replace: true });
    });
    // Only on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleResend() {
    const email = form.getValues("email");
    if (!email || !email.includes("@")) {
      form.setError("email", { message: t.auth.login.resendNeedsEmail });
      return;
    }
    setResending(true);
    try {
      await resendConfirmation(email);
      toast.success(t.auth.login.resent);
    } catch (err) {
      toast.error(authErrorMessage(err, t));
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginUser(values as Required<LoginFormValues>);
      navigate("/language");
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "email_not_confirmed") setLinkFailed(true);
      toast.error(authErrorMessage(err, t));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <img src={memorizLogo} alt="Memoriz" className="w-12 h-16 mx-auto mb-2 object-contain" />
          <CardTitle className="text-2xl font-bold">{t.auth.login.title}</CardTitle>
          <CardDescription>{t.auth.login.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.email}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {t.auth.login.submit}
              </Button>
            </form>
          </Form>
          {linkFailed && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-center text-sm text-amber-800">
              <p>{t.auth.login.linkFailedHelp}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-1 font-medium text-primary hover:underline disabled:opacity-50"
              >
                {t.auth.login.resend}
              </button>
            </div>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.login.noAccount}{" "}
            <Link to="/signup" className="text-primary hover:underline">{t.auth.login.signUpLink}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

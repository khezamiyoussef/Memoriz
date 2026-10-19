import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authErrorMessage, loginUser } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Dictionary } from "@/i18n/translations";

const makeLoginSchema = (t: Dictionary) =>
  z.object({
    email: z.string().email(t.auth.validation.email),
    password: z.string().min(6, t.auth.validation.passwordMin),
  });

type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(makeLoginSchema(t)),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await loginUser(values as Required<LoginFormValues>);
      navigate("/language");
    } catch (err) {
      toast.error(authErrorMessage(err, t));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
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
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.login.noAccount}{" "}
            <Link to="/signup" className="text-primary hover:underline">{t.auth.login.signUpLink}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

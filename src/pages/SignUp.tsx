import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authErrorMessage, registerUser } from "@/lib/api";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Dictionary } from "@/i18n/translations";
import memorizLogo from "@/assets/logo.png";

const makeSignUpSchema = (t: Dictionary) =>
  z
    .object({
      name: z.string().min(2, t.auth.validation.nameMin),
      email: z.string().email(t.auth.validation.email),
      password: z.string().min(6, t.auth.validation.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.auth.validation.passwordMismatch,
      path: ["confirmPassword"],
    });

type SignUpFormValues = z.infer<ReturnType<typeof makeSignUpSchema>>;

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(makeSignUpSchema(t)),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      const { session } = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (!session) {
        // Email confirmation is enabled in Supabase: no session until the link is clicked.
        toast.success(t.auth.signup.checkEmail);
        navigate("/login");
        return;
      }
      navigate("/language");
    } catch (err) {
      toast.error(authErrorMessage(err, t));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <img src={memorizLogo} alt="Memoriz" className="w-12 h-16 mx-auto mb-2 object-contain" />
          <CardTitle className="text-2xl font-bold">{t.auth.signup.title}</CardTitle>
          <CardDescription>{t.auth.signup.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.signup.name}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.auth.signup.namePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.signup.confirmPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {t.auth.signup.submit}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.signup.haveAccount}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t.auth.signup.signInLink}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

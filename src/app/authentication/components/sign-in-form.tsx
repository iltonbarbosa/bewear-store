"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(8, "Senha deve ter pelo menos 6 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
    const router = useRouter();
    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",  
    },
  });

  async function onSubmit(values: FormValues) {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: { 
            onSuccess: () => {
                router.push("/");
            }, 
            onError: (error) => {
                if(error.error.code === 'USER_NOT_FOUND') {
                    toast.error("E-mail ou senha inválidos");
                    return form.setError('email', { message: "E-mail ou senha inválidos", });
                }
                if(error.error.code === 'INVALID_EMAIL_OR_PASSWORD') {
                    toast.error("E-mail ou senha inválidos");
                    return form.setError('email', { message: "E-mail ou senha inválidos", });
                }
                toast.error(error.error.message);    
            }
        } 
    });
    
  }

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="grid gap-6">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o seu e-mail" {...field} />
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
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite a sua senha" type="password" {...field} />
                            </FormControl>
                            
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Entrar</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
        </>
    )
};
 
export default SignInForm;
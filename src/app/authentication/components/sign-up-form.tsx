"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  passwordConfirm: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().trim().min(1, "Nome é obrigatório"),
}).refine((data) => {
    return data.password === data.passwordConfirm;
    }, 
    {
     error: "As senhas não coincidem",
     path: ["passwordConfirm"],   
    }
);

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
    const router = useRouter();
    
    const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",  
      passwordConfirm: ""
    },
  });

  async function onSubmit(values: FormValues) {
    

        await authClient.signUp.email({
            name: values.name, // required
            email: values.email, // required
            password: values.password, // required
            fetchOptions: { 
                onSuccess: () => {
                    router.push("/");
                }, 
                onError: (error) => {
                    if(error.error.code === 'USER_ALREADY_EXISTS') {
                        toast.error("E-mail já está em uso");
                        form.setError('email', { message: "E-mail já cadastrado", });
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
                    <CardHeader>
                    <CardTitle>Criar conta</CardTitle>
                    <CardDescription>
                        Crie uma conta para continuar.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o seu nome" {...field} />
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
                        <FormField
                            control={form.control}
                            name="passwordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirmar Senha</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite sua senha novamente" type="password" {...field} />
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button>Criar conta</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
        </>
    )
};
 
export default SignUpForm;
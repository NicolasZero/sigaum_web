"use client"

import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOff, User2 } from "lucide-react"
import { useEffect, useState } from "react"
import { formLoginSchema, FormLoginData } from "@/app/schema/formLogin"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { AlertDestructive } from "./alert"

import React from "react";

import { useAuth } from "@/context/auth-context"
import { Button } from "./ui/button"

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading,setLoading] = useState(false)
    const auth = useAuth()

    const form = useForm<FormLoginData>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })
    
    if (!auth) return <div>Error: Auth context Esta fallando</div>

    const { login, wrongCredentials, userNotActive } = auth


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    // 2. Define a submit handler.
    function onSubmit(data: FormLoginData) {
        // console.log("Enviando formulario... Esperando respuesta de la API");
        setLoading(true)
        login(data.username, data.password)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-3">
                        {/* ---------Username--------- */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-1 ">
                                    <FormLabel htmlFor="user" >Usuario</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input id="user" placeholder="Mariaperez123" autoComplete="none" {...field} />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-white">
                                                <User2 />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* --------Password-------- */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-1 ">
                                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="*********"
                                                className="pr-10"
                                                autoComplete="none"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-white"
                                            >
                                                {showPassword ? <EyeIcon /> : <EyeOff />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-center mt-4 gap-4">
                    {wrongCredentials && <AlertDestructive>Credenciales incorrectas</AlertDestructive>}
                    {userNotActive && <AlertDestructive>Usuario no activo</AlertDestructive>}
                    <Button disabled={isLoading} type="submit">{isLoading ? 'Ingresando...': 'Ingresar'}</Button>
                </div>
            </form>
        </Form>
    )
}
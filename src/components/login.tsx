"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LoginForm from "@/components/login-form"

export function LoginContainer() {
  return (
    <Card className="sm:w-[320px]">
      <CardHeader>
        <CardTitle className="text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">Ingrese usuario y contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 justify-center">
      </CardFooter>
    </Card>
  )
}

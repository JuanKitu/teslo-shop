import {titleFont} from "@/app/config/fonts";
import {LoginForm} from "@/app/auth/login/ui/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

            <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Ingresar</h1>
            <LoginForm />
        </div>
    );
}

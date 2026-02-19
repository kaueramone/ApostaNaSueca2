import { updatePassword } from "../auth/actions";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-ios-gray6 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Nova Password</h1>
                    <p className="text-ios-gray">Escolha uma nova password segura</p>
                </div>

                <UpdatePasswordForm />
            </div>
        </div>
    );
}

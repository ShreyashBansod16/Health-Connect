import { LoginForm } from "@/components/login-form/login-form";
import { login, signup } from "./actions";
import Header from "@/components/Home/Headers";
import Footer from "@/components/Home/Footer";
export default function LoginPage() {
  return (<div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
  <Header/>
   
  <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
      
        <LoginForm login={login} signup={signup} />
  
  </main>
      

      </div>

  );
}

 
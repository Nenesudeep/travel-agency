import {Link, redirect} from "react-router";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
import {account} from "~/appwrite/client";
import {loginWithGoogle} from "~/appwrite/auth";

export async function clientLoader() {
    //loader function makes app feels faster because we are fetching the data already
    try {
        const user = await account.get(); // checking if the user is available

        if(user.$id) return redirect('/');

    } catch (e) {
        console.log('Error fetching user',e)
    }
}

const SignIn = () => {

    return(
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link to="/">
                            <img
                                src={'assets/icons/logo.svg'}
                                alt={'logo'}
                                className='size-30'
                            />
                        </Link>
                        <h1 className="p-28-bold text-dark-100"> TourVisto </h1>
                    </header>

                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">
                            Start your Travel Journey Here
                        </h2>

                        <p className="p-18-regular text-center text-gray-100 !leading-7">
                            Sign in with google to manage destinations, itineraries and user activity with ease
                        </p>
                    </article>

                    <ButtonComponent
                        type="button"
                        iconCss = "e-search-icon"
                        className='button-class !h-11 !w-full'
                        onClick={loginWithGoogle}
                    >
                        <img src={'assets/icons/google.svg'} className='size-5' />

                        <span className="p-18-semibold text-white">Sign in with Google</span>
                    </ButtonComponent>
                </div>
            </section>
        </main>
    )
}
export default SignIn;
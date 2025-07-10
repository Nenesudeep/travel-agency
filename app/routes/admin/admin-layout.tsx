import {Outlet, redirect} from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations"
import { NavItems } from "components";
import MobileSidebar from "components/MobileSidebar";
import {account} from "~/appwrite/client";
import {getExistingData, storeUserData} from "~/appwrite/auth";

export async function clientLoader() {
    //loader function makes app feels faster because we are fetching the data already
    try {
        const user = await account.get(); // checking if the user is available

        if(!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingData(user.$id);
        console.log('existingUser',existingUser)

        if(existingUser?.status === 'user'){
            return redirect('/') // if user we are not letting them visit the dashboard
        }

        return existingUser?.$id ? existingUser : await storeUserData()

    } catch (e) {
        console.log('Error fetching user',e)
        return redirect('/sign-in');

    }
}

// export async function clientLoader() {
//     try {
//         console.log("Starting clientLoader");
//
//         // Try to get the current session first
//         let session;
//         try {
//             session = await account.getSession('current');
//             console.log("Current session:", session);
//         } catch (sessionError) {
//             console.log("No active session:", sessionError);
//             return redirect('/sign-in');
//         }
//
//         // Then try to get user details
//         try {
//             const user = await account.get();
//             console.log("User data:", user);
//
//             if(!user.$id) {
//                 console.log("No user ID found");
//                 return redirect('/sign-in');
//             }
//
//             // Continue with your logic...
//             const existingUser = await getExistingData(user.$id);
//
//             if(existingUser?.status === 'user'){
//                 return redirect('/');
//             }
//
//             return existingUser?.$id ? existingUser : await storeUserData();
//         } catch (userError) {
//             console.log("Error getting user data:", userError);
//             return redirect('/sign-in');
//         }
//     } catch (e) {
//         console.log('Unexpected error:', e);
//         return redirect('/sign-in');
//     }
// }

const AdminLayout = () => {
  return (
    <div className="admin-layout"> 
        <MobileSidebar/>
        <aside className="w-full max-w-[270px] hidden lg:block">
            <SidebarComponent className="width={270} enableGestures={false}">
                <NavItems/>
            </SidebarComponent>
        </aside>
        <aside className="children">
            <Outlet />
        </aside>
    </div>
  )

};

export default AdminLayout;

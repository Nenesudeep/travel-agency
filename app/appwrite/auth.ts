import {OAuthProvider, Query} from "appwrite";
import {account, appWriteConfig, database} from "./client";
import { redirect } from "react-router";

export const loginWithGoogle= async () => {
    try {
        account.createOAuth2Session(OAuthProvider.Google)

    } catch (e) {
        console.log('loginWithGoogle',e)
    }
}

export const logOutUser= async () => {
    try {
        await account.deleteSession('current');
        return { success: true };
    } catch (e) {
        console.error('Error logging out:', e);
        return { success: false, error: e.message };
    }
}

export const GetUser= async () => {
    try {
        const user = await account.get();

        if(!user) return redirect('/sign-in')

        const { documents } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [
                Query.equal('accountId',user.$id),
                Query.select(['name','email','imageUrl','joinedAt','accountId'])
            ]
        )

        // If user exists in database, return the first document
        if (documents.length > 0) {
            return documents[0];
        }

        // If user doesn't exist in database, return basic user info
        return {
            accountId: user.$id,
            name: user.name,
            email: user.email,
            imageUrl: null,
            joinedAt: new Date().toISOString()
        };
    } catch (e) {
        console.error('Error getting user:', e);
        return null;
    }
}

export const getGooglePicture = async () => {
    try {
        // Get the current session
        const session = await account.getSession('current');

        if (!session || !session.provider || session.provider !== 'google') {
            throw new Error('No active Google session found');
        }

        // Get the access token from the session
        const accessToken = session.providerAccessToken;

        if (!accessToken) {
            throw new Error('No access token available');
        }

        // Call Google People API to get the profile photo
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Google API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the profile photo URL
        const photos = data.photos || [];
        const profilePhoto = photos.find(photo => photo.metadata?.primary) || photos[0];

        if (!profilePhoto || !profilePhoto.url) {
            return null; // No photo available
        }

        return profilePhoto.url;
    } catch (e) {
        console.error('Error fetching Google profile picture:', e);
        return null;
    }
}

export const storeUserData= async () => {
    try {
        // Get current user
        const user = await account.get();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Check if user already exists in database
        const { documents } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal('accountId', user.$id)]
        );

        // Get profile picture URL from Google if available
        let imageUrl = null;
        if (user.provider === 'google') {
            imageUrl = await getGooglePicture();
        }

        const userData = {
            accountId: user.$id,
            name: user.name,
            email: user.email,
            imageUrl: imageUrl || '',
            joinedAt: new Date().toISOString()
        };

        // If user exists, update the document
        if (documents.length > 0) {
            const document = await database.updateDocument(
                appWriteConfig.databaseId,
                appWriteConfig.userCollectionId,
                documents[0].$id,
                userData
            );
            return document;
        }

        // If user doesn't exist, create a new document
        const newDocument = await database.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            userData
        );

        return newDocument;
    } catch (e) {
        console.error('Error storing user data:', e);
        return null;
    }
}

export const getExistingData= async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const { documents } = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [
                Query.equal('accountId', userId),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        );

        if (documents.length === 0) {
            return null;
        }

        return documents[0];
    } catch (e) {
        console.error('Error getting existing data:', e);
        return null;
    }
}

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PetListingPage from './pages/petListing/PetListingPage.jsx';
import PetListingDetailPage from './pages/petListing/PetListingDetailPage.jsx';
import { Home } from './pages';
import Layout from './components/Layout';
import RegistrationPage from './pages/accounts/Register.jsx';
import LoginPage from './pages/accounts/Login.jsx';
import ListingPetSheltersPage from './pages/accounts/ListingShelters.jsx';
import ShelterDetailPage from './pages/accounts/DetailShelter.jsx';
import AccountInfoPage from './pages/accounts/AccountInfoPage.jsx';
import PetPalUserUpdatePage from './pages/accounts/PetPalUserUpdatePage.jsx';
import PetSeekerDetailPage from './pages/accounts/DetailSeeker.jsx';
import ConversationPage from './pages/comments/ConversationPage.jsx';
import PageNotFound from './components/PageNotFound.jsx';
import ShelterBlogsList from './pages/blogs/ListingShelterBlogs.jsx';
import ShelterBlogPage from './pages/blogs/ShelterBlogPage.jsx';
import ShelterBlogPost from './pages/blogs/ShelterBlogPost.jsx';
import ApplicationsPage from './pages/petListing/ApplicationPage.jsx';
import ApplicationForm from './pages/petListing/ApplicationForm.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/pet-listings', // path to Petlisting List
        element: <PetListingPage />,
      },
      {
        path: '/pet-details/:petId', // path to Pet detail List
        element: <PetListingDetailPage />,
      },
      {
        path: '/register',
        element: <RegistrationPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/pet_shelters',
        element: <ListingPetSheltersPage />,
      },
      {
        path: '/pet_shelters/:petShelterID',
        element: <ShelterDetailPage />,
      },
      {
        path: '/account-information',
        element: <AccountInfoPage />,
      },
      {
        path: '/account-update',
        element: <PetPalUserUpdatePage />,
      },
      {
        path: '/pet_seeker/:petSeekerID',
        element: <PetSeekerDetailPage />,
      },
      {
        path: '/application/:appId',
        element: <ConversationPage />,
      },

      {
        path: '/shelter_blogs',
        element: <ShelterBlogsList />,
      },
      {
        path: '/shelter_blogs/:authorId',
        element: <ShelterBlogPage />,
      },
      {
        path: '/shelter_blogs/:authorId/:blogId',
        element: <ShelterBlogPost />,
      },
      {
        path: '/start-application/:petId',
        element: <ApplicationForm />,
      },
      {
        path: '/my_application/:type/:user_user',
        element: <ApplicationsPage />,
      },
      {
        path: '/*',
        element: <PageNotFound />,
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;

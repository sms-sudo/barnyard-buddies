from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    PetSeekerRegisterView,  
    PetSeekerDetailUpdateDeleteView,
    PetShelterRegisterListView,
    PetShelterDetailUpdateDeleteView,
    PetPalUserTypeView,
    RetrieveUserInformation,
    PetSeekerProfileView,
)


urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('petshelter/', PetShelterRegisterListView.as_view()),
    path('petshelter/<int:pk>/', PetShelterDetailUpdateDeleteView.as_view()),
    path('petseeker/', PetSeekerRegisterView.as_view()),
    path('petseeker/<int:pk>/', PetSeekerDetailUpdateDeleteView.as_view()),
    path('user-type/', PetPalUserTypeView.as_view()),
    path('user/', RetrieveUserInformation.as_view()),
    path('petseeker/<int:pk>/profile/', PetSeekerProfileView.as_view(), name='pet_seeker_profile'),
]

 
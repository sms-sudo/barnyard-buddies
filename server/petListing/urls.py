from django.urls import path
from . import views
from .views import PetListingUpdateDeleteDetailView, PetListingCreateList, CreateApplication
app_name = 'petListing'
# we need to update these urls to be nouns only
urlpatterns = [
    path('petListing/', PetListingCreateList.as_view(), name='petlisting-create-view'),
    path('petListing/<int:pk>/', PetListingUpdateDeleteDetailView.as_view(), name='petlisting-update-delete-detail'),
    path('petListing/<int:pk>/applications/', CreateApplication.as_view()),
    path('applications/status/<int:pk>/', views.UpdateApplication.as_view()),
    path('applications/<int:pk>/', views.GetApplication.as_view()),
    path('shelterApplicationsList/<int:user_id>/', views.GetShelterApplicationsList.as_view()),
    path('seekerApplicationsList/<int:user_id>/', views.GetSeekerApplicationList.as_view()),
]
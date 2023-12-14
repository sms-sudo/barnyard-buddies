from django.urls import path
import comments.views as views

urlpatterns = [
    path('applications/<int:pk>/', views.ApplicationCommentListCreate.as_view(), name='list_application_comments'),
    path('shelters/<int:pk>/', views.ShelterCommentListCreate.as_view(), name='list_shelter_comments'),
]

from django.urls import path

from .views import (
    BlogUpdateDeleteView,
    BlogListCreateView,
    BlogRetrieveView,
)


urlpatterns = [
    path('blogs/', BlogListCreateView.as_view(), name='blog_create_list'),
    path('blogs/<int:pk>/', BlogUpdateDeleteView.as_view(), name='blog_delete_update'),
    path('blogs/posts/<int:pk>/', BlogRetrieveView.as_view(), name='blog-detail'),

    
]

 
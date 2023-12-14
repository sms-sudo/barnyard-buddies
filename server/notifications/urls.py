from django.urls import path
from . import views
from .views import NotificationListView, NotificationUpdateView, DeleteAllNotificationsView
app_name = 'notifications'
# we need to update these urls to be nouns only
urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationUpdateView.as_view(), name='notification-delete+update'),
    path('delete_all/', DeleteAllNotificationsView.as_view(), name='delete-all-notifications'),
]
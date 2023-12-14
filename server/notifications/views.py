from django.shortcuts import render
from rest_framework import generics
from .models import Notification
from accounts .models import PetSeeker, PetShelter
from .serializers import NotificationSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class NotificationPagination(PageNumberPagination):
    page_size = 4

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user

        if user.is_pet_seeker: 
            pet_seeker = PetSeeker.objects.filter(user=user).first() # pet_seeker is current user
            if pet_seeker:
                print(pet_seeker.id)
                return Notification.objects.filter(recipient_id=pet_seeker.user).order_by('-created_at')
        elif user.is_pet_shelter:
            pet_shelter = PetShelter.objects.filter(user=user).first()
            if pet_shelter:
                print(pet_shelter.id)
                return Notification.objects.filter(recipient_id=pet_shelter.user).order_by('-created_at')
        print('bad return')
        return Notification.objects.none()



class NotificationUpdateView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save(is_read=True)


class DeleteAllNotificationsView(APIView):
    def delete(self, request, *args, **kwargs):
        user = request.user
        if not user.is_anonymous:
            Notification.objects.filter(recipient=user).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    
    


import logging
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .serializer import CommentSerializer
from rest_framework.generics import CreateAPIView, ListAPIView, ListCreateAPIView
from rest_framework import status, serializers
from rest_framework.response import Response
from .models import Comment
from petListing.models import Application
from accounts.models import PetShelter
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .pagination import NoPagination

# Create your views here.

################# Shelter Comments #################
class ShelterCommentListCreate(ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = NoPagination
    queryset = Comment.objects.all()

    # permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer_instance = CommentSerializer(data=request.data)
        if serializer_instance.is_valid():
            # cannot comment on a shelter that does not exist
            shelter_id = self.kwargs['pk']
            shelter = get_object_or_404(PetShelter, pk=shelter_id)

            serializer_instance.save(comment_made_by_the_user=self.request.user)
            return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        shelter_id = self.kwargs['pk']
        return Comment.objects.filter(object_id=shelter_id, is_application=False, parent_comment=None).order_by('-comment_creation_time')
    
################# Application Comments #################

class ApplicationCommentListCreate(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer_instance = CommentSerializer(data=request.data)
        if serializer_instance.is_valid():
            # step 1: make sure the application exists
            application_id = self.kwargs['pk']
            if not Application.objects.filter(pk=application_id).exists():
                raise serializers.ValidationError("Not a valid application to comment on.")
            
            # step 2: check who wants to comment and validate/save accordingly
            
            application = Application.objects.get(pk=application_id)
     
            
            if application.pet_seeker == self.request.user:
                application.last_updated = timezone.now()
                application.save()
                serializer_instance.save(comment_made_by_the_user=self.request.user)
                return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
            elif application.pet_listing.shelter.user == self.request.user:
                serializer_instance.save(comment_made_by_the_user=self.request.user, object_id=application_id)
                return Response(serializer_instance.data, status=status.HTTP_201_CREATED)
            else:
                raise serializers.ValidationError("You are not authorized to comment on this application.")
        else:

            return Response(serializer_instance.errors, status=status.HTTP_400_BAD_REQUEST)
    def get_queryset(self):
        application_id = self.kwargs['pk']
      
        if not Application.objects.filter(pk=application_id).exists():
            raise serializers.ValidationError("Not a valid application to comment on.")
        application = Application.objects.get(pk=application_id)
        # print(application.pet_listing.shelter)
        if application.pet_seeker == self.request.user:
            return Comment.objects.filter(object_id=application_id, is_application=True).order_by('comment_creation_time')
        elif application.pet_listing.shelter.user == self.request.user:
            return Comment.objects.filter(object_id=application_id, is_application=True).order_by('comment_creation_time')
        else:
            raise serializers.ValidationError("You are not authorized to comment on this application.")

from rest_framework import serializers
from .models import Notification
from accounts.models import PetShelter
from petListing.models import Application
from django.contrib.contenttypes.models import ContentType

class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at', 'recipient_id']

class NotificationUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['is_read']


from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, ImageField
from .models import PetListing
from .models import Application


class PetListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = '__all__'
        read_only_fields = ('date_posted',)
    


class PetListingUpdateSerializer(serializers.ModelSerializer):
    # Making fields optional
    status = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    characteristics = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)
    class Meta:
        model = PetListing
        fields = ['status','description', 'characteristics', 'avatar']
    
    def update(self, instance, validated_data):
        # Only update fields if they are present in the validated_data
        instance.status = validated_data.get('status', instance.status)
        instance.description = validated_data.get('description', instance.description)
        instance.characteristics = validated_data.get('characteristics', instance.characteristics)

        # Handling file field (avatar) separately
        if 'avatar' in validated_data:
            instance.avatar = validated_data.get('avatar')

        instance.save()
        return instance


class PetListingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetListing
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('id', 'pet_seeker', 'pet_listing', 'creation_time', 'last_update_time', "seeker_home_type", "seeker_yard_size", "seeker_pet_care_experience",  "seeker_previous_pets") # can't update these fields
from rest_framework import serializers
from .models import PetSeeker, PetShelter, PetPalUser
from django.core.exceptions import ValidationError


##ADDED NEW
class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetPalUser
        fields = ['id', 'email', 'is_pet_shelter']

class ShelterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetShelter
        fields = ('id', 'user', 'name', 'mission_statement', 'address', 'phone_number')

class SeekerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetSeeker
        fields = ('id', 'user', 'name', 'avatar')


class PetSeekerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    email = serializers.EmailField(write_only = True, style={'input_type': 'email'})
    password = serializers.CharField(write_only =True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only= True, style={'input_type': 'password'})
    avatar = serializers.ImageField(required=False)
    class Meta:
        model = PetSeeker
        fields = ['id', 'email', 'user', 'name', 'avatar', 'password', 'password2']
    
    def validate(self, data):
        if data.get('password') and data.get('password2') and data.get('password') != data.get('password2'):
                raise serializers.ValidationError("The two passwords are not matching.")
        return data

class PetShelterSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    email = serializers.EmailField(write_only = True, style={'input_type': 'email'})
    password = serializers.CharField(write_only =True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only= True, style={'input_type': 'password'})

    class Meta:
        model = PetShelter
        fields = ['id', 'email', 'user', 'name', 'mission_statement', 'address', 'phone_number', 'password', 'password2']

    def validate(self, data):
        if data.get('password') and data.get('password2') and data.get('password') != data.get('password2'):
                raise serializers.ValidationError("The two passwords are not matching.")
        return data

class PetShelterUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    new_password = serializers.CharField(write_only =True, required=False, style={'input_type': 'password'})
    new_password2 = serializers.CharField(write_only= True, required=False,  style={'input_type': 'password'})

    class Meta:
        model = PetShelter
        fields = ['id', 'user', 'name', 'mission_statement', 'address', 'phone_number', 'new_password', 'new_password2']

    def validate(self, data):
        if data.get('new_password') and data.get('new_password2') and data.get('new_password') != data.get('new_password2'):
                raise serializers.ValidationError("The two passwords are not matching.")
        return data  

class PetSeekerUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    new_password = serializers.CharField(write_only =True, required=False, style={'input_type': 'password'})
    new_password2 = serializers.CharField(write_only= True, required=False, style={'input_type': 'password'})
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = PetSeeker
        fields = ['id', 'user', 'name', 'avatar', 'new_password', 'new_password2']
    
    def validate(self, data):
        if data.get('new_password') and data.get('new_password2') and data.get('new_password') != data.get('new_password2'):
                raise serializers.ValidationError("The two passwords are not matching.")
        return data
# serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CatProfile, HealthRecord, Event, FeedingRecord, InteractionRecord, HairballRecord, Recommendation, Resource

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CatProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatProfile
        fields = '__all__'

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class FeedingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedingRecord
        fields = ['id', 'cat', 'date', 'time', 'portion_size', 'food_brand', 'food_type', 'feeding_schedule']

class InteractionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionRecord
        fields = '__all__'

class HairballRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HairballRecord
        fields = '__all__'

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'category', 'title', 'content', 'url']

class RecommendationSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer()

    class Meta:
        model = Recommendation
        fields = ['id', 'cat', 'recommendation_type', 'message', 'status', 'resource']
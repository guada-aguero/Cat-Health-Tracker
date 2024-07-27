# views.py
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CatProfile, HealthRecord, Event, FeedingRecord, InteractionRecord, HairballRecord, Recommendation, Resource
from .serializers import CatProfileSerializer, HealthRecordSerializer, EventSerializer, FeedingRecordSerializer, InteractionRecordSerializer, HairballRecordSerializer, UserSerializer, RecommendationSerializer, ResourceSerializer
from .utils import generate_all_recommendations

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CatProfileViewSet(viewsets.ModelViewSet):
    queryset = CatProfile.objects.all()
    serializer_class = CatProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all().order_by('timestamp')
    serializer_class = HealthRecordSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        cat_id = self.request.query_params.get('cat', None)
        if cat_id is not None:
            return self.queryset.filter(cat_id=cat_id)
        return self.queryset

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

class FeedingRecordViewSet(viewsets.ModelViewSet):
    queryset = FeedingRecord.objects.all().order_by('date', 'time')
    serializer_class = FeedingRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cat_id = self.request.query_params.get('cat', None)
        if cat_id is not None:
            return self.queryset.filter(cat_id=cat_id)
        return self.queryset

class InteractionRecordViewSet(viewsets.ModelViewSet):
    queryset = InteractionRecord.objects.all().order_by('date')
    serializer_class = InteractionRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cat_id = self.request.query_params.get('cat', None)
        if cat_id is not None:
            return self.queryset.filter(cat_id=cat_id)
        return self.queryset

class HairballRecordViewSet(viewsets.ModelViewSet):
    queryset = HairballRecord.objects.all().order_by('date')
    serializer_class = HairballRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cat_id = self.request.query_params.get('cat', None)
        if cat_id is not None:
            return self.queryset.filter(cat_id=cat_id)
        return self.queryset
    
class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Add logging to see if this method is being called correctly
        print("Fetching recommendations for user:", self.request.user)
        queryset = super().get_queryset()
        return queryset.filter(status='pending')

@api_view(['PATCH'])
def update_recommendation_status(request, pk):
    try:
        recommendation = Recommendation.objects.get(pk=pk)
    except Recommendation.DoesNotExist:
        return Response({'error': 'Recommendation not found'}, status=status.HTTP_404_NOT_FOUND)

    status_value = request.data.get('status')
    if status_value not in ['done', 'not_applicable']:
        return Response({'error': 'Invalid status value'}, status=status.HTTP_400_BAD_REQUEST)

    recommendation.status = status_value
    recommendation.save()
    
    # Delete the recommendation if status is 'done' or 'not_applicable'
    if status_value in ['done', 'not_applicable']:
        recommendation.delete()
    
    return Response({'success': 'Recommendation status updated'}, status=status.HTTP_200_OK)
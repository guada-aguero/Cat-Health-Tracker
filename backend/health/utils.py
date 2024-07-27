# utils.py

from .models import HealthRecord, Recommendation, HairballRecord, CatProfile, FeedingRecord
from datetime import datetime, timedelta

def generate_recommendations(cat):
    today = datetime.today().date()

    def recommendation_exists(cat, message):
        return Recommendation.objects.filter(cat=cat, message=message, status='pending').exists()

    # Check for hairball prevention
    recent_hairball_prevention = HairballRecord.objects.filter(cat=cat, date__gte=today - timedelta(days=7))
    if not recent_hairball_prevention.exists():
        message = f"It's been more than a week since the last hairball prevention for {cat.name}. Consider applying a hairball prevention method."
        if not recommendation_exists(cat, message):
            Recommendation.objects.create(cat=cat, recommendation_type='general', message=message)
            print(f"Created recommendation for {cat.name}: {message}")

    # Check for vaccinations
    recent_vaccination = HealthRecord.objects.filter(cat=cat).order_by('-last_vaccination').first()
    if not recent_vaccination or not recent_vaccination.last_vaccination or recent_vaccination.last_vaccination < today - timedelta(days=365):
        message = f"Your cat {cat.name}'s last vaccination was over a year ago or has never been done. Schedule a vaccination appointment."
        if not recommendation_exists(cat, message):
            Recommendation.objects.create(cat=cat, recommendation_type='general', message=message)
            print(f"Created recommendation for {cat.name}: {message}")

    # Check for anti-parasitic
    recent_antiparasitic = HealthRecord.objects.filter(cat=cat).order_by('-last_antiparasitic').first()
    if not recent_antiparasitic or not recent_antiparasitic.last_antiparasitic or recent_antiparasitic.last_antiparasitic < today - timedelta(days=180):
        message = f"Your cat {cat.name}'s last anti-parasitic treatment was over 6 months ago or has never been done. Consider an anti-parasitic treatment."
        if not recommendation_exists(cat, message):
            Recommendation.objects.create(cat=cat, recommendation_type='general', message=message)
            print(f"Created recommendation for {cat.name}: {message}")

    # Check for flea and tick prevention
    recent_flea_tick_prevention = HealthRecord.objects.filter(cat=cat).order_by('-flea_tick_prevention').first()
    if not recent_flea_tick_prevention or not recent_flea_tick_prevention.flea_tick_prevention or recent_flea_tick_prevention.flea_tick_prevention < today - timedelta(days=90):
        message = f"Your cat {cat.name}'s last flea and tick prevention treatment was over 3 months ago or has never been done. Consider a flea and tick prevention treatment."
        if not recommendation_exists(cat, message):
            Recommendation.objects.create(cat=cat, recommendation_type='general', message=message)
            print(f"Created recommendation for {cat.name}: {message}")

    # Check for repetitive food types
    recent_feeding = FeedingRecord.objects.filter(cat=cat).order_by('-date')[:5]
    if len(recent_feeding) == 5:
        food_types = [record.food_type for record in recent_feeding]
        if all(food_type == food_types[0] for food_type in food_types):
            message = f"Your cat {cat.name} has been eating the same type of food ({food_types[0]}) for the last 5 days. Consider varying the food type."
            if not recommendation_exists(cat, message):
                Recommendation.objects.create(cat=cat, recommendation_type='feeding', message=message)
                print(f"Created recommendation for {cat.name}: {message}")

    # Check for free feeding
    if FeedingRecord.objects.filter(cat=cat, feeding_schedule='free').exists():
        message = f"Your cat {cat.name} is on a free feeding schedule. Consider switching to a routine feeding schedule."
        if not recommendation_exists(cat, message):
            Recommendation.objects.create(cat=cat, recommendation_type='feeding', message=message)
            print(f"Created recommendation for {cat.name}: {message}")

def generate_all_recommendations():
    cats = CatProfile.objects.all()
    for cat in cats:
        generate_recommendations(cat)
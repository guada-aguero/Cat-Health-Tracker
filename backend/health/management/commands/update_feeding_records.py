from django.core.management.base import BaseCommand
from health.models import FeedingRecord
import random

class Command(BaseCommand):
    help = 'Update existing feeding records with random values for food_type and feeding_schedule'

    def handle(self, *args, **kwargs):
        food_types = ['wet', 'dry', 'homemade', 'other']
        feeding_schedules = ['routine', 'free']

        # Fetch all unique dates from FeedingRecord
        unique_dates = FeedingRecord.objects.values_list('date', flat=True).distinct()

        for date in unique_dates:
            records_for_date = FeedingRecord.objects.filter(date=date)
            if records_for_date.count() > 1:
                feeding_schedule = 'routine'
            else:
                feeding_schedule = random.choice(feeding_schedules)
            
            for record in records_for_date:
                record.food_type = random.choice(food_types)
                record.feeding_schedule = feeding_schedule
                record.save()

        self.stdout.write(self.style.SUCCESS('Successfully updated feeding records'))
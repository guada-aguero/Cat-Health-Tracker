from django.core.management.base import BaseCommand
from health.utils import generate_all_recommendations

class Command(BaseCommand):
    help = 'Generate recommendations for all cats'

    def handle(self, *args, **kwargs):
        generate_all_recommendations()
        self.stdout.write(self.style.SUCCESS('Successfully generated recommendations for all cats'))

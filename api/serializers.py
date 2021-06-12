from rest_framework import serializers
from .models import MainCycle, Boost


class MainCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainCycle
        fields = '__all__'

class BoostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boost
        fields = ['id', 'power', 'price', 'level', 'boost_type']
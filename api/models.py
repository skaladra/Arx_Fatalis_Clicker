from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class MainCycle(models.Model):
    user = models.OneToOneField(User, null=False, on_delete=models.CASCADE, default=0)
    click_count = models.IntegerField(default=0)
    click_power = models.IntegerField(default=1)
    auto_click_power = models.IntegerField(default=0)
    level = models.IntegerField(default=0)

    def click(self):
        self.click_count += self.click_power
    
    def is_level_up(self):
        if self.click_count > self.count_level_price():
            self.level += 1

            if self.level % 3 == 0:
                return 2
            return 1
        return False

    def count_level_price(self):
        # 1 level: 1000; 2 level: 2000; 3 level: 5000 ...
        return (self.level**2+1)*1000


class Boost(models.Model):
    mainCycle = models.ForeignKey(MainCycle, null=False, on_delete=models.CASCADE)
    power = models.IntegerField(default=1)
    price = models.IntegerField(default=10)
    level = models.IntegerField(default=0)
    boost_type = models.IntegerField(default=0)

    def update(self):
        if self.price > self.mainCycle.click_count:
            return False

        self.mainCycle.click_count -= self.price

        self.level += 1
        self.power *= 2 
        self.price *= 5

        if self.boost_type == 1:
            self.mainCycle.auto_click_power += self.power
            self.price *= 5
        elif self.boost_type == 0:
            self.mainCycle.click_power += self.power

        self.mainCycle.save()

        return self.mainCycle

